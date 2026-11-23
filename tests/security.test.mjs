import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword, isPasswordHash, verifyPassword } from "../projects/server/passwords.mjs";
import { cookieName, issueSession, verifySession, SESSION_SECONDS } from "../projects/server/session-token.mjs";
import { allowedOrigins, parseOrigin, publicSiteOrigin } from "../projects/server/deployment-policy.mjs";
import { networkIdentity, normalizeNetwork } from "../projects/server/network-identity.mjs";

test("origens: HTTPS exato, Production e Preview isolados de Host/Origin", () => {
  const production = { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production", SITE_URL: "https://portfolio.example", VERCEL_URL: "deploy-123.vercel.app" };
  assert.deepEqual(allowedOrigins(production), ["https://portfolio.example"]);
  for (const value of ["http://portfolio.example", "https://portfolio.example/", "https://user@portfolio.example", "https://portfolio.example/path", "https://portfolio.example?x=1", "null", "https://portfolio.example/#x"]) {
    assert.equal(parseOrigin(value), null);
    assert.deepEqual(allowedOrigins({ ...production, SITE_URL: value }), []);
    assert.throws(() => publicSiteOrigin({ ...production, SITE_URL: value }));
  }
  assert.deepEqual(allowedOrigins({ NODE_ENV: "production", CASE_ALLOWED_ORIGIN: "http://localhost:3000" }), []);
  assert.deepEqual(allowedOrigins({ NODE_ENV: "development", CASE_ALLOWED_ORIGIN: "http://localhost:3000" }), ["http://localhost:3000"]);
  assert.deepEqual(allowedOrigins({ NODE_ENV: "production" }), []);
  const preview = { ...production, VERCEL_ENV: "preview", VERCEL_BRANCH_URL: "portfolio-git-review.vercel.app" };
  assert.deepEqual(allowedOrigins(preview), ["https://deploy-123.vercel.app", "https://portfolio-git-review.vercel.app"]);
  assert.equal(publicSiteOrigin(preview), production.SITE_URL);
  assert.deepEqual(allowedOrigins({ ...preview, VERCEL_URL: "deploy-123.vercel.app.evil.test" }), []);
  assert.deepEqual(allowedOrigins({ ...preview, VERCEL_BRANCH_URL: "evil.test/path" }), []);
  assert.deepEqual(allowedOrigins({ ...preview, VERCEL_URL: "" }), []);
  assert.deepEqual(allowedOrigins({ ...preview, CASE_PREVIEW_ORIGIN: "http://preview.example" }), []);
  assert.ok(allowedOrigins({ ...preview, CASE_PREVIEW_ORIGIN: "https://preview.example" }).includes("https://preview.example"));
  assert.deepEqual(allowedOrigins({ ...production, SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "portfolio.example" }), ["https://portfolio.example"]);
  assert.deepEqual(allowedOrigins({ ...production, VERCEL_ENV: "unknown" }), []);
});

test("identidade: só ingress Vercel, sem fallback a headers forjáveis e IPv6 /64", () => {
  const env = { NODE_ENV: "production", VERCEL: "1", CASE_SESSION_SECRET: randomBytes(32).toString("base64url") };
  const headers = new Headers({ "x-vercel-forwarded-for": "203.0.113.1", "x-forwarded-for": "198.51.100.1" });
  const id = networkIdentity(headers, env);
  assert.match(id, /^[a-f0-9]{64}$/);
  assert.equal(networkIdentity(headers, { ...env, VERCEL: "" }), null);
  assert.equal(networkIdentity(new Headers({ "x-forwarded-for": "203.0.113.1", "x-real-ip": "203.0.113.1" }), env), null);
  headers.set("x-forwarded-for", "198.51.100.2");
  assert.equal(networkIdentity(headers, env), id);
  headers.set("x-vercel-forwarded-for", "203.0.113.2");
  assert.notEqual(networkIdentity(headers, env), id);
  for (const ip of ["", "unknown", "203.0.113.1, 203.0.113.2", " 203.0.113.1", "fe80::1%eth0", "999.1.1.1"]) assert.equal(normalizeNetwork(ip), null);
  assert.equal(normalizeNetwork("::ffff:203.0.113.1"), "203.0.113.1");
  assert.equal(normalizeNetwork("0:0:0:0:0:ffff:cb00:7101"), "203.0.113.1");
  assert.equal(normalizeNetwork("2001:db8:1234:5678::1"), normalizeNetwork("2001:0db8:1234:5678:ffff:ffff:ffff:ffff"));
  assert.notEqual(normalizeNetwork("2001:db8:1234:5678::1"), normalizeNetwork("2001:db8:1234:5679::1"));
  assert.equal(networkIdentity(headers, { ...env, CASE_SESSION_SECRET: "" }), null);
});

test("scrypt: salt aleatório, validação e parâmetros seguros fixos", async () => {
  const password = randomBytes(24).toString("base64url");
  const hash = await hashPassword(password);
  const other = await hashPassword(password);
  assert.ok(isPasswordHash(hash));
  assert.notEqual(hash, other);
  assert.ok(await verifyPassword(password, hash));
  assert.equal(await verifyPassword("incorreta", hash), false);
  assert.equal(await verifyPassword(password, hash.replace("131072", "1024")), false);
  assert.equal(await verifyPassword("a".repeat(1025), hash), false);
  await assert.rejects(hashPassword("curta"));
});

test("sessão: slug, assinatura, 24h, expiração, rotação e adulteração", () => {
  const secret = randomBytes(32).toString("base64url");
  const hash = "server-only-test-binding";
  const token = issueSession("a", secret, hash, 1000);
  assert.ok(verifySession(token, "a", secret, hash, 1000));
  assert.ok(verifySession(token, "a", secret, hash, 1000 + SESSION_SECONDS - 1));
  assert.equal(verifySession(token, "a", secret, hash, 1000 + SESSION_SECONDS), false);
  assert.equal(verifySession(token, "b", secret, hash, 1001), false);
  assert.equal(verifySession(token, "a", secret + "rotated", hash, 1001), false);
  assert.equal(verifySession(token, "a", secret, hash + "rotated", 1001), false);
  assert.equal(verifySession(token, "a", secret, hash, 999), false);
  assert.equal(verifySession(token + "x", "a", secret, hash, 1001), false);
  assert.equal(verifySession("invalid", "a", secret, hash, 1001), false);
  assert.notEqual(cookieName("a", true), cookieName("b", true));
  assert.match(cookieName("a", true), /^__Host-/);
});

test("setup local salva somente hashes e preserva $ no carregamento dotenv do Next", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-case-test-"));
  const run = (args, cwd) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    child.stdout.on("data", data => { stdout += data; });
    child.on("error", reject);
    child.on("exit", code => resolve({ code, stdout }));
  });
  try {
    const setup = fileURLToPath(new URL("../scripts/setup-local.mjs", import.meta.url));
    const result = await run([setup], directory);
    assert.equal(result.code, 0);
    const passwordA = result.stdout.match(/Bluedesk: (\S+)/)[1];
    const passwordB = result.stdout.match(/Órbita: (\S+)/)[1];
    assert.notEqual(passwordA, passwordB);
    const file = await readFile(path.join(directory, ".env.local"), "utf8");
    assert.ok(!file.includes(passwordA) && !file.includes(passwordB));
    const loaded = await run(["-e", `const {loadEnvConfig} = require('@next/env'); const env = loadEnvConfig(process.argv[1], true, {info(){},error(){}}).parsedEnv; process.stdout.write(JSON.stringify(env));`, directory], process.cwd());
    assert.equal(loaded.code, 0);
    const env = JSON.parse(loaded.stdout);
    assert.ok(await verifyPassword(passwordA, env.CASE_BLUEDESK_HASH));
    assert.ok(await verifyPassword(passwordB, env.CASE_YOURH_HASH));
    assert.equal((await run([setup], directory)).code, 1);
    assert.equal(await readFile(path.join(directory, ".env.local"), "utf8"), file);
  } finally {
    // Only remove the fresh, explicitly scoped temporary directory created above.
    await rm(directory, { recursive: true, force: true });
  }
});
