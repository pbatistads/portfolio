import { homeTitleFont } from "@/components/home/fonts";
import { CursorLabel } from "@/components/ui/cursor-label";

export function AboutIntro() {
  return (
    <section className="about-intro" aria-labelledby="about-title">
      <div className="about-heading">
        <h1 id="about-title" className={homeTitleFont.className}>Oi, eu sou a <CursorLabel label="Na verdade, Poliana">Poli!</CursorLabel></h1>
      </div>
      <div className="about-biography">
        <p>Entrei na <strong>faculdade de Engenharia de Software</strong> sem ter muita certeza do que queria fazer. Sempre fui curiosa sobre tecnologia, mas também gostava de criar e explorar meu lado mais artístico. Foi durante a graduação que conheci o <strong>design de produto</strong>, quase por acaso, através de uma oportunidade de estágio.</p>
        <p>O que começou como uma experiência inesperada acabou se tornando uma profissão que combina muito comigo. Hoje, depois de <strong>seis anos trabalhando com design</strong>, encontrei um equilíbrio entre a tecnologia e a liberdade criativa que sempre gostei de explorar. Gosto de entender problemas, encontrar soluções e, principalmente, transformar ideias em interfaces das quais me orgulho.</p>
      </div>
    </section>
  );
}
