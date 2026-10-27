import Image from "next/image";

export function HomeFooter() {
  return (
    <footer className="relative border-t border-home-border px-[var(--home-gutter)] py-6 text-center text-xs leading-5 text-home-brown-lighter">
      <Image src="/images/home/divider.svg" alt="" width={1440} height={1} unoptimized className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2" />
      <p>designed &amp; coded by Poliana Batista</p>
    </footer>
  );
}
