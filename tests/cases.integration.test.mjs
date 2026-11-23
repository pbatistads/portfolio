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
import { networkIdentity } from "../projects/server/network-identity.mjs";

const blue = "contratacao-audiovisual";
const yourh = "educacao-corporativa";
const site = "https://portfolio.example.test";
const markers = /AURORA_(INTERNO|IMAGEM|ARQUIVO)_7F31|ORBITA_(INTERNO|IMAGEM|ARQUIVO)_9C82/;
const blueMarker = /A Bluedesk nasceu de uma ideia|O produto ficou pronto/;
const yourhMarker = /Como eu identifiquei os problemas|Repensando a lógica de acesso|video-educorp/;

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
    // Tests simulate Vercel ingress explicitly. Never inherit local credentials.
    env: { ...process.env, CASE_ALLOWED_ORIGIN: "", CASE_PREVIEW_ORIGIN: "", VERCEL_BRANCH_URL: "", ...env, __NEXT_PROCESSED_ENV: "true", NODE_ENV: "production" },
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
    child.stderr.on("data", () => {});
  });
  return base;
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? listFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}

test("produção: dois cases, origens confiáveis e limites por rede", { timeout: 120000 }, async t => {
  const passwordA = randomBytes(24).toString("base64url");
  const passwordB = randomBytes(24).toString("base64url");
  const hashA = await hashPassword(passwordA), hashB = await hashPassword(passwordB);
  const secret = randomBytes(32).toString("base64url");
  const redisToken = randomBytes(24).toString("base64url");
  const counters = new Map();
  let redisUnavailable = false, invalidRedisResult = false;
  // REST contract emulator. The production Lua must also be verified on real Upstash.
  const redis = createServer(async (request, response) => {
    if (redisUnavailable) { response.writeHead(503).end(); return; }
    assert.equal(request.headers.authorization, `Bearer ${redisToken}`);
    let body = "";
    for await (const chunk of request) body += chunk;
    const command = JSON.parse(body);
    assert.equal(command[0], "EVAL");
    assert.match(command[1], /redis.call\('GET'/);
    assert.match(command[1], /redis.call\('INCR'/);
    assert.match(command[1], /redis.call\('EXPIRE'/);
    assert.match(command[1], /redis.call\('TTL'/);
    assert.equal(command[2], "2");
    const keys = command.slice(3, 5), args = command.slice(5).map(Number);
    assert.deepEqual(args, [900, 20, 500]);
    assert.equal(keys[0].match(/\{[^}]+\}/)[0], keys[1].match(/\{[^}]+\}/)[0]);
    assert.doesNotMatch(keys.join(" "), /203\.0\.113\.|2001:db8/);
    // Synchronous check/increment models the atomic EVAL contract across processes.
    let result = [1, 0];
    for (let i = 0; i < 2; i++) {
      if ((counters.get(keys[i]) ?? 0) >= args[i + 1]) { result = [0, 900]; break; }
    }
    if (result[0] === 1) for (const key of keys) counters.set(key, (counters.get(key) ?? 0) + 1);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ result: invalidRedisResult ? [0, -1] : result }));
  });
  await new Promise(resolve => redis.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => redis.close(resolve)));
  const env = {
    CASE_SESSION_SECRET: secret, CASE_BLUEDESK_HASH: hashA, CASE_YOURH_HASH: hashB,
    SITE_URL: site, VERCEL: "1", VERCEL_ENV: "development", // permits only the local Redis emulator
    UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${redis.address().port}`,
    UPSTASH_REDIS_REST_TOKEN: redisToken, CASE_RATE_LIMIT_NAMESPACE: "integration",
  };
  const base = await startApp(t, env), second = await startApp(t, env);
  const closed = await startApp(t, { ...env, UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "", CASE_RATE_LIMIT_MODE: "local" });
  const get = (url, cookie = "", headers = {}) => fetch(url, { headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) }, cache: "no-store" });
  const post = (base, slug, password, source = site, headers = {}) => fetch(`${base}/api/cases/${slug}/unlock`, {
    method: "POST", headers: { Origin: source, "Content-Type": "application/json", "x-vercel-forwarded-for": "203.0.113.1", ...headers }, body: JSON.stringify({ password }),
  });
  const key = (slug, ip) => `{integration:case-unlock:${slug}}:network:${networkIdentity(new Headers({ "x-vercel-forwarded-for": ip }), { ...env, NODE_ENV: "production" })}`;
  const aggregate = slug => `{integration:case-unlock:${slug}}:aggregate`;
  let cookieA, cookieB;

  await t.test("Home/Sobre: idioma, favicon, canonical e compartilhamento público", async () => {
    for (const route of ["/", "/about"]) {
      const response = await get(base + route), html = await response.text();
      assert.equal(response.status, 200);
      assert.match(html, /lang="pt-BR"/);
      assert.doesNotMatch(html, /Create Next App|Generated by create next app/);
      assert.match(html, /rel="icon"[^>]+href="\/images\/favicon.png"/);
      assert.match(html, /rel="canonical"/);
      assert.match(html, /property="og:locale" content="pt_BR"/);
      assert.match(html, /property="og:image"[^>]+\/images\/about\/me.png/);
      assert.match(html, /name="twitter:card" content="summary"/);
      if (route === "/about") {
        assert.match(html, /rel="canonical"[^>]+\/about"/);
        assert.match(html, /property="og:title" content="Sobre mim \| Poli Batista"/);
      } else {
        assert.match(html, /href="\/cases\/contratacao-audiovisual"/);
        assert.match(html, /href="\/cases\/educacao-corporativa"/);
      }
    }
    assert.equal((await get(base + "/images/favicon.png")).status, 200);
  });

  await t.test("demonstrativos desativados inclusive com cookie válido antigo", async () => {
    for (const slug of ["demo-aurora", "demo-orbita", "demo-publico"]) {
      const cookie = `${cookieName(slug, true)}=${issueSession(slug, secret, hashA)}`;
      for (const headers of [{}, { RSC: "1" }]) {
        const response = await get(`${base}/cases/${slug}`, cookie, headers);
        // A streamed Next notFound can have status 200; inspect the payload too.
        assert.ok([200, 404].includes(response.status));
        assert.doesNotMatch(await response.text(), /ProtectedCaseGate|Processo demonstrativo|AURORA_INTERNO|ORBITA_INTERNO/);
      }
      assert.equal((await post(base, slug, passwordA)).status, 404);
      assert.equal((await get(`${base}/api/cases/${slug}/files/notas.txt`, cookie)).status, 401);
      assert.equal((await get(`${base}/private/cases/${slug}/content.json`)).status, 404);
    }
  });

  await t.test("HTML, RSC, prefetch e metadados não revelam conteúdo privado", async () => {
    for (const slug of [blue, yourh]) {
      for (const headers of [{}, { RSC: "1" }, { RSC: "1", "Next-Router-Prefetch": "1" }]) {
        const response = await get(`${base}/cases/${slug}?_rsc=${randomBytes(4).toString("hex")}`, "", headers);
        const body = await response.text();
        assert.doesNotMatch(body, blueMarker);
        assert.doesNotMatch(body, yourhMarker);
        assert.doesNotMatch(body, /scrypt\$|CASE_SESSION_SECRET/);
        assert.match(response.headers.get("cache-control"), /no-store/);
        if (!headers["Next-Router-Prefetch"]) {
          assert.match(body, /ProtectedCaseGate|Conteúdo protegido/);
          assert.match(body, /noindex/);
          assert.match(body, /Case protegido \| Poli Batista/);
        }
      }
    }
  });

  await t.test("Bluedesk: conteúdo, imagens e vídeos exigem autorização por case", async () => {
    const slug = "contratacao-audiovisual";
    const marker = /A Bluedesk nasceu de uma ideia|O produto ficou pronto/;
    for (const headers of [{}, { RSC: "1" }, { RSC: "1", "Next-Router-Prefetch": "1" }]) {
      const response = await get(`${base}/cases/${slug}?_rsc=bluedesk`, "", headers);
      assert.doesNotMatch(await response.text(), marker);
    }
    const files = ["img-filmmaker-01.png", "img-filmmaker-02.png", "img-filmmaker-03.png",
      "video-filmmaker-01.mp4", "video-filmmaker-02.mp4", "video-filmmaker-01-poster.png", "video-filmmaker-02-poster.png"];
    for (const file of files) {
      assert.equal((await get(`${base}/api/cases/${slug}/files/${file}`, "", { Range: "bytes=0-99" })).status, 401);
      assert.equal((await get(`${base}/private/cases/${slug}/${file}`)).status, 404);
    }
    const response = await post(base, slug, passwordA);
    assert.equal(response.status, 200);
    const cookie = response.headers.get("set-cookie").split(";")[0];
    const html = await (await get(`${base}/cases/${slug}`, cookie)).text();
    assert.match(html, marker);
    assert.match(html, /O que eu validaria antes de lançar/);
    assert.doesNotMatch(await (await get(`${base}/cases/${slug}`)).text(), marker);
    for (const file of files) {
      const asset = await get(`${base}/api/cases/${slug}/files/${file}`, cookie);
      assert.equal(asset.status, 200, file);
      assert.match(asset.headers.get("cache-control"), /no-store/);
      assert.ok((await asset.arrayBuffer()).byteLength > 0);
    }
    const videoUrl = `${base}/api/cases/${slug}/files/video-filmmaker-01.mp4`;
    const range = await get(videoUrl, cookie, { Range: "bytes=0-99" });
    assert.equal(range.status, 206);
    assert.equal((await range.arrayBuffer()).byteLength, 100);
    assert.match(range.headers.get("content-range"), /^bytes 0-99\//);
    assert.equal((await get(videoUrl, cookie, { Range: "bytes=999999999-" })).status, 416);
    const otherCaseCookie = `${cookieName("educacao-corporativa", true)}=${issueSession("educacao-corporativa", secret, hashB)}`;
    assert.equal((await get(videoUrl, otherCaseCookie)).status, 401);
    const expired = `${cookieName(slug, true)}=${issueSession(slug, secret, hashA, Math.floor(Date.now() / 1000) - SESSION_SECONDS - 1)}`;
    assert.equal((await get(videoUrl, expired)).status, 401);
  });

  await t.test("YouRH: senha própria, arquivos privados e isolamento do Bluedesk", async () => {
    const slug = "educacao-corporativa";
    const marker = /Repensando a lógica de acesso aos treinamentos/;
    assert.equal((await post(base, slug, passwordA)).status, 401);
    const unlock = await post(base, slug, passwordB);
    assert.equal(unlock.status, 200);
    const cookie = unlock.headers.get("set-cookie").split(";")[0];
    assert.match(await (await get(`${base}/cases/${slug}`, cookie)).text(), marker);
    assert.doesNotMatch(await (await get(`${base}/cases/${slug}`)).text(), marker);
    const blueCookie = `${cookieName("contratacao-audiovisual", true)}=${issueSession("contratacao-audiovisual", secret, hashA)}`;
    const renamed = `${cookieName(slug, true)}=${blueCookie.split("=")[1]}`;
    for (const invalid of [blueCookie, renamed]) {
      assert.doesNotMatch(await (await get(`${base}/cases/${slug}`, invalid)).text(), marker);
      assert.equal((await get(`${base}/api/cases/${slug}/files/video-educorp-01.mp4`, invalid)).status, 401);
    }
    assert.equal((await get(`${base}/api/cases/contratacao-audiovisual/files/video-filmmaker-01.mp4`, cookie)).status, 401);
    const expired = `${cookieName(slug, true)}=${issueSession(slug, secret, hashB, Math.floor(Date.now() / 1000) - SESSION_SECONDS - 1)}`;
    assert.equal((await get(`${base}/api/cases/${slug}/files/video-educorp-01.mp4`, expired)).status, 401);
    const retired = ["video-educorp-05.mp4", "video-educorp-06.mp4", "video-educorp-05-poster.png", "video-educorp-06-poster.png"];
    for (const name of retired) {
      assert.equal((await get(`${base}/api/cases/${slug}/files/${name}`, cookie)).status, 404);
    }
    const names = (await readdir("private/cases/educacao-corporativa")).filter(name => !retired.includes(name));
    assert.equal(names.filter(name => name.endsWith(".mp4")).length, 6);
    for (const name of names) {
      const url = `${base}/api/cases/${slug}/files/${name}`;
      assert.equal((await get(url)).status, 401, name);
      assert.equal((await get(`${base}/private/cases/${slug}/${name}`)).status, 404, name);
      const response = await get(url, cookie, name.endsWith(".mp4") ? { Range: "bytes=0-99" } : {});
      assert.equal(response.status, name.endsWith(".mp4") ? 206 : 200, name);
      assert.match(response.headers.get("cache-control"), /no-store/);
      assert.ok((await response.arrayBuffer()).byteLength > 0, name);
    }
    assert.equal((await get(`${base}/api/cases/${slug}/files/unknown.svg`, cookie)).status, 404);
    const optimized = await get(`${base}/_next/image?url=%2Fapi%2Fcases%2F${slug}%2Ffiles%2Fvideo-educorp-01-poster.png&w=1080&q=75`, cookie);
    assert.notEqual(optimized.status, 200);
  });



  await t.test("senha incorreta, CSRF e headers Host/Origin forjados", async () => {
    const response = await post(base, blue, "incorrect-password");
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.doesNotMatch(await response.text(), /scrypt\$|incorrect-password/);
    for (const source of ["https://external.invalid", "null", "http://portfolio.example.test", `${site}/`, `${site}.evil.test`]) {
      assert.equal((await post(base, blue, passwordA, source, { Host: "external.invalid", "x-forwarded-host": "external.invalid" })).status, 403);
    }
  });

  await t.test("cookies seguros, isolamento e sessão entre instâncias", async () => {
    for (const [slug, password] of [[blue, passwordA], [yourh, passwordB]]) {
      const response = await post(base, slug, password);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true });
      const header = response.headers.get("set-cookie");
      for (const pattern of [/HttpOnly/i, /Secure/i, /SameSite=lax/i, /Max-Age=86400/i, /Path=\//i]) assert.match(header, pattern);
      assert.doesNotMatch(header, /Domain=/i);
      assert.ok(!header.includes(password) && !header.includes(hashA) && !header.includes(hashB));
      if (slug === blue) cookieA = header.split(";")[0]; else cookieB = header.split(";")[0];
    }
    assert.equal((await post(base, yourh, passwordA)).status, 401);
    assert.equal((await post(base, blue, passwordB)).status, 401);
    for (const origin of [base, second]) {
      assert.match(await (await get(`${origin}/cases/${blue}`, cookieA)).text(), blueMarker);
      assert.match(await (await get(`${origin}/cases/${blue}?_rsc=authorized`, cookieA, { RSC: "1" })).text(), blueMarker);
      assert.doesNotMatch(await (await get(`${origin}/cases/${blue}`)).text(), blueMarker);
    }
    assert.match(await (await get(`${base}/cases/${yourh}`, cookieB)).text(), yourhMarker);
    assert.equal((await get(`${base}/api/cases/${yourh}/files/imgBook.svg`, cookieA)).status, 401);
    const renamed = `${cookieName(yourh, true)}=${cookieA.split("=")[1]}`;
    assert.equal((await get(`${base}/api/cases/${yourh}/files/imgBook.svg`, renamed)).status, 401);
    assert.equal((await get(`${base}/api/cases/${blue}/files/unknown.svg`, cookieA)).status, 404);
    assert.equal((await get(`${base}/api/cases/${blue}/files/%2e%2e%2fcontent.json`, cookieA)).status, 404);
    const expired = issueSession(blue, secret, hashA, Math.floor(Date.now() / 1000) - SESSION_SECONDS - 1);
    for (const token of [expired, `${cookieA.split("=")[1]}x`]) {
      const cookie = `${cookieName(blue, true)}=${token}`;
      assert.doesNotMatch(await (await get(`${base}/cases/${blue}`, cookie)).text(), blueMarker);
      assert.equal((await get(`${base}/api/cases/${blue}/files/img-filmmaker-01.png`, cookie)).status, 401);
    }
  });

  await t.test("fail-closed: Redis ausente, indisponível, inválido ou rede não confiável", async () => {
    for (const target of [closed, base]) {
      redisUnavailable = true;
      const response = await post(target, blue, passwordA);
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("set-cookie"), null);
      redisUnavailable = false;
    }
    invalidRedisResult = true;
    assert.equal((await post(base, blue, passwordA)).status, 503);
    invalidRedisResult = false;
    for (const ip of ["", "unknown", "203.0.113.1, 198.51.100.1"]) {
      assert.equal((await post(base, blue, passwordA, site, { "x-vercel-forwarded-for": ip, "x-forwarded-for": "203.0.113.2", "x-real-ip": "203.0.113.2" })).status, 503);
    }
    // Previously issued sessions continue working when Redis is unavailable.
    redisUnavailable = true;
    assert.match(await (await get(`${base}/cases/${blue}`, cookieA)).text(), blueMarker);
    redisUnavailable = false;
  });

  await t.test("20 tentativas por rede/case: isolamento, concorrência e antifalsificação", async () => {
    counters.clear();
    const limitedKey = key(blue, "203.0.113.1");
    counters.set(limitedKey, 19);
    const results = await Promise.all([base, second].map(target => post(target, blue, "incorrect-password")));
    assert.deepEqual(results.map(r => r.status).sort(), [401, 429]);
    assert.equal(counters.get(limitedKey), 20);
    assert.equal(counters.get(aggregate(blue)), 1);
    for (const target of [base, second]) {
      const response = await post(target, blue, passwordA, site, { "x-forwarded-for": "203.0.113.222", "x-real-ip": "203.0.113.222" });
      assert.equal(response.status, 429);
      assert.equal(response.headers.get("retry-after"), "900");
      assert.equal(response.headers.get("set-cookie"), null);
    }
    assert.equal(counters.get(aggregate(blue)), 1, "blocked network must not consume aggregate budget");
    assert.equal((await post(base, blue, passwordA, site, { "x-vercel-forwarded-for": "203.0.113.2" })).status, 200);
    assert.equal((await post(base, yourh, passwordB)).status, 200);
    counters.set(key(blue, "2001:db8:1234:5678::1"), 20);
    assert.equal((await post(second, blue, passwordA, site, { "x-vercel-forwarded-for": "2001:db8:1234:5678::ffff" })).status, 429);
  });

  await t.test("teto agregado de 500 e namespaces separados por ambiente", async () => {
    counters.clear();
    counters.set(aggregate(blue), 499);
    const results = await Promise.all(["203.0.113.10", "203.0.113.11"].map(ip => post(base, blue, "incorrect-password", site, { "x-vercel-forwarded-for": ip })));
    assert.deepEqual(results.map(r => r.status).sort(), [401, 429]);
    assert.equal(counters.get(aggregate(blue)), 500);
    assert.equal((await post(second, blue, passwordA, site, { "x-vercel-forwarded-for": "203.0.113.12" })).status, 429);
    assert.equal((await post(base, yourh, passwordB)).status, 200);
    const isolated = await startApp(t, { ...env, CASE_RATE_LIMIT_NAMESPACE: "integration-preview" });
    assert.equal((await post(isolated, blue, passwordA)).status, 200);
  });

  await t.test("Production/Preview: apenas origens exatas da configuração confiável", async () => {
    const production = await startApp(t, { ...env, VERCEL_ENV: "production" });
    // HTTP Redis emulator is deliberately rejected outside local development.
    assert.equal((await post(production, blue, passwordA)).status, 503);
    assert.equal((await post(production, blue, passwordA, "https://deploy-123.vercel.app")).status, 403);
    const preview = await startApp(t, { ...env, VERCEL_ENV: "preview", VERCEL_URL: "deploy-123.vercel.app", VERCEL_BRANCH_URL: "portfolio-git-review.vercel.app" });
    for (const origin of ["https://deploy-123.vercel.app", "https://portfolio-git-review.vercel.app"]) assert.equal((await post(preview, blue, passwordA, origin)).status, 503);
    for (const origin of [site, "https://another-project.vercel.app", "http://deploy-123.vercel.app"]) assert.equal((await post(preview, blue, passwordA, origin)).status, 403);
    const untrusted = await startApp(t, { ...env, VERCEL: "", VERCEL_ENV: "", CASE_RATE_LIMIT_MODE: "local" });
    assert.equal((await post(untrusted, blue, passwordA)).status, 503);
    const invalid = await startApp(t, { ...env, VERCEL_ENV: "production", SITE_URL: "http://portfolio.example.test" });
    assert.equal((await post(invalid, blue, passwordA)).status, 503);
  });

  await t.test("conteúdo e segredos ausentes de assets públicos; mídia local fora dos traces", async () => {
    const files = [...await listFiles(".next/static"), ...await listFiles("public"), ...(await listFiles(".next/server/app")).filter(file => /\.(html|rsc|body)$/.test(file))];
    for (const file of files) {
      const body = await readFile(file, "utf8");
      for (const pattern of [markers, blueMarker, yourhMarker]) assert.doesNotMatch(body, pattern, file);
      assert.ok(!body.includes(hashA) && !body.includes(hashB) && !body.includes(secret), file);
    }
    const traces = (await listFiles(".next/server/app")).filter(file => file.endsWith(".nft.json"));
    for (const trace of traces) {
      const manifest = JSON.parse(await readFile(trace, "utf8"));
      assert.ok(!manifest.files.some(file => /private[\\/]cases[\\/]/.test(file)), trace);
    }
    const mediaTrace = traces.find(file => file.includes(path.join("api", "cases", "[slug]", "files")));
    assert.ok(mediaTrace);
    const manifest = JSON.parse(await readFile(mediaTrace, "utf8"));
    assert.ok(!manifest.files.some(file => file.replaceAll("\\", "/").includes("private/cases/")));
  });
});
