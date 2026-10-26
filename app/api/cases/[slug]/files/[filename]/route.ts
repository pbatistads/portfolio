import { readPrivateAsset } from "@/projects/server/protected-cases";
import { privateHeaders } from "@/projects/server/unlock-case";

export async function GET(_request: Request, { params }: RouteContext<"/api/cases/[slug]/files/[filename]">) {
  const { slug, filename } = await params;
  const result = await readPrivateAsset(slug, filename);
  if (result.status !== 200) {
    return new Response(null, { status: result.status, headers: privateHeaders });
  }
  return new Response(new Uint8Array(result.bytes), {
    headers: {
      ...privateHeaders,
      "Content-Type": result.type,
      "Content-Disposition": `${result.attachment ? "attachment" : "inline"}; filename="${filename}"`,
      // Only repository-owned SVGs are served, sandboxed against active content.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Cross-Origin-Resource-Policy": "same-origin",
      Vary: "Cookie",
    },
  });
}
