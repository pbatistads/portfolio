import type { ReactNode } from "react";
import type { ProjectMetadata } from "@/projects/types";

export function CaseLayout({
  project,
  children,
}: {
  project: ProjectMetadata;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        <p className="text-lg">{project.summary}</p>
        <ul className="flex flex-wrap gap-3" aria-label="Categorias">
          {project.categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </header>
      {children}
    </main>
  );
}
