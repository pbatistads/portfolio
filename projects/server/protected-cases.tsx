import "server-only";
import { getProjectMetadata } from "../catalog";
import { isCaseAuthorized } from "./authorization";
import { getPrivateCase } from "./private-registry";

export async function readProtectedCase(slug: string) {
  // Authorization MUST precede file reads, including server-side renders and RSC.
  if (!await isCaseAuthorized(slug)) return null;
  const entry = getPrivateCase(slug);
  const project = getProjectMetadata(slug);
  if (!entry || !project) return null;
  if (slug === "educacao-corporativa") {
    const { default: Content } = await import("./yourh");
    return { project, Content };
  }
  if (slug === "contratacao-audiovisual") {
    const { default: Content } = await import("./bluedesk");
    return { project, Content };
  }
  return null;
}
