import { pageMetadata, siteTitle, siteDescription } from "@/projects/site-metadata";
import { PortfolioShell } from "@/components/layout/portfolio-shell";
import { PageContainer } from "@/components/layout/page-container";
import { HomeHeader } from "@/components/home/home-header";
import { HomeIntro } from "@/components/home/home-intro";
import { HomeFooter } from "@/components/home/home-footer";
import { ProjectCard } from "@/components/home/project-card";
import { featuredProjects } from "@/projects/featured";
import "@/components/home/home.css";

export const metadata = pageMetadata(siteTitle, siteDescription, "/");

export default function Home() {
  return (
    <PortfolioShell>
      <HomeHeader />
      <main id="conteudo">
        <HomeIntro />
        <section id="work" aria-label="Trabalhos selecionados" className="home-work">
          <PageContainer className="home-projects">
            {featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} preload={index === 0} />)}
          </PageContainer>
        </section>
      </main>
      <HomeFooter credit="vibe" />
    </PortfolioShell>
  );
}
