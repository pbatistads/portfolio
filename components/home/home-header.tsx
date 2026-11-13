import Link from "next/link";

const upcomingItems = ["Just for fun", "Currículo"];

export function HomeHeader({ activePage = "home" }: { activePage?: "home" | "about" }) {
  return (
    <header className="portfolio-header">
      <div className="portfolio-header-inner">
        <Link href="/" aria-label="Poli Batista — início" className="portfolio-brand">Poli Batista</Link>
        <nav aria-label="Navegação principal" className="portfolio-navigation">
          <ul>
            <li><Link href="/" aria-current={activePage === "home" ? "page" : undefined}>[ Início ]</Link></li>
            <li><Link href="/about" aria-current={activePage === "about" ? "page" : undefined}>[ Sobre mim ]</Link></li>
            {upcomingItems.map((item) => (
              <li key={item}><span aria-disabled="true" title="Em breve">[ {item} ]</span></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
