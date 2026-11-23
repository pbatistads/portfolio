import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { planUploads, uploadPlan } from "../scripts/private-upload.mjs";

test("upload privado: simulação local, idempotência, conflito e falha sem sobrescrita", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-upload-"));
  class NotFound extends Error {}
  const objects = new Map(), puts = [];
  let failHead = false, publicStore = false;
  const sdk = {
    BlobNotFoundError: NotFound,
    async head(name) {
      if (failHead) throw new Error("network error with sensitive details");
      if (!objects.has(name)) throw new NotFound();
      return { size: objects.get(name).length, etag: '"version"', url: `https://test.${publicStore ? "public" : "private"}.blob.vercel-storage.com/${name}` };
    },
    async get(name, options) {
      assert.equal(options.access, "private");
      assert.equal(options.useCache, false);
      return { statusCode: 200, blob: { etag: '"version"' }, stream: new Blob([objects.get(name)]).stream() };
    },
    async put(name, stream, options) {
      assert.equal(options.access, "private");
      assert.equal(options.allowOverwrite, false);
      assert.equal(options.addRandomSuffix, false);
      assert.equal(options.multipart, true);
      assert.ok(!objects.has(name));
      objects.set(name, Buffer.from(await new Response(stream).arrayBuffer()));
      puts.push(name);
      return { url: `https://test.private.blob.vercel-storage.com/${name}` };
    },
  };
  try {
    await mkdir(path.join(root, "case"));
    await writeFile(path.join(root, "case/image.png"), "original-media");
    const registry = { case: { files: { "image.png": { path: "case/image.png", type: "image/png" } } } };
    const plan = await planUploads(registry, root);
    assert.equal(puts.length, 0, "planning must be local only");
    assert.equal(plan.length, 1);
    assert.equal(plan[0].pathname, "cases/v1/case/image.png");
    assert.deepEqual(await uploadPlan(plan, sdk), { uploaded: 1, skipped: 0 });
    assert.deepEqual(await uploadPlan(plan, sdk), { uploaded: 0, skipped: 1 });
    assert.equal(puts.length, 1);
    objects.set(plan[0].pathname, Buffer.from("different-file")); // same size, different SHA-256
    await assert.rejects(uploadPlan(plan, sdk), /conflict/);
    assert.equal(puts.length, 1);
    failHead = true;
    await assert.rejects(uploadPlan(plan, sdk), /Unable to inspect/);
    failHead = false;
    publicStore = true;
    await assert.rejects(uploadPlan(plan, sdk), /private Blob/);
    publicStore = false;
    objects.clear();
    await writeFile(path.join(root, "case/image.png"), "changed-after-plan");
    await assert.rejects(uploadPlan(plan, sdk), /changed after planning/);
    assert.equal(puts.length, 1);
    await assert.rejects(planUploads(registry, root, "../bad"));
    await assert.rejects(planUploads({ case: { files: { missing: { path: "case/missing.pdf", type: "application/pdf" } } } }, root));
  } finally { await rm(root, { recursive: true, force: true }); }
});
