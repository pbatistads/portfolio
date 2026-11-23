import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { pageMetadata, siteTitle, siteDescription } from "@/projects/site-metadata";
import { publicSiteOrigin } from "@/projects/server/deployment-policy.mjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...pageMetadata(siteTitle, siteDescription, "/"),
  metadataBase: new URL(publicSiteOrigin()),
  icons: { icon: [{ url: "/images/favicon.png", type: "image/png" }] },
  ...(process.env.VERCEL_ENV === "preview" ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<SmoothCursor /><SmoothScroll /></body>
    </html>
  );
}
