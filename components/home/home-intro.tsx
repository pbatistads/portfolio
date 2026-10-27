import { homeTitleFont } from "./fonts";

export function HomeIntro() {
  return (
    <section aria-labelledby="home-title" className="px-[var(--home-gutter)] pt-14 pb-8 md:pt-24 md:pb-12 xl:pt-40 xl:pb-[79px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,460fr)] lg:items-end lg:gap-[clamp(40px,8.333vw,120px)]">
        <h1 id="home-title" className={`${homeTitleFont.className} min-w-0 text-[clamp(28px,3.333333vw,48px)] leading-[clamp(42px,5vw,72px)] font-normal`}>
          Engenheira de Software trabalhando como{" "}
          <em className="text-[clamp(30px,3.611111vw,52px)] leading-none text-home-brown">Designer de Produto</em>
        </h1>
        <div className="flex min-w-0 flex-col gap-4 text-base leading-[22px] lg:pb-2.5">
          <p className="font-semibold">Meu trabalho acontece no meio do caminho entre o que as pessoas precisam, o que o negócio quer e o que a tecnologia consegue construir.</p>
          <p>É nesse espaço que transformo problemas complexos em produtos digitais claros, funcionais e viáveis.</p>
          <p className="font-semibold">Senior Product Designer &amp; Team Lead @ Laon</p>
        </div>
      </div>
    </section>
  );
}
