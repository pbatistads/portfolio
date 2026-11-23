import { createReadStream } from "node:fs";
import { stat, realpath } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export function blobPath(assetPath, prefix = "cases/v1") {
  if (!/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(prefix) ||
      !/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(assetPath) || assetPath.includes("..")) throw new Error("Invalid private media path");
  return `${prefix}/${assetPath}`;
}

export async function localAssetPath(root, assetPath) {
  // Also prevent an allowlisted file from escaping through a local symlink.
  blobPath(assetPath);
  const base = await realpath(root), file = await realpath(path.join(base, assetPath));
  const relative = path.relative(base, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Invalid local media path");
  return file;
}

export function createLocalStorage(root = path.join(process.cwd(), "private/cases")) {
  return {
    async stat(asset) {
      const file = await localAssetPath(root, asset.path), info = await stat(file);
      if (!info.isFile()) throw new Error("Private media unavailable");
      return { size: info.size, etag: `"${info.size}-${info.mtimeMs}"` };
    },
    async open(asset, range, signal) {
      const file = await localAssetPath(root, asset.path);
      const stream = createReadStream(file, { start: range.start, end: range.end, signal });
      // Surface filesystem errors before returning HTTP headers.
      await new Promise((resolve, reject) => { stream.once("open", resolve); stream.once("error", reject); });
      return Readable.toWeb(stream, {
        strategy: { highWaterMark: 65536, size: chunk => chunk.byteLength },
      });
    },
  };
}

export function createBlobStorage(sdk, env = process.env) {
  const prefix = env.CASE_BLOB_PREFIX || "cases/v1";
  const pathname = asset => blobPath(asset.path, prefix);
  return {
    async stat(asset, signal) {
      const info = await sdk.head(pathname(asset), { abortSignal: signal });
      if (!/^https:\/\/[a-z0-9-]+\.private\.blob\.vercel-storage\.com\//i.test(info.url)) throw new Error("A private Blob store is required");
      return { size: info.size, etag: info.etag };
    },
    async open(asset, range, signal) {
      // headers and useCache are official SDK get() options. The SDK currently
      // reports statusCode 200 even for a ranged upstream response: verify headers.
      const headers = { "If-Match": range.etag };
      if (range.partial) headers.Range = `bytes=${range.start}-${range.end}`;
      const result = await sdk.get(pathname(asset), { access: "private", useCache: false, headers, abortSignal: signal });
      const expected = range.end - range.start + 1;
      const valid = result?.statusCode === 200 && result.stream && result.blob.etag === range.etag &&
        result.headers.get("content-length") === String(expected) &&
        (range.partial ? result.headers.get("content-range") === `bytes ${range.start}-${range.end}/${range.size}` : !result.headers.get("content-range"));
      if (!valid) {
        await result?.stream?.cancel();
        throw new Error("Invalid private Blob response");
      }
      return result.stream;
    },
  };
}

export async function createMediaStorage(env = process.env) {
  const hosted = env.VERCEL_ENV === "production" || env.VERCEL_ENV === "preview";
  const production = env.NODE_ENV === "production" && env.VERCEL_ENV !== "development";
  if (hosted || production) {
    if (env.CASE_MEDIA_STORAGE && env.CASE_MEDIA_STORAGE !== "blob") throw new Error("Production media requires private Blob");
    return createBlobStorage(await import("@vercel/blob"), env);
  }
  if (env.CASE_MEDIA_STORAGE === "blob") return createBlobStorage(await import("@vercel/blob"), env);
  if (env.CASE_MEDIA_STORAGE && env.CASE_MEDIA_STORAGE !== "local") throw new Error("Invalid media storage mode");
  return createLocalStorage();
}
