import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createBlobStorage, createLocalStorage, createMediaStorage, blobPath } from "../projects/server/media-storage.mjs";
import { parseByteRange, servePrivateMedia } from "../projects/server/private-media.mjs";

const asset = { path: "case/movie.mp4", type: "video/mp4", attachment: false };
const data = Buffer.from("0123456789"), etag = '"test-version"';
function fakeBlob() {
  const calls = [];
  let cancelled = false;
  const sdk = {
    async head(name) { calls.push(["head", name]); return { size: data.length, etag, url: `https://teststore.private.blob.vercel-storage.com/${name}` }; },
    async get(name, options) {
      calls.push(["get", name, options]);
      let bytes = data;
      const headers = new Headers({ "content-length": String(data.length), etag });
      if (options.headers.Range) {
        const [, start, end] = /^bytes=(\d+)-(\d+)$/.exec(options.headers.Range).map(Number);
        bytes = data.subarray(start, end + 1);
        headers.set("content-range", `bytes ${start}-${end}/${data.length}`);
        headers.set("content-length", String(bytes.length));
      }
      const stream = new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); }, cancel() { cancelled = true; } });
      return { statusCode: 200, stream, headers, blob: { etag } };
    },
  };
  return { sdk, calls, get cancelled() { return cancelled; } };
}
function request(method = "GET", headers = {}) { return new Request("https://portfolio.test/api/cases/case/files/movie.mp4", { method, headers }); }
function deps(store, extra = {}) { return { authorize: async () => true, lookup: () => asset, storage: async () => store, ...extra }; }

test("range: aberto, sufixo, clamp, overflow, vazio e inválidos", () => {
  assert.deepEqual(parseByteRange(null, 10), { start: 0, end: 9, partial: false });
  for (const [input, start, end] of [["bytes=2-4", 2, 4], ["bytes=4-", 4, 9], ["bytes=-3", 7, 9], ["bytes=-100", 0, 9], ["bytes=0-999999999999999999999", 0, 9]]) {
    assert.deepEqual(parseByteRange(input, 10), { start, end, partial: true });
  }
  for (const input of ["", "bytes=-", "bytes=-0", "bytes=10-", "bytes=8-2", "bytes=0-1,3-4", "items=1-2", "bytes=1.5-2", "bytes=999999999999999999999-", "bytes=1--2"]) assert.equal(parseByteRange(input, 10), null, input);
  assert.equal(parseByteRange("bytes=0-", 0), null);
  assert.throws(() => parseByteRange(null, -1));
});

test("autorização e allowlist precedem construção e toda leitura, em GET/HEAD/Range", async () => {
  let touched = 0;
  for (const method of ["GET", "HEAD"]) {
    const response = await servePrivateMedia(request(method, { Range: "bytes=-3" }), "case", "movie.mp4", {
      authorize: async () => false, lookup() { touched++; }, storage() { touched++; },
    });
    assert.equal(response.status, 401);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("vary"), "Cookie");
  }
  const unknown = await servePrivateMedia(request(), "case", "unknown", deps(null, { lookup: () => null, storage() { touched++; } }));
  assert.equal(unknown.status, 404);
  assert.equal(touched, 0);
});

test("Blob simulado: stream 200/206 sem URLs nem headers privados na resposta", async () => {
  for (const [range, expected, status] of [[null, "0123456789", 200], ["bytes=2-4", "234", 206], ["bytes=4-", "456789", 206], ["bytes=-3", "789", 206]]) {
    const fake = fakeBlob(), store = createBlobStorage(fake.sdk, {});
    const response = await servePrivateMedia(request("GET", range ? { Range: range } : {}), "case", "movie.mp4", deps(store));
    assert.equal(response.status, status);
    assert.equal(await response.text(), expected);
    assert.equal(response.headers.get("content-length"), String(expected.length));
    assert.equal(response.headers.get("accept-ranges"), "bytes");
    assert.equal(response.headers.get("location"), null);
    assert.doesNotMatch(JSON.stringify([...response.headers]), /blob\.vercel|Bearer|test-version/);
    for (const header of ["cache-control", "cdn-cache-control", "vercel-cdn-cache-control"]) assert.match(response.headers.get(header), /no-store/);
    const options = fake.calls.find(call => call[0] === "get")[2];
    assert.equal(options.access, "private");
    assert.equal(options.useCache, false);
    assert.equal(options.headers["If-Match"], etag);
    assert.ok(options.abortSignal instanceof AbortSignal);
  }
});

