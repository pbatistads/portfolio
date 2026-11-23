import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { assertCaseTypography } from "./helpers/case-typography.mjs";
import { waitForScrollToSettle } from "./helpers/browser-motion.mjs";
import { hashPassword } from "../projects/server/passwords.mjs";
import { cookieName, issueSession } from "../projects/server/session-token.mjs";

// Native Chrome DevTools Protocol: no browser packages or production credentials.
async function freePort() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const appPort = await freePort();
const browserPort = await freePort();
const origin = `http://127.0.0.1:${appPort}`;
const secret = randomBytes(32).toString("base64url");
const hash = await hashPassword(randomBytes(24).toString("base64url"));
const output = path.resolve(".next/bluedesk-validation");
await mkdir(output, { recursive: true });
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(appPort)], {
  windowsHide: true, stdio: "ignore",
  env: { ...process.env, __NEXT_PROCESSED_ENV: "true", NODE_ENV: "production", VERCEL_ENV: "development", CASE_MEDIA_STORAGE: "local", CASE_SESSION_SECRET: secret, CASE_BLUEDESK_HASH: hash },
});
const chrome = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--autoplay-policy=no-user-gesture-required", `--remote-debugging-port=${browserPort}`,
  `--user-data-dir=${path.join(output, "chrome-profile")}`, "about:blank",
], { windowsHide: true, stdio: "ignore" });
let socket;
try {
  async function waitFor(url) {
    for (let i = 0; i < 100; i++) {
      try { const response = await fetch(url, { signal: AbortSignal.timeout(1000) }); if (response.ok) return response; } catch {}
      await delay(100);
    }
    throw new Error("Startup timed out");
  }
  await waitFor(origin);
  console.log("Production server ready");
  await waitFor(`http://127.0.0.1:${browserPort}/json/version`);
  console.log("Chrome ready");
  const page = await (await fetch(`http://127.0.0.1:${browserPort}/json/new?about:blank`, { method: "PUT" })).json();
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call("Page.enable");
  await call("Network.enable");
  await call("Network.setCookie", {
    name: cookieName("contratacao-audiovisual", true), value: issueSession("contratacao-audiovisual", secret, hash),
    url: origin, path: "/", secure: true, httpOnly: true, sameSite: "Lax",
  });
  const report = [];
  for (const width of [1440, 1024, 768, 390, 320]) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width <= 390 });
    await call("Emulation.setTouchEmulationEnabled", { enabled: width <= 390 });
    await call("Page.navigate", { url: origin + "/cases/contratacao-audiovisual" });
    for (let i = 0; i < 100; i++) {
      if (await evaluate('document.readyState === "complete" && document.querySelectorAll("video").length === 2')) break;
      await delay(100);
    }
    await evaluate("document.fonts.ready");
    // Load lazy images in all sections before taking the full-page reference.
    await evaluate('Promise.all([...document.images].map(img => { img.loading = "eager"; return img.decode().catch(() => {}); }))');
    await delay(700);
    const result = await evaluate(`(() => {
      const elements = [...document.querySelectorAll("main *")];
      return {
        text: document.querySelector("main").textContent.replace(/\\s+/g, " ").trim(),
        contentWidth: document.querySelector(".case-intro").getBoundingClientRect().width,
        width: innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        title: document.querySelector("h1")?.textContent.trim(),
        images: [...document.images].map(img => ({ src: new URL(img.src).pathname, loaded: img.complete && img.naturalWidth > 0 })),
        videos: [...document.querySelectorAll("video")].map(v => ({ src: new URL(v.querySelector("source").src).pathname, muted: v.muted, loop: v.loop, inline: v.playsInline, controls: v.controls, autoplay: v.autoplay, paused: v.paused, ready: v.readyState, width: v.getBoundingClientRect().width })),
        overflow: elements.filter(el => !el.closest(".case-video-scroll, .case-media-complex")).filter(el => { const b = el.getBoundingClientRect(); return b.right > innerWidth + 1 || b.left < -1; }).map(el => el.getAttribute("data-node-id") || el.className)
      };
    })()`);
    assert.equal(result.title, "Bluedesk");
    assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), "smooth");
    await assertCaseTypography(evaluate, "bluedesk");
    if (report.length) assert.equal(result.text, report[0].text, "Case content must remain identical at every width");
    if (width === 1440) assert.ok(Math.abs(result.contentWidth - 880) < 0.1);
    assert.equal(await evaluate('document.querySelectorAll(".case-section-index a").length'), 6);
    assert.ok(await evaluate('[...document.querySelectorAll(".case-section-index a")].every(a => document.getElementById(a.hash.slice(1)))'));
    assert.equal(result.scrollWidth, result.clientWidth, JSON.stringify(result));
    assert.deepEqual(result.overflow, [], JSON.stringify(result));
    assert.ok(result.images.every(img => img.loaded), JSON.stringify(result.images));
    assert.equal(result.videos.length, 2);
    assert.ok(result.videos.every(v => v.muted && v.loop && v.inline && !v.controls && v.autoplay && !v.paused && v.ready >= 2 && v.width > 0), JSON.stringify(result.videos));
    const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: await evaluate("document.documentElement.scrollHeight"), scale: 1 } });
    await writeFile(path.join(output, `bluedesk-${width}.png`), Buffer.from(screenshot.data, "base64"));
    if (width === 1440) {
      const top = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await writeFile(path.join(output, "bluedesk-desktop-top.png"), Buffer.from(top.data, "base64"));
    }
    await evaluate('document.querySelector(`.case-section-index a[href="#bluedesk-solucoes"]`).click()');
    await waitForScrollToSettle(evaluate);
    assert.equal(await evaluate('document.querySelector(".case-section-index [aria-current=location]").getAttribute("href")'), "#bluedesk-solucoes");
    assert.ok(await evaluate('Math.abs(document.getElementById("bluedesk-solucoes").getBoundingClientRect().top - 24) < 2'));
    if (width === 1440) {
      const section = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await writeFile(path.join(output, "bluedesk-desktop-solution.png"), Buffer.from(section.data, "base64"));
      assert.ok(await evaluate('Math.abs(document.querySelector(".case-navigation-inner").getBoundingClientRect().top) < 1'), "Desktop navigation must remain sticky");
    }
    if (width < 768) {
      assert.ok(await evaluate('(() => { const el = document.querySelector(".case-video-scroll"); el.scrollTo({ left: 100, behavior: "instant" }); return el.scrollLeft > 0; })()'), "Diagram must remain scrollable on small screens");
    }
    await evaluate('document.querySelector(`.case-section-index a[href="#bluedesk-resultados"]`).click()');
    await waitForScrollToSettle(evaluate);
    assert.equal(await evaluate('document.querySelector(".case-section-index [aria-current=location]").getAttribute("href")'), "#bluedesk-resultados");
    report.push(result);
    console.log(`Bluedesk ${width}px: no overflow, images loaded, two videos playing`);
  }
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await delay(200);
  assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), "auto");
  assert.ok(await evaluate('[...document.querySelectorAll("video")].every(v => v.paused && !v.autoplay)'));
  await call("Page.navigate", { url: origin + "/cases/contratacao-audiovisual" });
  await delay(1200);
  assert.equal(await evaluate('document.querySelectorAll("video").length'), 2);
  assert.ok(await evaluate('[...document.querySelectorAll("video")].every(v => v.paused && !v.autoplay && v.poster)'));
  console.log("Reduced motion: all videos paused on initial load and preference change");
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
} finally {
  socket?.close();
  chrome.kill();
  app.kill();
}
