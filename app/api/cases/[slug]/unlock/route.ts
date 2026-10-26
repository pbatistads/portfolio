import { unlockCase } from "@/projects/server/unlock-case";

export async function POST(request: Request, { params }: RouteContext<"/api/cases/[slug]/unlock">) {
  const { slug } = await params;
  return unlockCase(request, slug);
}
