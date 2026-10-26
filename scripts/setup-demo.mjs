import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { hashPassword } from "../projects/server/passwords.mjs";

try {
  const aurora = randomBytes(18).toString("base64url");
  const orbita = randomBytes(18).toString("base64url");
  const hashA = await hashPassword(aurora);
  const hashB = await hashPassword(orbita);
  const env = [
    `CASE_SESSION_SECRET=${randomBytes(32).toString("base64url")}`,
    `CASE_DEMO_AURORA_HASH=${hashA.replaceAll("$", "\\$")}`,
    `CASE_DEMO_ORBITA_HASH=${hashB.replaceAll("$", "\\$")}`,
    "CASE_ALLOWED_ORIGIN=http://localhost:3000",
    "CASE_RATE_LIMIT_MODE=local",
    "CASE_RATE_LIMIT_NAMESPACE=portfolio-development",
    "",
  ].join("\n");
  // Never replace an existing environment file or persist plaintext passwords.
  await writeFile(".env.local", env, { flag: "wx", mode: 0o600 });
  console.log(".env.local criado com hashes e chave aleatória. Guarde estas senhas; elas não foram salvas:");
  console.log(`Aurora: ${aurora}\nÓrbita: ${orbita}`);
  console.log("Use npm run dev. Este modo local não habilita desbloqueios em produção.");
} catch (error) {
  console.error(error.code === "EEXIST" ? ".env.local já existe. Configure as variáveis manualmente com .env.example; nenhum arquivo foi alterado." : error.message);
  process.exitCode = 1;
}
