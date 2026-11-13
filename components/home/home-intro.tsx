import { homeTitleFont } from "./fonts";
import { PageContainer } from "@/components/layout/page-container";
import { HomeOrnaments } from "./home-ornaments";

export function HomeIntro() {
  return (
    <section aria-labelledby="home-title" className="home-intro">
      <PageContainer>
        <h1 id="home-title" className={`${homeTitleFont.className} home-title`}>
          Sou uma engenheira de software trabalhando como{" "}
          <em>Designer de Produto</em>
        </h1>
        <div className="home-intro-copy">
          <p>Meu trabalho acontece no meio do caminho entre o que as pessoas precisam, o que o negócio quer e o que a tecnologia consegue construir. É nesse espaço que transformo problemas complexos em produtos digitais claros, funcionais e viáveis.</p>
          <p>Senior Product Designer &amp; Team Lead @ Laon</p>
        </div>
        <HomeOrnaments />
      </PageContainer>
    </section>
  );
}
