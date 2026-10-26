import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseLayout } from "@/components/cases/case-layout";
import { ProtectedCaseGate } from "@/components/cases/protected-case-gate";
import { getProjectMetadata } from "@/projects/catalog";
import { readCase } from "@/projects/server/read-case";

// Allow request-time access resolution without requiring a static case shell.
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectMetadata(slug);

  // Only explicitly public catalog fields may enter metadata.
  if (!project || project.access === "protected") {
    return { title: "Case protegido", robots: { index: false, follow: false, nosnippet: true, noimageindex: true, noarchive: true } };
  }

  return { title: project.title, description: project.summary };
}

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const metadata = getProjectMetadata(slug);
  if (!metadata) notFound();
  const result = await readCase(slug);
  if (!result && metadata.access === "protected") {
    return <ProtectedCaseGate slug={metadata.slug} title={metadata.title} />;
  }
  if (!result) notFound();

  const { project, Content } = result;
  return (
    <CaseLayout project={project}>
      <Content />
    </CaseLayout>
  );
}
