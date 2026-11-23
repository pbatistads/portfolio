import assert from "node:assert/strict";

// Verify real font files, not just a computed family that could still fall back.
export async function assertPortfolioFonts(evaluate) {
  const result = await evaluate(`(async () => {
    await document.fonts.ready;
    const title = document.querySelector('.home-title, #about-title, main h2');
    if (!title) return { family: '', samples: [] };
    const family = getComputedStyle(title).fontFamily.split(',')[0].trim();
    const samples = [];
    for (const style of ['normal', 'italic']) {
      for (const weight of [400, 500, 600]) {
        const faces = await document.fonts.load(style + ' ' + weight + ' 32px ' + family, 'Ação, experiência e design — à ê õ ç');
        samples.push({ style, weight, faces: faces.map(face => ({ family: face.family, status: face.status, style: face.style, weight: face.weight })) });
      }
    }
    return { family, samples };
  })()`);
  assert.match(result.family, /Libre/i, "Headings must use Libre Baskerville");
  assert.equal(result.samples.length, 6);
  for (const sample of result.samples) {
    assert.ok(sample.faces.length > 0, `Missing ${sample.style} ${sample.weight} font file`);
    for (const face of sample.faces) {
      assert.equal(face.status, "loaded");
      assert.equal(face.style, sample.style);
      assert.match(face.family, /Libre/i);
      const bounds = face.weight.split(/\s+/).map(Number);
      assert.ok(sample.weight >= bounds[0] && sample.weight <= bounds.at(-1), `Missing real weight ${sample.weight}: ${face.weight}`);
    }
  }
}
