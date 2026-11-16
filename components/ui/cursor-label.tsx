"use client";

import { useEffect, useLayoutEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { homeTextFont } from "@/components/home/fonts";

const subscribe = () => () => {};

export function CursorLabel({ children, label, className = "", focusable = true }: {
  children: ReactNode;
  label: string;
  className?: string;
  focusable?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const tooltip = useRef<HTMLSpanElement>(null);
  const position = useRef({ x: 0, y: 0 });

  function placeLabel() {
    const element = tooltip.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    const { x, y } = position.current;
    const left = Math.max(8, Math.min(x + 20, window.innerWidth - width - 8));
    const top = y + 24 + height <= window.innerHeight - 8 ? y + 24 : Math.max(8, y - height - 20);
    element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }

  useLayoutEffect(() => {
    if (open) placeLabel();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("blur", dismiss);
    window.addEventListener("keydown", onKeyDown);
    pointer.addEventListener("change", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("blur", dismiss);
      window.removeEventListener("keydown", onKeyDown);
      pointer.removeEventListener("change", dismiss);
    };
  }, [open]);

  return (
    <>
      <span className={`cursor-label-trigger ${className}`.trim()} tabIndex={focusable ? 0 : undefined} aria-describedby={open ? id : undefined}
        onPointerEnter={event => {
          if (!label || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
          position.current = { x: event.clientX, y: event.clientY };
          placeLabel();
          setOpen(true);
        }}
        onPointerMove={event => {
          if (event.pointerType !== "mouse") return;
          position.current = { x: event.clientX, y: event.clientY };
          placeLabel();
        }}
        onPointerLeave={() => setOpen(false)}
        onFocus={event => {
          if (!label || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
          const rect = event.currentTarget.getBoundingClientRect();
          position.current = { x: rect.left, y: rect.bottom };
          placeLabel();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}>
        {children}
      </span>
      {mounted && createPortal(
        <span ref={tooltip} id={id} role="tooltip" aria-hidden={!open} data-open={open} className={`${homeTextFont.className} cursor-label-tooltip`}>{label}</span>,
        document.body,
      )}
    </>
  );
}
