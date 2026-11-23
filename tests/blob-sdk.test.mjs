import test from "node:test";
import assert from "node:assert/strict";
import { MockAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import { get } from "@vercel/blob";
import { createBlobStorage } from "../projects/server/media-storage.mjs";
import { servePrivateMedia } from "../projects/server/private-media.mjs";

test("SDK instalado: headers oficiais de get enviam Range sem acesso a serviço real", async () => {
  const previous = getGlobalDispatcher(), mock = new MockAgent();
  mock.disableNetConnect();
  setGlobalDispatcher(mock);
  const etag = '"unit-version"';
  try {
    mock.get("https://teststore.private.blob.vercel-storage.com").intercept({
      method: "GET", path: "/cases/v1/case/movie.mp4?cache=0",
      headers: { range: "bytes=2-4", "if-match": etag },
    }).reply(206, "234", { headers: { "content-type": "video/mp4", "content-length": "3", "content-range": "bytes 2-4/10", etag } });
    const store = createBlobStorage({
      head: async () => ({ size: 10, etag, url: "https://teststore.private.blob.vercel-storage.com/cases/v1/case/movie.mp4" }),
      // Synthetic token only, never resolved from local credentials or sent to a network.
      get: (pathname, options) => get(pathname, { ...options, token: "vercel_blob_rw_teststore_unit-only" }),
    }, {});
    const response = await servePrivateMedia(new Request("https://portfolio.test/file", { headers: { Range: "bytes=2-4" } }), "case", "movie.mp4", {
      authorize: async () => true, lookup: () => ({ path: "case/movie.mp4", type: "video/mp4", attachment: false }), storage: async () => store,
    });
    assert.equal(response.status, 206);
    assert.equal(await response.text(), "234");
    assert.equal(response.headers.get("content-range"), "bytes 2-4/10");
    mock.assertNoPendingInterceptors();
  } finally {
    setGlobalDispatcher(previous);
    await mock.close();
  }
});