test("HEAD não lê bytes; 416 não abre stream; If-Range incompatível envia 200", async () => {
  const fake = fakeBlob(), store = createBlobStorage(fake.sdk, {});
  const head = await servePrivateMedia(request("HEAD", { Range: "bytes=999-" }), "case", "movie.mp4", deps(store));
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-length"), "10");
  assert.equal(await head.text(), "");
  assert.equal(fake.calls.length, 1);
  const invalid = await servePrivateMedia(request("GET", { Range: "bytes=99-" }), "case", "movie.mp4", deps(store));
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get("content-range"), "bytes */10");
  assert.equal(fake.calls.length, 2);
  const mismatch = await servePrivateMedia(request("GET", { Range: "bytes=2-3", "If-Range": '"old"' }), "case", "movie.mp4", deps(store));
  assert.equal(mismatch.status, 200);
  assert.equal(await mismatch.text(), "0123456789");
});

test("imagens e documentos preservam MIME, attachment e intervalos; arquivos vazios", async () => {
  for (const [type, attachment] of [["image/png", false], ["application/pdf", true]]) {
    const store = createBlobStorage(fakeBlob().sdk, {});
    const response = await servePrivateMedia(request("GET", { Range: "bytes=0-0" }), "case", "document.pdf", deps(store, { lookup: () => ({ ...asset, type, attachment }) }));
    assert.equal(response.status, 206);
    assert.equal(await response.text(), "0");
    assert.equal(response.headers.get("content-type"), type);
    assert.equal(response.headers.get("content-disposition"), `${attachment ? "attachment" : "inline"}; filename="document.pdf"`);
  }
  let opened = false;
  const store = { stat: async () => ({ size: 0, etag }), open() { opened = true; } };
  const empty = await servePrivateMedia(request(), "case", "movie.mp4", deps(store));
  assert.equal(empty.status, 200);
  assert.equal(empty.headers.get("content-length"), "0");
  assert.equal(await empty.text(), "");
  const range = await servePrivateMedia(request("GET", { Range: "bytes=0-" }), "case", "movie.mp4", deps(store));
  assert.equal(range.status, 416);
  assert.equal(range.headers.get("content-range"), "bytes */0");
  assert.equal(opened, false);
});

test("falha fechada em Blob público, ignorando Range, metadados alterados e SDK indisponível", async () => {
  for (const fault of ["public", "range", "etag", "error", "length", "missing"]) {
    const fake = fakeBlob(), originalGet = fake.sdk.get, originalHead = fake.sdk.head;
    if (fault === "public") fake.sdk.head = async name => ({ ...await originalHead(name), url: "https://teststore.public.blob.vercel-storage.com/test" });
    fake.sdk.get = async (name, options) => {
      if (fault === "error") throw new Error("secret-token private-url");
      if (fault === "missing") return null;
      const result = await originalGet(name, options);
      if (fault === "range") result.headers.delete("content-range");
      if (fault === "etag") result.blob.etag = '"changed"';
      if (fault === "length") result.headers.set("content-length", "999");
      return result;
    };
    const response = await servePrivateMedia(request("GET", { Range: "bytes=2-3" }), "case", "movie.mp4", deps(createBlobStorage(fake.sdk, {})));
    assert.equal(response.status, 503, fault);
    assert.equal(await response.text(), "");
    assert.match(response.headers.get("cache-control"), /no-store/);
  }
});

test("stream de mídia grande respeita backpressure e propaga cancelamento", async () => {
  let bytesRead = 0, cancelled = false;
  const store = {
    async stat() { return { size: 1024 ** 4, etag }; },
    async open() {
      return new ReadableStream({
        pull(controller) { bytesRead += 65536; controller.enqueue(new Uint8Array(65536)); },
        cancel() { cancelled = true; },
      }, { highWaterMark: 0 });
    },
  };
  const response = await servePrivateMedia(request(), "case", "movie.mp4", deps(store));
  assert.equal(bytesRead, 0, "response must not buffer content");
  const reader = response.body.getReader();
  assert.equal((await reader.read()).value.byteLength, 65536);
  await reader.cancel();
  assert.equal(bytesRead, 65536);
  assert.ok(cancelled);
});

test("filesystem local: mesmos intervalos, HEAD e proteção de caminhos", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-media-"));
  try {
    await mkdir(path.join(root, "case"));
    await writeFile(path.join(root, asset.path), data);
    const store = createLocalStorage(root);
    const response = await servePrivateMedia(request("GET", { Range: "bytes=-3" }), "case", "movie.mp4", deps(store));
    assert.equal(response.status, 206);
    assert.equal(await response.text(), "789");
    const head = await servePrivateMedia(request("HEAD"), "case", "movie.mp4", deps(store));
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    await assert.rejects(store.stat({ path: "../outside" }));
    assert.throws(() => blobPath("case/movie.mp4", "../unsafe"));
    for (const env of [{ NODE_ENV: "production" }, { NODE_ENV: "development", VERCEL_ENV: "preview" }]) {
      await assert.rejects(createMediaStorage({ ...env, CASE_MEDIA_STORAGE: "local" }));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
