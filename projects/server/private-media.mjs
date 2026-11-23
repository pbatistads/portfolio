import { privateHeaders } from "./private-headers.mjs";

// Single byte range only. Unsupported/malformed/multiple ranges return 416.
export function parseByteRange(header, size) {
  if (!Number.isSafeInteger(size) || size < 0) throw new Error("Invalid media size");
  if (header === null) return { start: 0, end: size - 1, partial: false };
  if (header.length > 1024 || size === 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const total = BigInt(size);
  let start, end;
  if (!match[1]) {
    const suffix = BigInt(match[2]);
    if (suffix === 0n) return null;
    start = suffix >= total ? 0n : total - suffix;
    end = total - 1n;
  } else {
    start = BigInt(match[1]);
    end = match[2] ? BigInt(match[2]) : total - 1n;
    if (start >= total || start > end) return null;
    if (end >= total) end = total - 1n;
  }
  return { start: Number(start), end: Number(end), partial: true };
}

export async function servePrivateMedia(request, slug, filename, { authorize, lookup, storage }) {
  const error = status => new Response(null, { status, headers: privateHeaders });
  // No storage construction, metadata read or byte read may precede authorization.
  if (!await authorize(slug)) return error(401);
  const asset = lookup(slug, filename);
  if (!asset) return error(404);
  try {
    const store = await storage();
    const info = await store.stat(asset, request.signal);
    if (!Number.isSafeInteger(info.size) || info.size < 0 || !info.etag) throw new Error("Invalid media metadata");
    // RFC 9110: Range applies to GET, not HEAD. If-Range mismatches send full body.
    const ifRange = request.headers.get("if-range");
    const rangeHeader = request.method === "HEAD" || (ifRange && ifRange !== info.etag) ? null : request.headers.get("range");
    const range = parseByteRange(rangeHeader, info.size);
    const headers = {
      ...privateHeaders,
      "Content-Type": asset.type,
      "Content-Disposition": `${asset.attachment ? "attachment" : "inline"}; filename="${filename}"`,
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Accept-Ranges": "bytes",
    };
    if (!range) return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${info.size}`, "Content-Length": "0" } });
    const length = range.end - range.start + 1;
    headers["Content-Length"] = String(length);
    if (range.partial) headers["Content-Range"] = `bytes ${range.start}-${range.end}/${info.size}`;
    // HEAD never opens a content stream. Empty files do not need one either.
    const body = request.method === "HEAD" || !length ? null : await store.open(asset, { ...range, ...info }, request.signal);
    return new Response(body, { status: range.partial ? 206 : 200, headers });
  } catch {
    // Do not return SDK errors, object URLs, filesystem paths or credentials.
    return error(503);
  }
}
