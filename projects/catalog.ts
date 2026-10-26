import type { ProjectMetadata } from "./types";

// Public information only. Never import full case content into this module.
export const projects: readonly ProjectMetadata[] = [
  {
    slug: "demo-aurora", title: "Aurora — case fictício",
    summary: "Exploração demonstrativa de um painel de bem-estar.",
    categories: ["UX", "Interface"], thumbnail: { src: "/window.svg", alt: "Capa pública genérica do projeto Aurora" }, access: "protected",
  },
  {
    slug: "demo-orbita", title: "Órbita — case fictício",
    summary: "Estudo demonstrativo de uma ferramenta de planejamento.",
    categories: ["Produto", "Interface"], thumbnail: { src: "/globe.svg", alt: "Capa pública genérica do projeto Órbita" }, access: "protected",
  },
  {
    slug: "demo-publico", title: "Processo aberto — case fictício",
    summary: "Um exemplo público para demonstrar a composição dos cases.",
    categories: ["Processo"], thumbnail: { src: "/file.svg", alt: "Capa pública do exemplo de processo" }, access: "public",
  },
];

export function getProjectMetadata(slug: string) {
  return projects.find((project) => project.slug === slug);
}
