import Link from "next/link";

export function CaseHeader() {
  return (
    <header className="px-[var(--home-gutter)] py-8">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1200px] text-sm leading-[22px] font-medium tracking-[0.7px] uppercase">
        <ol className="flex flex-wrap gap-x-1 text-[#c2ae99]">
          <li><span aria-hidden="true">[ </span><Link href="/" className="underline-offset-4 hover:underline">Início</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-home-brown-lighter">Projeto protegido</li>
          <li aria-hidden="true">]</li>
        </ol>
      </nav>
    </header>
  );
}
