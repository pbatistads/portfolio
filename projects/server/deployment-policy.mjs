// Pure server policy, shared with Node tests. Never derive trust from request Host.
export function parseOrigin(value, allowLocal = false) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.origin !== value || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    return url.protocol === "https:" || (allowLocal && local && url.protocol === "http:") ? url.origin : null;
  } catch { return null; }
}

function deploymentOrigin(host) {
  // Environment values only; reject paths, ports, credentials and arbitrary suffixes.
  if (!host || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.vercel\.app$/.test(host)) return null;
  return parseOrigin(`https://${host}`);
}

export function allowedOrigins(env = process.env) {
  if (env.VERCEL === "1" && env.VERCEL_ENV === "preview") {
    const deployment = deploymentOrigin(env.VERCEL_URL);
    const branch = env.VERCEL_BRANCH_URL ? deploymentOrigin(env.VERCEL_BRANCH_URL) : null;
    const custom = env.CASE_PREVIEW_ORIGIN ? parseOrigin(env.CASE_PREVIEW_ORIGIN) : null;
    if (!deployment || (env.VERCEL_BRANCH_URL && !branch) || (env.CASE_PREVIEW_ORIGIN && !custom)) return [];
    return [...new Set([deployment, branch, custom].filter(Boolean))];
  }
  if (env.VERCEL === "1" && !["production", "development"].includes(env.VERCEL_ENV)) return [];
  const configured = env.SITE_URL || env.CASE_ALLOWED_ORIGIN;
  const value = configured || (env.VERCEL === "1" && env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : null);
  const origin = parseOrigin(value, env.NODE_ENV !== "production" && env.VERCEL !== "1");
  return origin ? [origin] : [];
}

export function publicSiteOrigin(env = process.env) {
  // Canonical URLs always point at Production, including when building a Preview.
  const value = env.SITE_URL || (env.VERCEL === "1" && env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : env.CASE_ALLOWED_ORIGIN);
  const origin = parseOrigin(value, env.VERCEL !== "1");
  if (origin) return origin;
  if (env.VERCEL === "1" || value) throw new Error("Configure a valid HTTPS SITE_URL for public metadata.");
  return "http://localhost:3000";
}
