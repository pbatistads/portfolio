// Public Home presentation only. Case content and access stay in the existing catalog.
// A card becomes a link only after its real slug is registered there.
export const featuredProjects = [
  {
    slug: "educacao-corporativa",
    title: "Redesenhando a experiência de aprendizagem de uma plataforma de RH",
    year: "2026", category: "Projeto profissional",
    cover: "/images/home/educacao-corporativa.png",
    alt: "Plataforma de educação corporativa com assistente de IA, trilhas de aprendizagem, indicadores e avaliações.",
    roundedCover: true,
  },
  {
    slug: "contratacao-audiovisual",
    title: "Transformando uma ideia de negócio em uma plataforma de contratação audiovisual",
    year: "2025", category: "Projeto profissional",
    cover: "/images/home/contratacao-audiovisual.png",
    alt: "Telas de busca de filmmakers, perfil profissional e conversa para contratação.",
    roundedCover: true,
  },
] as const;

export type FeaturedProject = (typeof featuredProjects)[number];
