import "server-only";

// Explicit allowlist. Never derive a filesystem path or environment key from input.
export const privateCases = {
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
