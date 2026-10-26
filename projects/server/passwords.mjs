import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

export function isPasswordHash(value) {
  return typeof value === "string" &&
    /^scrypt\$131072\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(value);
}

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12 || Buffer.byteLength(password) > 1024) {
    throw new Error("Use uma senha com pelo menos 12 caracteres e no máximo 1024 bytes.");
  }
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, Buffer.from(salt, "hex"), 64, options);
  return `scrypt$131072$8$1$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password, encoded) {
  if (!isPasswordHash(encoded) || typeof password !== "string" || Buffer.byteLength(password) > 1024) return false;
  const [, , , , salt, digest] = encoded.split("$");
  const derived = await scrypt(password, Buffer.from(salt, "hex"), 64, options);
  return timingSafeEqual(derived, Buffer.from(digest, "hex"));
}
