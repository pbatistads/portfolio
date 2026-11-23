import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { waitForScrollToSettle } from "./helpers/browser-motion.mjs";
import { assertPortfolioFonts } from "./helpers/font-loading.mjs";

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
const output = path.resolve(".next/home-validation");
await mkdir(output, { recursive: true });
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(appPort)], {
  windowsHide: true, stdio: "ignore",
});
const chrome = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${browserPort}`, `--user-data-dir=${path.join(output, "chrome-profile")}`, "about:blank",
], { windowsHide: true, stdio: "ignore" });
let socket;
try {
  async function waitFor(url) {
    for (let i = 0; i < 100; i++) {
      try { if ((await fetch(url, { signal: AbortSignal.timeout(1000) })).ok) return; } catch {}
      await delay(100);
    }
    throw new Error(`Startup timed out: ${url}`);
  }
  await waitFor(origin);
  await waitFor(`http://127.0.0.1:${browserPort}/json/version`);
  const page = await (await fetch(`http://127.0.0.1:${browserPort}/json/new?about:blank`, { method: "PUT" })).json();
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
  let nextId = 0;
  const pending = new Map();
  const requests = [];
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.method === "Network.requestWillBeSent") requests.push(message.params.request.url);
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
  const report = [];
  for (const width of [1440, 1024, 768, 390, 320]) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width <= 390 });
    await call("Emulation.setTouchEmulationEnabled", { enabled: width <= 390 });
    await call("Page.navigate", { url: origin });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      ready = await evaluate('document.readyState === "complete" && document.querySelectorAll(".home-project").length === 2');
      if (ready) break;
      await delay(100);
    }
    assert.ok(ready, `Home did not load at ${width}px`);
    await evaluate("document.fonts.ready");
    await assertPortfolioFonts(evaluate);
    await evaluate('Promise.all([...document.images].map(img => { img.loading = "eager"; return img.decode().catch(() => {}); }))');
    const result = await evaluate(`(() => {
      const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
      return {
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
        title: document.querySelector("h1").textContent.trim(),
        links: [...document.querySelectorAll(".home-project-link")].map(el => el.getAttribute("href")),
        covers: [...document.querySelectorAll(".home-project-cover")].map(rect),
        copy: [...document.querySelectorAll(".home-project-copy")].map(rect),
        imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
        overflow: [...document.querySelectorAll("main *")].filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map(el => el.className),
      };
    })()`);
    assert.equal(result.scrollWidth, result.clientWidth, JSON.stringify(result));
    assert.deepEqual(result.overflow, []);
    assert.ok(result.imagesLoaded);
    assert.deepEqual(result.links, ["/cases/contratacao-audiovisual", "/cases/educacao-corporativa"]);
    assert.match(result.title, /Sou uma engenheira de software/);
    if (width <= 390) {
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".home-project-cta")).opacity'), "1");
    }
    if (width >= 1024) assert.ok(result.covers.every((cover, i) => cover.x > result.copy[i].x + result.copy[i].width));
    else assert.ok(result.covers.every((cover, i) => cover.y >= result.copy[i].y + result.copy[i].height));
    if (width === 1440) {
      assert.equal(result.copy[0].x, (result.clientWidth - 1120) / 2);
      assert.equal(result.copy[0].width, 320);
      assert.equal(result.covers[0].width, 760);
    }
    const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: await evaluate("document.documentElement.scrollHeight"), scale: 1 } });
    await writeFile(path.join(output, `home-${width}.png`), Buffer.from(screenshot.data, "base64"));
    report.push(result);
    console.log(`Home ${width}px: no overflow, images loaded, project layout verified`);
  }
  assert.ok(!requests.some(url => new URL(url).pathname.startsWith("/cases/")), "Cases must not prefetch before interaction");
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await call("Emulation.setTouchEmulationEnabled", { enabled: false });
  await evaluate('document.querySelector(".home-project-cover").scrollIntoView({ behavior: "instant", block: "center" })');
  const card = await evaluate(`(() => {
    const copy = document.querySelector(".home-project-copy").getBoundingClientRect();
    const cover = document.querySelector(".home-project-cover").getBoundingClientRect();
    return { copyX: copy.left + copy.width / 2, coverX: cover.left + cover.width / 2, y: cover.top + cover.height / 2 };
  })()`);
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: card.copyX, y: card.y });
  await delay(450);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".home-project-title")).textDecorationLine'), "none");
  assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")'), null);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".home-project-image")).transform'), "none");
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: card.coverX, y: card.y });
  await delay(450);
  assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]").textContent'), "Ver caso de estudo");
  assert.ok(await evaluate('new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".home-project-image")).transform).a > 1.02'));
  const imageLabelX = await evaluate('document.querySelector("[role=tooltip][data-open=true]").getBoundingClientRect().left');
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: card.coverX + 20, y: card.y });
  await delay(180);
  assert.ok(Math.abs(await evaluate('document.querySelector("[role=tooltip][data-open=true]").getBoundingClientRect().left') - imageLabelX - 20) < 0.2);
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: card.copyX, y: card.y });
  await delay(300);
  assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")'), null);
  console.log("Case image hover: smooth zoom, following label, no text underline");
  await evaluate('window.scrollTo({ top: 0, behavior: "instant" })');
  await call("Input.dispatchMouseEvent", { type: "mouseWheel", x: 400, y: 400, deltaX: 0, deltaY: 500 });
  await delay(80);
  const intermediateScroll = await evaluate("window.scrollY");
  assert.ok(intermediateScroll > 0 && intermediateScroll < 500, `Wheel scrolling must ease toward its target: ${intermediateScroll}`);
  await waitForScrollToSettle(evaluate);
  assert.ok(Math.abs(await evaluate("window.scrollY") - 500) < 1);
  console.log("Mouse wheel smoothing verified without changing its final distance");
  // Exercise client navigation so active links and route-specific CSS are checked together.
  for (const width of [1440, 1024, 768, 390, 320]) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width <= 390 });
    await call("Emulation.setTouchEmulationEnabled", { enabled: width <= 390 });
    await evaluate('[...document.querySelectorAll("a[href=\\"/about\\"]")].find(el => el.checkVisibility()).click()');
    let ready = false;
    for (let i = 0; i < 100; i++) {
      ready = await evaluate('location.pathname === "/about" && Boolean(document.querySelector(".about-portrait-image"))');
      if (ready) break;
      await delay(100);
    }
    assert.ok(ready, `About did not load at ${width}px`);
    await evaluate("document.fonts.ready");
    await assertPortfolioFonts(evaluate);
    await evaluate('Promise.all([...document.images].map(img => img.decode().catch(() => {})))');
    const result = await evaluate(`(() => {
      const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
      return {
        page: "about", width: innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
        activeLinks: [...document.querySelectorAll("nav [aria-current=page]")].filter(el => el.checkVisibility()).map(el => el.getAttribute("href")),
        heading: document.querySelector("#about-title").textContent,
        biography: rect(document.querySelector(".about-intro")), interests: rect(document.querySelector(".about-interests")),
        portrait: rect(document.querySelector(".about-portrait-image")),
        interestsCount: document.querySelectorAll(".about-interests li").length,
        overflow: [...document.querySelectorAll("main *")].filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map(el => el.className),
      };
    })()`);
    assert.equal(result.scrollWidth, result.clientWidth);
    assert.deepEqual(result.overflow, [], JSON.stringify(result));
    assert.ok(result.imagesLoaded, "About portrait and ornaments must load");
    assert.deepEqual(result.activeLinks, ["/about"]);
    assert.equal(result.heading, "Oi, eu sou a Poli!");
    assert.equal(result.interestsCount, 7);
    assert.equal(result.portrait.width, result.portrait.height);
    if (width >= 1024) assert.ok(result.interests.x > result.biography.x + result.biography.width);
    else assert.ok(result.interests.y >= result.biography.y + result.biography.height);
    const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: await evaluate("document.documentElement.scrollHeight"), scale: 1 } });
    await writeFile(path.join(output, `about-${width}.png`), Buffer.from(screenshot.data, "base64"));
    report.push(result);
    assert.equal(await evaluate('[...document.querySelectorAll("[role=tooltip][data-open=true]")].filter(el => el.checkVisibility()).length'), 0);
    const trigger = await evaluate('(() => { const r = document.querySelector(".about-heading .cursor-label-trigger").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()');
    if (width >= 768) {
      assert.match(await evaluate('getComputedStyle(document.querySelector(".about-heading .cursor-label-trigger")).cursor'), /cursor\.svg|none/);
      await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: trigger.x, y: trigger.y });
      await delay(100);
      assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")?.textContent'), "Na verdade, Poliana");
      assert.ok(await evaluate('document.documentElement.classList.contains("portfolio-cursor-active")'));
      const firstPosition = await evaluate('document.querySelector("[role=tooltip][data-open=true]").getBoundingClientRect().left');
      await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: trigger.x + 5, y: trigger.y });
      await delay(180);
      assert.ok(Math.abs(await evaluate('document.querySelector("[role=tooltip][data-open=true]").getBoundingClientRect().left') - firstPosition - 5) < 0.2);
      const cursorX = await evaluate('new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".portfolio-smooth-cursor")).transform).m41 + 8');
      assert.ok(Math.abs(cursorX - trigger.x - 5) < 0.2, "Smoothed cursor must settle at the pointer position");
      await call("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await delay(50);
      assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")'), null);
      await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
      await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: trigger.x, y: trigger.y });
      await delay(50);
      const hoverScreenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await writeFile(path.join(output, `about-hover-${width}.png`), Buffer.from(hoverScreenshot.data, "base64"));
      await call("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
      await delay(50);
      assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")'), null);
      await evaluate('document.querySelector(".about-heading .cursor-label-trigger").focus()');
      await delay(50);
      assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")?.textContent'), "Na verdade, Poliana");
      await evaluate('document.querySelector(".about-heading .cursor-label-trigger").blur()');
    } else {
      await evaluate('document.querySelector(".about-heading .cursor-label-trigger").focus()');
      await delay(50);
      assert.equal(await evaluate('document.querySelector("[role=tooltip][data-open=true]")'), null);
      await evaluate('document.querySelector(".about-heading .cursor-label-trigger").blur()');
    }
    await evaluate('[...document.querySelectorAll(".portfolio-navigation a[href=\\"/\\"]")].find(el => el.checkVisibility()).click()');
    let homeReady = false;
    for (let i = 0; i < 100; i++) {
      homeReady = await evaluate('location.pathname === "/" && Boolean(document.querySelector(".home-project"))');
      if (homeReady) break;
      await delay(100);
    }
    assert.ok(homeReady);
    assert.equal(await evaluate('[...document.querySelectorAll("nav [aria-current=page]")].find(el => el.checkVisibility()).getAttribute("href")'), "/");
    console.log(`About ${width}px: portrait, layout, cursor label and navigation verified`);
  }
  await call("Page.navigate", { url: origin });
  await delay(500);
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate('document.activeElement.className'), "portfolio-skip-link");
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await delay(50);
  assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), "auto");
  assert.ok(await evaluate('!document.documentElement.classList.contains("portfolio-cursor-active")'));
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".home-project-cta")).transitionDuration'), "0s");
  await evaluate('document.querySelector(".home-project-link").click()');
  let gateReady = false;
  for (let i = 0; i < 100; i++) {
    gateReady = await evaluate('location.pathname === "/cases/contratacao-audiovisual" && Boolean(document.querySelector("input[type=password]"))');
    if (gateReady) break;
    await delay(100);
  }
  assert.ok(gateReady, "The project link must open the protected case gate");
  console.log("Keyboard skip link, reduced motion, no case prefetch and protected navigation verified");
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
} finally {
  socket?.close();
  chrome.kill();
  app.kill();
}
