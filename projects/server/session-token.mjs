import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_SECONDS = 24 * 60 * 60;

export function cookieName(slug, production) {
  return `${production ? "__Host-" : ""}case_${createHash("sha256").update(slug).digest("hex").slice(0, 32)}`;
}

function signature(body, secret, passwordHash) {
  // Changing either the password hash or the signing secret revokes old sessions.
  const key = createHmac("sha256", secret).update(passwordHash).digest();
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function issueSession(slug, secret, passwordHash, now = Math.floor(Date.now() / 1000)) {
  const body = Buffer.from(JSON.stringify({ v: 1, slug, iat: now, exp: now + SESSION_SECONDS, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return `${body}.${signature(body, secret, passwordHash)}`;
}

export function verifySession(token, slug, secret, passwordHash, now = Math.floor(Date.now() / 1000)) {
  if (typeof token !== "string" || token.length > 2048) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return false;
  const expected = signature(parts[0], secret, passwordHash);
  if (!timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return data.v === 1 && data.slug === slug && Number.isInteger(data.iat) &&
      Number.isInteger(data.exp) && data.iat <= now && data.exp > now &&
      data.exp === data.iat + SESSION_SECONDS;
  } catch {
    return false;
  }
}
