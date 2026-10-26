import type { ProjectMetadata } from "./types";

// Public information only. Never import full case content into this module.
// No projects have been supplied yet; keep the existing Home unchanged.
export const projects: readonly ProjectMetadata[] = [];

export function getProjectMetadata(slug: string) {
  return projects.find((project) => project.slug === slug);
}
