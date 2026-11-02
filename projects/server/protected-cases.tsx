import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { CaseSection } from "@/components/cases/case-section";
import { getProjectMetadata } from "../catalog";
import { isCaseAuthorized } from "./authorization";
import { getPrivateCase } from "./private-registry";

type CaseContent = {
  sections: { title: string; text: string }[];
  image: string;
  imageAlt: string;
  download: string;
};

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
  if (!entry.content) return null;
  const content: CaseContent = JSON.parse(await readFile(path.join(process.cwd(), "private/cases", entry.content), "utf8"));
  if (!Array.isArray(content.sections) || !content.sections.every(section =>
    typeof section.title === "string" && typeof section.text === "string") ||
    typeof content.imageAlt !== "string" || !Object.hasOwn(entry.files, content.image) ||
    !Object.hasOwn(entry.files, content.download)) throw new Error("Invalid private case configuration");

  function Content() {
    const base = `/api/cases/${encodeURIComponent(slug)}/files/`;
    return (
      <div>
        {content.sections.map((section, index) => (
          <CaseSection key={index} title={section.title}><p>{section.text}</p></CaseSection>
        ))}
        {/* Bypass the shared image optimizer cache for authorized media. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base + encodeURIComponent(content.image)} alt={content.imageAlt} width={960} height={540} className="mb-8 h-auto w-full rounded-lg" />
        <a href={base + encodeURIComponent(content.download)} className="underline">Baixar notas do case</a>
      </div>
    );
  }
  return { project, Content };
}

export async function readPrivateAsset(slug: string, filename: string) {
  if (!await isCaseAuthorized(slug)) return { status: 401 as const };
  const entry = getPrivateCase(slug);
  if (!entry || !Object.hasOwn(entry.files, filename)) return { status: 404 as const };
  const files: Record<string, { path: string; type: string; attachment: boolean }> = entry.files;
  const file = files[filename];
  try {
    const bytes = await readFile(path.join(process.cwd(), "private/cases", file.path));
    return { status: 200 as const, bytes, type: file.type, attachment: file.attachment };
  } catch {
    return { status: 503 as const };
  }
}
