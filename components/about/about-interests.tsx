import Image from "next/image";
import { homeTitleFont } from "@/components/home/fonts";

const interests = [
  "Sou mestranda em Computação Aplicada",
  "Gosto de viajar, comer e resolver sudoku",
  "Meu maior hobby é cozinhar",
  "Adoro assistir as mesmas séries repetidamente",
  "Sou atleta de handebol desde os 11 anos",
  "Eu desenvolvi um jogo inteirinho para um trabalho",
  "Sou fã de Naruto e Harry Potter",
];

export function AboutInterests() {
  return (
    <section className="about-interests" aria-labelledby="about-interests-title">
      <h2 id="about-interests-title" className={homeTitleFont.className}>Além do design</h2>
      <ul>
        {interests.map(interest => (
          <li key={interest}>
            <Image src="/images/home/asterisk.svg" alt="" width={12} height={12} unoptimized />
            <span>{interest}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
