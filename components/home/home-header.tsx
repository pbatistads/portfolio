import Link from "next/link";

const upcomingItems = ["about", "resume", "just for fun"];

export function HomeHeader() {
  return (
    <header className="px-[var(--home-gutter)] py-6 md:py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link href="/" aria-label="Poli Batista — início" className="-my-[7px] flex min-h-11 w-fit items-center text-xl leading-[30px] text-home-orange">Poli Batista</Link>
        <nav aria-label="Navegação principal" className="w-full sm:w-auto">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm leading-[22px] font-medium tracking-[0.7px] text-home-brown-lighter uppercase sm:flex sm:flex-wrap sm:justify-end sm:gap-x-5 lg:gap-x-14">
            <li><a href="#work" className="flex min-h-11 items-center underline-offset-4 hover:underline sm:-my-[11px]">[ work ]</a></li>
            {upcomingItems.map((item) => (
              <li key={item}><span aria-disabled="true" title="Em breve" className="flex min-h-11 cursor-default items-center sm:-my-[11px]">[ {item} ]</span></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
