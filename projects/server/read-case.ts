import "server-only";

import { getProjectMetadata } from "../catalog";
import { publicCaseLoaders } from "../content/public";
import { readProtectedCase } from "./protected-cases";

export async function readCase(slug: string) {
  const project = getProjectMetadata(slug);

  if (!project) return null;
  // Check access before consulting any content registry.
  if (project.access === "protected") return readProtectedCase();

  const load = publicCaseLoaders.get(project.slug);
  if (!load) return null;

  const { default: Content } = await load();
  return { project, Content };
}
