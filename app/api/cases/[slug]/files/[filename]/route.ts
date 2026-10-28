import { readPrivateAsset } from "@/projects/server/protected-cases";
import { privateHeaders } from "@/projects/server/unlock-case";

export async function GET(request: Request, { params }: RouteContext<"/api/cases/[slug]/files/[filename]">) {
  const { slug, filename } = await params;
  const result = await readPrivateAsset(slug, filename);
  if (result.status !== 200) {
    return new Response(null, { status: result.status, headers: privateHeaders });
  }
  const headers: Record<string, string> = {
      ...privateHeaders,
      "Content-Type": result.type,
      "Content-Disposition": `${result.attachment ? "attachment" : "inline"}; filename="${filename}"`,
      // Only repository-owned SVGs are served, sandboxed against active content.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Cross-Origin-Resource-Policy": "same-origin",
      Vary: "Cookie",
  };
  // Authorize first, including byte-range requests made by mobile video players.
  if (result.type === "video/mp4") {
    const size = result.bytes.length;
    headers["Accept-Ranges"] = "bytes";
    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : Math.max(0, size - Number(match?.[2]));
      const end = match?.[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
      if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) ||
          !Number.isSafeInteger(end) || start > end || start >= size) {
        return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
      }
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      headers["Content-Length"] = String(end - start + 1);
      return new Response(new Uint8Array(result.bytes.subarray(start, end + 1)), { status: 206, headers });
    }
    headers["Content-Length"] = String(size);
  }
  return new Response(new Uint8Array(result.bytes), { headers });
}
