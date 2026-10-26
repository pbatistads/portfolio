/** Every field here is public, including for protected projects. */
export type ProjectMetadata = Readonly<{
  slug: string;
  title: string;
  summary: string;
  categories: readonly string[];
  thumbnail: Readonly<{
    src: `/${string}`;
    alt: string;
  }>;
  access: "public" | "protected";
}>;
