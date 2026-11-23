import "server-only";
import { networkIdentity } from "./network-identity.mjs";

// Check both budgets before incrementing. A blocked network cannot exhaust the
// aggregate budget. One EVAL and a shared Redis hash tag keep this atomic.
const script = `
local network = tonumber(redis.call('GET', KEYS[1]) or '0')
local aggregate = tonumber(redis.call('GET', KEYS[2]) or '0')
if network >= tonumber(ARGV[2]) then return {0, redis.call('TTL', KEYS[1])} end
if aggregate >= tonumber(ARGV[3]) then return {0, redis.call('TTL', KEYS[2])} end
for i = 1, 2 do
  local n = redis.call('INCR', KEYS[i])
  if n == 1 then redis.call('EXPIRE', KEYS[i], ARGV[1]) end
end
return {1, 0}
`;
const windowSeconds = 900;
const networkLimit = 20;
const aggregateLimit = 500;
const local = new Map<string, { count: number; end: number }>();

export async function consumeUnlockAttempt(slug: string, headers: Headers): Promise<
  { status: "allowed" } | { status: "limited"; retryAfter: number } | { status: "unavailable" }
> {
  const identity = networkIdentity(headers);
  if (!identity) return { status: "unavailable" };
  const namespace = process.env.CASE_RATE_LIMIT_NAMESPACE;
  if (!namespace || !/^[a-zA-Z0-9_-]{1,64}$/.test(namespace)) return { status: "unavailable" };
  const prefix = `{${namespace}:case-unlock:${slug}}`;
  const keys = [`${prefix}:network:${identity}`, `${prefix}:aggregate`];

  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1" && process.env.CASE_RATE_LIMIT_MODE === "local") {
    const now = Date.now();
    for (const [key, bucket] of local) if (bucket.end <= now) local.delete(key);
    const buckets = keys.map(key => local.get(key) ?? { count: 0, end: now + windowSeconds * 1000 });
    for (const [i, limit] of [networkLimit, aggregateLimit].entries()) {
      if (buckets[i].count >= limit) return { status: "limited", retryAfter: Math.max(1, Math.ceil((buckets[i].end - now) / 1000)) };
    }
    buckets.forEach((bucket, i) => { bucket.count++; local.set(keys[i], bucket); });
    return { status: "allowed" };
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { status: "unavailable" };
  try {
    const endpoint = new URL(url);
    // Loopback is only the integration emulator; never allowed in a hosted deployment.
    if (endpoint.protocol !== "https:" && !(process.env.VERCEL_ENV === "development" && endpoint.protocol === "http:" && endpoint.hostname === "127.0.0.1")) return { status: "unavailable" };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "2", ...keys, String(windowSeconds), String(networkLimit), String(aggregateLimit)]),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
      redirect: "error",
    });
    if (!response.ok) return { status: "unavailable" };
    const { result, error } = await response.json();
    if (error || !Array.isArray(result) || result.length !== 2 ||
        ![0, 1].includes(result[0]) || !Number.isInteger(result[1]) ||
        (result[0] === 1 ? result[1] !== 0 : result[1] < 1 || result[1] > windowSeconds)) return { status: "unavailable" };
    return result[0] === 1 ? { status: "allowed" } : { status: "limited", retryAfter: result[1] };
  } catch {
    return { status: "unavailable" };
  }
}
