import Image from "next/image";
import Link from "next/link";
import { getProjectMetadata } from "@/projects/catalog";
import type { FeaturedProject } from "@/projects/featured";
import { homeTitleFont } from "./fonts";
import { CursorLabel } from "@/components/ui/cursor-label";

export function ProjectCard({ project, preload = false }: { project: FeaturedProject; preload?: boolean }) {
  const registeredProject = getProjectMetadata(project.slug);
  const content = (
    <>
      <div className="home-project-copy">
        <div>
          <h2 id={`${project.slug}-title`} className={`${homeTitleFont.className} home-project-title`}>{project.title}</h2>
          <p className="home-project-description">{project.description}</p>
        </div>
        <dl className="home-project-metadata">
          <div><dt>[ Ano ]</dt><dd>{project.year}</dd></div>
          <div><dt>[ Papel ]</dt><dd>{project.role}</dd></div>
        </dl>
      </div>
      <CursorLabel className="home-project-cover" label={registeredProject ? "Ver caso de estudo" : ""} focusable={false}>
        <Image src={project.cover} alt={project.alt} fill sizes="(min-width: 1440px) 760px, (min-width: 1024px) 60vw, (min-width: 768px) 88vw, 100vw"
          unoptimized preload={preload} className="home-project-image" />
        {registeredProject && <span className="home-project-cta">Ver caso de estudo</span>}
      </CursorLabel>
    </>
  );

  return (
    <article aria-labelledby={`${project.slug}-title`} className="home-project">
      {registeredProject ? (
        <Link href={`/cases/${registeredProject.slug}`} prefetch={false} className="home-project-link" aria-labelledby={`${project.slug}-title`}>{content}</Link>
      ) : (
        <div className="home-project-link">{content}</div>
      )}
    </article>
  );
}
