import { isCaseAuthorized } from "@/projects/server/authorization";
import { getPrivateCase } from "@/projects/server/private-registry";
import { createMediaStorage } from "@/projects/server/media-storage.mjs";
import { servePrivateMedia } from "@/projects/server/private-media.mjs";

function lookup(slug: string, filename: string) {
  const entry = getPrivateCase(slug);
  if (!entry || !Object.hasOwn(entry.files, filename)) return null;
  const files: Record<string, { path: string; type: string; attachment: boolean }> = entry.files;
  return files[filename];
}

async function handle(request: Request, { params }: RouteContext<"/api/cases/[slug]/files/[filename]">) {
  const { slug, filename } = await params;
  return servePrivateMedia(request, slug, filename, {
    authorize: isCaseAuthorized, lookup, storage: () => createMediaStorage(),
  });
}

export { handle as GET, handle as HEAD };
