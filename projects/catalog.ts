import type { ProjectMetadata } from "./types";

// Public information only. Never import full case content into this module.
export const projects: readonly ProjectMetadata[] = [
  {
    slug: "educacao-corporativa",
    title: "YouRH",
    summary: "Redesenhando a experiência de aprendizagem de uma plataforma de RH",
    categories: ["Projeto profissional"],
    thumbnail: { src: "/images/home/educacao-corporativa.png", alt: "Plataforma de educação corporativa" },
    access: "protected",
  },
  {
    slug: "contratacao-audiovisual",
    title: "Bluedesk",
    summary: "Transformando uma ideia de negócio em uma plataforma de contratação audiovisual",
    categories: ["Projeto profissional"],
    thumbnail: { src: "/images/home/contratacao-audiovisual.png", alt: "Telas da plataforma Bluedesk" },
    access: "protected",
  },

];

export function getProjectMetadata(slug: string) {
  return projects.find((project) => project.slug === slug);
}
