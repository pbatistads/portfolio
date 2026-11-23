import assert from "node:assert/strict";
import { assertPortfolioFonts } from "./font-loading.mjs";

export async function assertCaseTypography(evaluate, project) {
  await assertPortfolioFonts(evaluate);
  const typography = await evaluate(`(() => ({
    uppercaseElements: document.querySelectorAll("main .uppercase").length,
    captions: [...document.querySelectorAll(".case-caption")].map(el => {
      const style = getComputedStyle(el);
      return { id: el.dataset.nodeId, text: el.textContent, transform: style.textTransform, spacing: style.letterSpacing, font: style.fontFamily, weight: style.fontWeight, size: style.fontSize, line: style.lineHeight, variant: el.className };
    }),
    headings: [...document.querySelectorAll("main h2, main h3")].map(el => {
      const style = getComputedStyle(el);
      return { font: style.fontFamily, weight: style.fontWeight, size: style.fontSize, line: style.lineHeight, level: el.tagName };
    }),
  }))()`);
  assert.equal(typography.uppercaseElements, 0, "Captions must not use uppercase utilities");
  assert.ok(typography.captions.length > 0);
  for (const caption of typography.captions) {
    assert.equal(caption.transform, "none", JSON.stringify(caption));
    assert.equal(caption.spacing, "normal", JSON.stringify(caption));
    assert.match(caption.font, /Outfit/i);
    assert.equal(caption.weight, "500");
    assert.ok(!/[A-ZÀ-Ý]{3,}/.test(caption.text), JSON.stringify(caption));
    const small = caption.variant.includes("--card") || (project === "yourh" && caption.variant.includes("--metadata"));
    assert.equal(caption.size, small ? "12px" : "14px");
    assert.equal(caption.line, small || caption.variant.includes("--metadata") ? "20px" : "22px");
  }
  for (const heading of typography.headings) {
    assert.match(heading.font, /Libre/i);
    assert.equal(heading.weight, "600");
    assert.equal(heading.size, heading.level === "H2" ? "24px" : "20px");
    assert.equal(heading.line, heading.level === "H2" ? "36px" : "30px");
  }
  const textById = Object.fromEntries(typography.captions.map(caption => [caption.id, caption.text]));
  if (project === "bluedesk") {
    assert.equal(textById["82:19"], "Papel");
    assert.equal(textById["91:37"], "O Modelo");
    assert.equal(textById["91:40"], "A Experiência");
    assert.equal(textById["99:114"], "Decisões");
    assert.equal(textById["127:11401"], "[ Para o futuro ]");
  } else {
    assert.equal(textById["131:11451"], "[ Contexto ]");
    assert.equal(textById["131:11465"], "[ Investigação e diagnóstico ]");
    assert.deepEqual(await evaluate('[...document.querySelectorAll(".yourh-eyebrow")].map(el => el.textContent)'), ["[ Antes ]", "[ Depois ]"]);
  }
}
