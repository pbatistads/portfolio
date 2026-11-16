import assert from "node:assert/strict";

export async function waitForScrollToSettle(evaluate) {
  let previous = await evaluate("window.scrollY");
  let stable = 0;
  for (let i = 0; i < 80; i++) {
    await new Promise(resolve => setTimeout(resolve, 40));
    const current = await evaluate("window.scrollY");
    stable = Math.abs(current - previous) < 1 ? stable + 1 : 0;
    if (stable >= 4) return;
    previous = current;
  }
  assert.fail("Smooth scrolling did not settle");
}
