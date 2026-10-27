import type { Metadata } from "next";
import { homeTextFont } from "@/components/home/fonts";
import { HomeHeader } from "@/components/home/home-header";
import { HomeIntro } from "@/components/home/home-intro";
import { HomeFooter } from "@/components/home/home-footer";
import { ProjectCard } from "@/components/home/project-card";
import { featuredProjects } from "@/projects/featured";

export const metadata: Metadata = {
  title: "Poli Batista | Designer de Produto",
  description: "Engenheira de Software trabalhando como Designer de Produto. Senior Product Designer & Team Lead @ Laon.",
};

export default function Home() {
  return (
    <div className={`${homeTextFont.className} portfolio-home min-h-screen bg-home-white text-home-brown`} lang="pt-BR">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-home-white focus:p-4">Pular para o conteúdo</a>
      <HomeHeader />
      <main id="conteudo">
        <HomeIntro />
        <section id="work" aria-label="Trabalhos selecionados" className="scroll-mt-8 px-[var(--home-gutter)] py-12 md:py-16 xl:py-20">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-8 xl:gap-10">
            {featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} preload={index === 0} />)}
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
