import type { ReactNode } from "react";
import { homeTextFont } from "@/components/home/fonts";

export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${homeTextFont.className} portfolio-home portfolio-shell bg-home-white text-home-brown`} lang="pt-BR">
      <a href="#conteudo" className="portfolio-skip-link">Pular para o conteúdo</a>
      {children}
    </div>
  );
}
