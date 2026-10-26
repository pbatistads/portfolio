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
    const setup = fileURLToPath(new URL("../scripts/setup-demo.mjs", import.meta.url));
    const result = await run([setup], directory);
    assert.equal(result.code, 0);
    const passwordA = result.stdout.match(/Aurora: (\S+)/)[1];
    const passwordB = result.stdout.match(/Órbita: (\S+)/)[1];
    assert.notEqual(passwordA, passwordB);
    const file = await readFile(path.join(directory, ".env.local"), "utf8");
    assert.ok(!file.includes(passwordA) && !file.includes(passwordB));
    const loaded = await run(["-e", `const {loadEnvConfig} = require('@next/env'); const env = loadEnvConfig(process.argv[1], true, {info(){},error(){}}).parsedEnv; process.stdout.write(JSON.stringify(env));`, directory], process.cwd());
    assert.equal(loaded.code, 0);
    const env = JSON.parse(loaded.stdout);
    assert.ok(await verifyPassword(passwordA, env.CASE_DEMO_AURORA_HASH));
    assert.ok(await verifyPassword(passwordB, env.CASE_DEMO_ORBITA_HASH));
    assert.equal((await run([setup], directory)).code, 1);
    assert.equal(await readFile(path.join(directory, ".env.local"), "utf8"), file);
  } finally {
    // Only remove the fresh, explicitly scoped temporary directory created above.
    await rm(directory, { recursive: true, force: true });
  }
});
