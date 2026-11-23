import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export function normalizeNetwork(ip) {
  if (!ip || ip !== ip.trim() || ip.includes("%")) return null;
  const version = isIP(ip);
  if (version === 4) return ip;
  if (version !== 6) return null;
  // URL normalizes embedded IPv4 and compressed/equivalent IPv6 spellings.
  const canonical = new URL(`http://[${ip}]`).hostname.slice(1, -1);
  const [left, right] = canonical.split("::");
  const head = left ? left.split(":") : [];
  const tail = right ? right.split(":") : [];
  const words = right === undefined ? head : [...head, ...Array(8 - head.length - tail.length).fill("0"), ...tail];
  // IPv4-mapped IPv6 must share its native IPv4 budget.
  if (words.slice(0, 5).every(word => parseInt(word, 16) === 0) && parseInt(words[5], 16) === 65535) {
    const a = parseInt(words[6], 16), b = parseInt(words[7], 16);
    return `${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
  }
  return words.slice(0, 4).map(word => parseInt(word, 16).toString(16)).join(":") + "::/64";
}

export function networkIdentity(headers, env = process.env) {
  if (env.NODE_ENV !== "production" && env.VERCEL !== "1" && env.CASE_RATE_LIMIT_MODE === "local") return "local-development";
  // Trust this header only behind Vercel's ingress. Never fall back to XFF/Real-IP.
  if (env.VERCEL !== "1") return null;
  const network = normalizeNetwork(headers.get("x-vercel-forwarded-for"));
  const secret = env.CASE_SESSION_SECRET;
  if (!network || !secret || !/^[A-Za-z0-9_-]{43,}$/.test(secret)) return null;
  return createHmac("sha256", secret).update(`case-rate-network:v1:${network}`).digest("hex");
}
