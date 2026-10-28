import "server-only";

// Explicit allowlist. Never derive a filesystem path or environment key from input.
export const privateCases = {
  "contratacao-audiovisual": {
    passwordEnv: "CASE_BLUEDESK_HASH",
    content: null,
    files: {
      "video-filmmaker-01-poster.png": { path: "contratacao-audiovisual/video-filmmaker-01-poster.png", type: "image/png", attachment: false },
      "video-filmmaker-02-poster.png": { path: "contratacao-audiovisual/video-filmmaker-02-poster.png", type: "image/png", attachment: false },
      "img-filmmaker-01.png": { path: "contratacao-audiovisual/img-filmmaker-01.png", type: "image/png", attachment: false },
      "img-filmmaker-02.png": { path: "contratacao-audiovisual/img-filmmaker-02.png", type: "image/png", attachment: false },
      "img-filmmaker-03.png": { path: "contratacao-audiovisual/img-filmmaker-03.png", type: "image/png", attachment: false },
      "video-filmmaker-01.mp4": { path: "contratacao-audiovisual/video-filmmaker-01.mp4", type: "video/mp4", attachment: false },
      "video-filmmaker-02.mp4": { path: "contratacao-audiovisual/video-filmmaker-02.mp4", type: "video/mp4", attachment: false },
    },
  },
  "demo-aurora": {
    passwordEnv: "CASE_DEMO_AURORA_HASH",
    content: "demo-aurora/content.json",
    files: {
      "painel.svg": { path: "demo-aurora/painel.svg", type: "image/svg+xml", attachment: false },
      "notas.txt": { path: "demo-aurora/notas.txt", type: "text/plain; charset=utf-8", attachment: true },
    },
  },
  "demo-orbita": {
    passwordEnv: "CASE_DEMO_ORBITA_HASH",
    content: "demo-orbita/content.json",
    files: {
      "mapa.svg": { path: "demo-orbita/mapa.svg", type: "image/svg+xml", attachment: false },
      "notas.txt": { path: "demo-orbita/notas.txt", type: "text/plain; charset=utf-8", attachment: true },
    },
  },
} as const;

export function getPrivateCase(slug: string) {
  return Object.hasOwn(privateCases, slug) ? privateCases[slug as keyof typeof privateCases] : null;
}
