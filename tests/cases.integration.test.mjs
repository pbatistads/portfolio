import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createServer as createTcpServer } from "node:net";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "../projects/server/passwords.mjs";
import { cookieName, issueSession, SESSION_SECONDS } from "../projects/server/session-token.mjs";

const markers = /AURORA_(INTERNO|IMAGEM|ARQUIVO)_7F31|ORBITA_(INTERNO|IMAGEM|ARQUIVO)_9C82/;

async function freePort() {
  const server = createTcpServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function startApp(t, env) {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, ...env, NODE_ENV: "production", CASE_ALLOWED_ORIGIN: base },
    stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
  });
  t.after(() => new Promise(resolve => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", resolve);
    child.kill();
  }));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Next.js startup timeout")), 30000);
    child.stdout.on("data", data => { if (data.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
    child.on("error", error => { clearTimeout(timeout); reject(error); });
    child.on("exit", code => { clearTimeout(timeout); reject(new Error(`Next.js exited: ${code}`)); });
    // Do not print environment variables, cookies or submitted passwords.
    child.stderr.on("data", () => {});
  });
  return base;
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? listFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}

test("proteção dos cases no build de produção", { timeout: 120000 }, async t => {
  const passwordA = randomBytes(24).toString("base64url");
  const passwordB = randomBytes(24).toString("base64url");
  const hashA = await hashPassword(passwordA);
  const hashB = await hashPassword(passwordB);
  const secret = randomBytes(32).toString("base64url");
  const redisToken = randomBytes(24).toString("base64url");
  const counters = new Map();
  let redisUnavailable = false;
  // Local REST contract emulator only, NOT a production rate limiter.
  // Multiple Next processes share this external store during the test.
  const redis = createServer(async (request, response) => {
    if (redisUnavailable) { response.writeHead(503).end(); return; }
    assert.equal(request.headers.authorization, `Bearer ${redisToken}`);
    let body = "";
    for await (const chunk of request) body += chunk;
    const command = JSON.parse(body);
    assert.equal(command[0], "EVAL");
    assert.match(command[1], /redis.call\('INCR'/);
    assert.match(command[1], /redis.call\('EXPIRE'/);
    assert.match(command[1], /redis.call\('TTL'/);
    assert.equal(command[2], "1");
    assert.equal(command[4], "900");
    const count = (counters.get(command[3]) ?? 0) + 1;
    counters.set(command[3], count);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ result: [count, 900] }));
  });
  await new Promise(resolve => redis.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => redis.close(resolve)));
  const env = {
    CASE_SESSION_SECRET: secret, CASE_DEMO_AURORA_HASH: hashA, CASE_DEMO_ORBITA_HASH: hashB,
    UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${redis.address().port}`,
    UPSTASH_REDIS_REST_TOKEN: redisToken, CASE_RATE_LIMIT_NAMESPACE: "integration",
  };
  const base = await startApp(t, env);
  const second = await startApp(t, env);
  const closed = await startApp(t, { ...env, UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "", CASE_RATE_LIMIT_MODE: "local" });
  const get = (url, cookie = "", headers = {}) => fetch(url, { headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) }, cache: "no-store" });
  const post = (origin, slug, password, source = origin) => fetch(`${origin}/api/cases/${slug}/unlock`, {
    method: "POST", headers: { Origin: source, "Content-Type": "application/json" }, body: JSON.stringify({ password }),
  });
  let cookieA;
  let cookieB;

  await t.test("Home só contém metadados; case público acessível", async () => {
    const home = await get(base);
    const html = await home.text();
    assert.equal(home.status, 200);
    assert.match(html, /src="\/images\/home\/contratacao-audiovisual\.png"/);
    assert.match(html, /src="\/images\/home\/educacao-corporativa\.png"/);
    assert.doesNotMatch(html, /href="\/cases\/(contratacao-audiovisual|educacao-corporativa)"/);
    assert.doesNotMatch(html, markers);
    const response = await get(`${base}/cases/demo-publico`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Processo demonstrativo/);
  });

  await t.test("HTML, RSC e prefetch bloqueados antes do desbloqueio", async () => {
    for (const slug of ["demo-aurora", "demo-orbita"]) {
      for (const headers of [{}, { RSC: "1" }, { RSC: "1", "Next-Router-Prefetch": "1" }]) {
        const response = await get(`${base}/cases/${slug}?_rsc=${randomBytes(4).toString("hex")}`, "", headers);
        const body = await response.text();
        assert.doesNotMatch(body, markers);
        assert.doesNotMatch(body, /scrypt\$|CASE_SESSION_SECRET|CASE_DEMO_/);
        assert.match(response.headers.get("cache-control"), /no-store/);
        if (headers["Next-Router-Prefetch"]) {
          // Dynamic routes may decline prefetch entirely rather than returning a gate.
          assert.ok(body.length === 0 || /ProtectedCaseGate|Conteúdo protegido/.test(body));
        } else {
          assert.match(body, /ProtectedCaseGate|Conteúdo protegido/);
          assert.match(body, /noindex/);
        }
      }
    }
  });

  await t.test("imagens, arquivos e caminhos diretos não autorizados", async () => {
    for (const [slug, image] of [["demo-aurora", "painel.svg"], ["demo-orbita", "mapa.svg"]]) {
      for (const file of [image, "notas.txt"]) {
        const response = await get(`${base}/api/cases/${slug}/files/${file}`);
        assert.equal(response.status, 401);
        assert.match(response.headers.get("cache-control"), /no-store/);
        assert.doesNotMatch(await response.text(), markers);
      }
      assert.equal((await get(`${base}/private/cases/${slug}/content.json`)).status, 404);
      assert.equal((await get(`${base}/private/cases/${slug}/${image}`)).status, 404);
    }
    const optimized = await get(`${base}/_next/image?url=%2Fapi%2Fcases%2Fdemo-aurora%2Ffiles%2Fpainel.svg&w=1080&q=75`);
    assert.notEqual(optimized.status, 200);
    assert.doesNotMatch(await optimized.text(), markers);
  });

  await t.test("senha incorreta e origem externa rejeitadas", async () => {
    const response = await post(base, "demo-aurora", "incorrect-demo-password");
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.doesNotMatch(await response.text(), /scrypt\$|incorrect-demo-password/);
    assert.equal((await post(base, "demo-aurora", passwordA, "https://external.invalid")).status, 403);
  });

  await t.test("senhas corretas: cookies individuais seguros e sem segredos no corpo", async () => {
    for (const [slug, password] of [["demo-aurora", passwordA], ["demo-orbita", passwordB]]) {
      const response = await post(base, slug, password);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true });
      const header = response.headers.get("set-cookie");
      assert.match(header, /HttpOnly/i);
      assert.match(header, /Secure/i);
      assert.match(header, /SameSite=lax/i);
      assert.match(header, /Max-Age=86400/i);
      assert.match(header, /Path=\//i);
      assert.doesNotMatch(header, /Domain=/i);
      assert.ok(!header.includes(password) && !header.includes(hashA) && !header.includes(hashB));
      if (slug === "demo-aurora") cookieA = header.split(";")[0];
      else cookieB = header.split(";")[0];
    }
  });

  await t.test("isolamento entre cases por senha, sessão e arquivo", async () => {
    assert.equal((await post(base, "demo-orbita", passwordA)).status, 401);
    assert.equal((await post(base, "demo-aurora", passwordB)).status, 401);
    assert.doesNotMatch(await (await get(`${base}/cases/demo-orbita`, cookieA)).text(), markers);
    assert.doesNotMatch(await (await get(`${base}/cases/demo-aurora`, cookieB)).text(), markers);
    const renamed = `${cookieName("demo-orbita", true)}=${cookieA.split("=")[1]}`;
    assert.equal((await get(`${base}/api/cases/demo-orbita/files/mapa.svg`, renamed)).status, 401);
    assert.equal((await get(`${base}/api/cases/demo-orbita/files/mapa.svg`, cookieA)).status, 401);
  });

  await t.test("sessão sobrevive à atualização e funciona em outra instância", async () => {
    for (const origin of [base, base, second]) {
      const response = await get(`${origin}/cases/demo-aurora`, cookieA);
      assert.match(await response.text(), /AURORA_INTERNO_7F31/);
      assert.match(response.headers.get("cache-control"), /no-store/);
      const rsc = await get(`${origin}/cases/demo-aurora?_rsc=authorized`, cookieA, { RSC: "1" });
      assert.match(await rsc.text(), /AURORA_INTERNO_7F31/);
    }
    assert.match(await (await get(`${base}/cases/demo-orbita`, cookieB)).text(), /ORBITA_INTERNO_9C82/);
    // An authorized render must not poison the anonymous cache.
    assert.doesNotMatch(await (await get(`${base}/cases/demo-aurora`)).text(), markers);
    const image = await get(`${base}/api/cases/demo-aurora/files/painel.svg`, cookieA);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("cache-control"), /no-store/);
    assert.match(await image.text(), /AURORA_IMAGEM_7F31/);
    const download = await get(`${base}/api/cases/demo-orbita/files/notas.txt`, cookieB);
    assert.equal(download.status, 200);
    assert.match(download.headers.get("content-disposition"), /attachment/);
    assert.match(await download.text(), /ORBITA_ARQUIVO_9C82/);
    assert.equal((await get(`${base}/api/cases/demo-aurora/files/unknown.svg`, cookieA)).status, 404);
    assert.equal((await get(`${base}/api/cases/demo-aurora/files/%2e%2e%2fcontent.json`, cookieA)).status, 404);
  });

  await t.test("sessão expirada ou adulterada não abre página nem imagem", async () => {
    const expired = issueSession("demo-aurora", secret, hashA, Math.floor(Date.now() / 1000) - SESSION_SECONDS - 1);
    for (const token of [expired, `${cookieA.split("=")[1]}x`]) {
      const cookie = `${cookieName("demo-aurora", true)}=${token}`;
      assert.doesNotMatch(await (await get(`${base}/cases/demo-aurora`, cookie)).text(), markers);
      assert.equal((await get(`${base}/api/cases/demo-aurora/files/painel.svg`, cookie)).status, 401);
    }
  });

  await t.test("produção falha fechada sem Redis, mesmo com modo local", async () => {
    const response = await post(closed, "demo-aurora", passwordA);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("set-cookie"), null);
    redisUnavailable = true;
    assert.equal((await post(base, "demo-aurora", passwordA)).status, 503);
    redisUnavailable = false;
  });

  await t.test("limite compartilhado entre instâncias e erros 429", async () => {
    const key = "integration:case-unlock:demo-aurora";
    counters.set(key, 20);
    for (const origin of [base, second]) {
      const response = await post(origin, "demo-aurora", passwordA);
      assert.equal(response.status, 429);
      assert.equal(response.headers.get("retry-after"), "900");
      assert.equal(response.headers.get("set-cookie"), null);
    }
    assert.equal(counters.get(key), 22);
  });

  await t.test("conteúdo privado ausente de assets públicos, JS, HTML e RSC estáticos", async () => {
    const files = [...await listFiles(".next/static"), ...await listFiles("public"),
      ...(await listFiles(".next/server/app")).filter(file => /\.(html|rsc|body)$/.test(file))];
    for (const file of files) {
      const body = await readFile(file, "utf8");
      assert.doesNotMatch(body, markers, file);
      assert.ok(!body.includes(hashA) && !body.includes(hashB) && !body.includes(secret), file);
    }
    // Verify fixtures are packaged for server functions without becoming client assets.
    const traces = (await listFiles(".next/server/app")).filter(file => file.endsWith(".nft.json"));
    for (const routePart of [path.join("cases", "[slug]"), path.join("api", "cases", "[slug]", "files")]) {
      const trace = traces.find(file => file.includes(routePart));
      assert.ok(trace, `Missing server trace: ${routePart}`);
      const manifest = JSON.parse(await readFile(trace, "utf8"));
      assert.ok(manifest.files.some(file => file.replaceAll("\\", "/").includes("private/cases/demo-aurora/content.json")));
    }
  });
});
