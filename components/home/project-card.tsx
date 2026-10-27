import Image from "next/image";
import Link from "next/link";
import { getProjectMetadata } from "@/projects/catalog";
import type { FeaturedProject } from "@/projects/featured";
import { homeTitleFont } from "./fonts";

export function ProjectCard({ project, preload = false }: { project: FeaturedProject; preload?: boolean }) {
  const registeredProject = getProjectMetadata(project.slug);
  const content = (
    <>
      <div className={`relative aspect-[2/1] w-full overflow-hidden ${project.roundedCover ? "rounded-lg" : ""}`}>
        <Image src={project.cover} alt={project.alt} fill
          unoptimized preload={preload} className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 id={`${project.slug}-title`} className={`${homeTitleFont.className} min-w-0 text-[clamp(17px,1.5vw,18px)] leading-[1.5] font-medium underline-offset-4 group-hover:underline group-focus-visible:underline`}>{project.title}</h2>
        <p className="shrink-0 text-base leading-6 text-home-brown-lighter">{project.year}</p>
      </div>
    </>
  );

  return (
    <article aria-labelledby={`${project.slug}-title`} className="min-w-0">
      {registeredProject ? (
        <Link href={`/cases/${registeredProject.slug}`} prefetch={false} className="group flex flex-col gap-4 rounded-lg md:gap-6">{content}</Link>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">{content}</div>
      )}
    </article>
  );
}
