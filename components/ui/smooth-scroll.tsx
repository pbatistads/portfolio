"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let target = window.scrollY;
    let current = target;

    const cancel = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      target = window.scrollY;
      current = target;
    };
    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      target = Math.min(target, Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
      current += (target - current) * (1 - Math.exp(-elapsed / 58));
      if (Math.abs(target - current) < 0.5) {
        window.scrollTo({ top: target, behavior: "instant" });
        frame = 0;
        previousTime = 0;
        current = window.scrollY;
        return;
      }
      window.scrollTo({ top: current, behavior: "instant" });
      frame = window.requestAnimationFrame(animate);
    };
    const hasNestedScroll = (element: Element) => {
      for (let parent: Element | null = element; parent && parent !== document.body; parent = parent.parentElement) {
        const style = window.getComputedStyle(parent);
        if ((/auto|scroll/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight) ||
            (/auto|scroll/.test(style.overflowX) && parent.scrollWidth > parent.clientWidth)) return true;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (event.defaultPrevented || !event.cancelable || !element?.closest(".portfolio-home") ||
          !pointer.matches || reducedMotion.matches || event.ctrlKey || event.metaKey || event.shiftKey ||
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
          element.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') || hasNestedScroll(element)) {
        cancel();
        return;
      }
      // Small or fractional pixel deltas already have the trackpad's native inertia.
      if (event.deltaMode === 0 && (Math.abs(event.deltaY) < 50 || !Number.isInteger(event.deltaY))) {
        cancel();
        return;
      }
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      if (!frame) current = target = window.scrollY;
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const next = Math.max(0, Math.min(maximum, target + event.deltaY * unit));
      if (next === target && !frame) return;
      event.preventDefault();
      target = next;
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    const externalScroll = () => {
      // Stop following a stale target when the keyboard, browser or an anchor takes over.
      if (frame && Math.abs(window.scrollY - current) > 2) cancel();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) cancel();
    };
    document.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", cancel);
    document.addEventListener("click", cancel);
    window.addEventListener("scroll", externalScroll, { passive: true });
    window.addEventListener("resize", cancel);
    window.addEventListener("hashchange", cancel);
    window.addEventListener("blur", cancel);
    pointer.addEventListener("change", cancel);
    reducedMotion.addEventListener("change", cancel);
    return () => {
      cancel();
      document.removeEventListener("wheel", wheel);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("pointerdown", cancel);
      document.removeEventListener("click", cancel);
      window.removeEventListener("scroll", externalScroll);
      window.removeEventListener("resize", cancel);
      window.removeEventListener("hashchange", cancel);
      window.removeEventListener("blur", cancel);
      pointer.removeEventListener("change", cancel);
      reducedMotion.removeEventListener("change", cancel);
    };
  }, []);

  return null;
}
