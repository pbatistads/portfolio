import { pageMetadata } from "@/projects/site-metadata";
import Image from "next/image";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutInterests } from "@/components/about/about-interests";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";
import { PageContainer } from "@/components/layout/page-container";
import { PortfolioShell } from "@/components/layout/portfolio-shell";
import "@/components/about/about.css";

export const metadata = pageMetadata(
  "Sobre mim | Poli Batista",
  "Conheça a trajetória de Poliana Batista, engenheira de software e designer de produto, e seus interesses além do design.",
  "/about",
);

export default function About() {
  return (
    <PortfolioShell>
      <HomeHeader activePage="about" />
      <main id="conteudo" className="about-main">
        <PageContainer>
          <div className="about-portrait">
            <Image src="/images/about/me.png" alt="Poliana Batista durante uma viagem." width={238} height={238} sizes="238px" preload className="about-portrait-image" />
          </div>
          <div className="about-content">
            <AboutIntro />
            <AboutInterests />
          </div>
        </PageContainer>
      </main>
      <HomeFooter credit="vibe" />
    </PortfolioShell>
  );
}
