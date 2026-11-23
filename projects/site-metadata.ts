import "server-only";
import type { Metadata } from "next";
import { publicSiteOrigin } from "./server/deployment-policy.mjs";

export const siteTitle = "Poli Batista | Designer de Produto";
export const siteDescription = "Engenheira de Software trabalhando como Designer de Produto. Senior Product Designer & Team Lead @ Laon.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const base = publicSiteOrigin();
  const images = [{ url: `${base}/images/about/me.png`, width: 238, height: 238, alt: "Poliana Batista" }];
  return {
    title,
    description,
    alternates: { canonical: `${base}${path}` },
    openGraph: { title, description, url: `${base}${path}`, siteName: "Poli Batista", locale: "pt_BR", type: "website", images },
    twitter: { card: "summary", title, description, images: images.map(image => image.url) },
  };
}
