import Link from "next/link";
import { CaseSectionIndex, type CaseIndexItem } from "./case-section-index";
import "./case-navigation.css";

export function CaseNavigation({ items }: { items: readonly CaseIndexItem[] }) {
  return (
    <>
      <a href="#conteudo" className="portfolio-skip-link">Pular para o conteúdo</a>
      <header className="case-navigation">
        <div className="case-navigation-inner">
          <Link href="/" className="portfolio-back-link">Voltar</Link>
          <CaseSectionIndex items={items} />
        </div>
      </header>
    </>
  );
}
