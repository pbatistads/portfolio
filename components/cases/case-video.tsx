"use client";

import { useEffect, useRef } from "react";

export function CaseVideo({ filename, label, className, slug = "contratacao-audiovisual" }: { filename: string; label: string; className?: string; slug?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) {
        video.pause();
        video.autoplay = false;
      } else {
        video.autoplay = true;
        void video.play().catch(() => {});
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <video ref={ref} className={className} aria-label={label} loop muted playsInline preload="metadata"
      poster={`/api/cases/${encodeURIComponent(slug)}/files/${filename.replace(".mp4", "-poster.png")}`}>
      <source src={`/api/cases/${encodeURIComponent(slug)}/files/${encodeURIComponent(filename)}`} type="video/mp4" />
    </video>
  );
}
