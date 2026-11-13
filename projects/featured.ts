// Public Home presentation only. Case content and access stay in the existing catalog.
// A card becomes a link only after its real slug is registered there.
export const featuredProjects = [
  {
    slug: "contratacao-audiovisual",
    title: "Transformando uma ideia de negócio em uma plataforma de contratação audiovisual",
    description: "Definição da experiência de um marketplace audiovisual, do modelo de contratação às regras de entrega, revisão e pagamento.",
    year: "2025", category: "Projeto profissional", role: "Product Designer",
    cover: "/images/home/contratacao-audiovisual.png",
    alt: "Telas de busca de filmmakers, perfil profissional e conversa para contratação.",
  },
  {
    slug: "educacao-corporativa",
    title: "Redesenhando a experiência de aprendizagem de uma plataforma de RH",
    description: "Revisão da experiência de uma plataforma existente, abrangendo jornadas de aprendizagem, gestão de treinamentos e organização da informação.",
    year: "2026", category: "Projeto profissional", role: "Product Designer",
    cover: "/images/home/educacao-corporativa.png",
    alt: "Plataforma de educação corporativa com assistente de IA, trilhas de aprendizagem, indicadores e avaliações.",
  },
] as const;

export type FeaturedProject = (typeof featuredProjects)[number];
