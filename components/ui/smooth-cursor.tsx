"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function SmoothCursor() {
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = cursor.current;
    if (!element) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let frame = 0;
    let previousTime = 0;
    let visible = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const paint = () => {
      element.style.transform = `translate3d(${current.x - 8}px, ${current.y - 10}px, 0)`;
    };
    const hide = () => {
      visible = false;
      root.classList.remove("portfolio-cursor-active");
      element.removeAttribute("data-visible");
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const animate = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      // Time-based easing keeps the response consistent on 60 and 120 Hz displays.
      const amount = 1 - Math.exp(-elapsed / 28);
      current.x += (target.x - current.x) * amount;
      current.y += (target.y - current.y) * amount;
      const distance = Math.hypot(target.x - current.x, target.y - current.y);
      if (distance < 0.1) {
        current.x = target.x;
        current.y = target.y;
        previousTime = 0;
      } else {
        frame = window.requestAnimationFrame(animate);
      }
      paint();
    };
    const move = (event: PointerEvent) => {
      const hovered = event.target instanceof Element ? event.target : null;
      const image = element.querySelector("img");
      if (event.pointerType !== "mouse" || !pointer.matches || reducedMotion.matches ||
          !image?.complete || !image.naturalWidth || !hovered?.closest(".portfolio-home") ||
          hovered.closest('input, textarea, [contenteditable]:not([contenteditable="false"]), button:disabled, [aria-disabled="true"]')) {
        hide();
        return;
      }
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        current.x = target.x;
        current.y = target.y;
        paint();
        visible = true;
        element.setAttribute("data-visible", "true");
        root.classList.add("portfolio-cursor-active");
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    const settle = () => {
      if (!visible) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      current.x = target.x;
      current.y = target.y;
      paint();
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", settle);
    document.addEventListener("keydown", keyboard);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    pointer.addEventListener("change", hide);
    reducedMotion.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", settle);
      document.removeEventListener("keydown", keyboard);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
      pointer.removeEventListener("change", hide);
      reducedMotion.removeEventListener("change", hide);
    };
  }, []);

  return <span ref={cursor} className="portfolio-smooth-cursor" aria-hidden="true"><Image src="/images/cursor.svg" alt="" width={32} height={32} loading="eager" unoptimized /></span>;
}
