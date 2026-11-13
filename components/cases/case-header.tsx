import Link from "next/link";

export function CaseHeader() {
  return (
    <header className="portfolio-back-header">
      <nav aria-label="Navegação do projeto">
        <Link href="/" className="portfolio-back-link">Voltar</Link>
      </nav>
    </header>
  );
}
