import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { blobPath, localAssetPath } from "../projects/server/media-storage.mjs";

async function digest(stream) {
  const hash = createHash("sha256");
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest("hex");
}

export async function planUploads(cases, root, prefix = "cases/v1") {
  const plan = [];
  for (const entry of Object.values(cases)) {
    for (const asset of Object.values(entry.files)) {
      const file = await localAssetPath(root, asset.path), info = await stat(file);
      if (!info.isFile() || !info.size) throw new Error("Missing or empty private media");
      plan.push({ pathname: blobPath(asset.path, prefix), file, size: info.size, contentType: asset.type, sha256: await digest(createReadStream(file)) });
    }
  }
  if (new Set(plan.map(item => item.pathname)).size !== plan.length) throw new Error("Duplicate private media pathname");
  return plan;
}

function requirePrivate(info) {
  if (!/^https:\/\/[a-z0-9-]+\.private\.blob\.vercel-storage\.com\//i.test(info?.url ?? "")) throw new Error("A private Blob store is required");
}

export async function uploadPlan(plan, sdk) {
  const pending = [];
  let skipped = 0;
  // Check all conflicts before the first write. Only NotFound permits creating.
  for (const item of plan) {
    let info;
    try { info = await sdk.head(item.pathname); }
    catch (error) {
      if (!(error instanceof sdk.BlobNotFoundError)) throw new Error("Unable to inspect private Blob");
      pending.push(item);
      continue;
    }
    requirePrivate(info);
    if (info.size !== item.size) throw new Error("Private media conflict; no overwrite performed");
    const result = await sdk.get(item.pathname, { access: "private", useCache: false, headers: { "If-Match": info.etag } });
    if (result?.statusCode !== 200 || !result.stream || result.blob.etag !== info.etag) {
      await result?.stream?.cancel();
      throw new Error("Unable to verify existing private media");
    }
    const actual = await digest(result.stream);
    if (actual !== item.sha256) throw new Error("Private media conflict; no overwrite performed");
    skipped++;
  }
  let uploaded = 0;
  for (const item of pending) {
    if (await digest(createReadStream(item.file)) !== item.sha256) throw new Error("Local media changed after planning");
    const stream = createReadStream(item.file);
    try {
      const body = Readable.toWeb(stream, { strategy: { highWaterMark: 65536, size: chunk => chunk.byteLength } });
      const result = await sdk.put(item.pathname, body, {
        access: "private", addRandomSuffix: false, allowOverwrite: false,
        contentType: item.contentType, multipart: true,
      });
      requirePrivate(result);
      const saved = await sdk.get(item.pathname, { access: "private", useCache: false });
      if (saved?.statusCode !== 200 || !saved.stream || await digest(saved.stream) !== item.sha256) throw new Error("Private upload verification failed");
      uploaded++;
    } finally { stream.destroy(); }
  }
  return { uploaded, skipped };
}
