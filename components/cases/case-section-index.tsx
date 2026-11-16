"use client";

import { useEffect, useState } from "react";

export type CaseIndexItem = { id: string; label: string };

export function CaseSectionIndex({ items }: { items: readonly CaseIndexItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id;
      for (const item of items) {
        const target = document.getElementById(item.id);
        if (target?.checkVisibility() && target.getBoundingClientRect().top <= 120) current = item.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = items.at(-1)?.id ?? current;
      setActiveId(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <nav className="case-section-index" aria-label="Seções do case">
      <ol>
        {items.map(item => (
          <li key={item.id}><a href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}>[ {item.label} ]</a></li>
        ))}
      </ol>
    </nav>
  );
}
