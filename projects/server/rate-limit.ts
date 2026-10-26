import "server-only";

// One shared budget per case, regardless of IP, process, region or instance.
// Atomic Lua avoids races and an INCR without TTL after an interrupted request.
const script = `
local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {n, redis.call('TTL', KEYS[1])}
`;
const windowSeconds = 900;
const limit = 20;
const local = new Map<string, { count: number; end: number }>();

export async function consumeUnlockAttempt(slug: string): Promise<
  { status: "allowed" } | { status: "limited"; retryAfter: number } | { status: "unavailable" }
> {
  if (process.env.NODE_ENV !== "production" && process.env.CASE_RATE_LIMIT_MODE === "local") {
    const now = Date.now();
    let bucket = local.get(slug);
    if (!bucket || bucket.end <= now) {
      bucket = { count: 0, end: now + windowSeconds * 1000 };
      local.set(slug, bucket);
    }
    bucket.count++;
    return bucket.count <= limit ? { status: "allowed" } : { status: "limited", retryAfter: Math.ceil((bucket.end - now) / 1000) };
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const namespace = process.env.CASE_RATE_LIMIT_NAMESPACE;
  if (!url || !token || !namespace || !/^[a-zA-Z0-9_-]{1,64}$/.test(namespace)) return { status: "unavailable" };
  try {
    const endpoint = new URL(url);
    // HTTP loopback is useful for the local integration emulator only.
    if (endpoint.protocol !== "https:" && !(endpoint.protocol === "http:" && endpoint.hostname === "127.0.0.1")) return { status: "unavailable" };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "1", `${namespace}:case-unlock:${slug}`, String(windowSeconds)]),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
      redirect: "error",
    });
    if (!response.ok) return { status: "unavailable" };
    const { result, error } = await response.json();
    if (error || !Array.isArray(result) || result.length !== 2 ||
        !Number.isInteger(result[0]) || result[0] < 1 ||
        !Number.isInteger(result[1]) || result[1] < 0 || result[1] > windowSeconds) return { status: "unavailable" };
    return result[0] <= limit ? { status: "allowed" } : { status: "limited", retryAfter: Math.max(1, result[1]) };
  } catch {
    return { status: "unavailable" };
  }
}
