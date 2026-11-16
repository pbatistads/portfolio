const base = "/api/cases/contratacao-audiovisual/files/";

export function CaseMedia({ filename, alt, width, height, complex = false, variant = "default" }: {
  filename: string; alt: string; width: number; height: number; complex?: boolean; variant?: "default" | "hero" | "showcase";
}) {
  return (
    <figure className={`case-media ${complex ? "case-media-complex" : ""} ${variant !== "default" ? `case-media-${variant}` : ""}`} tabIndex={complex ? 0 : undefined} aria-label={complex ? "Diagrama: role horizontalmente para explorar os detalhes" : undefined}>
      <a href={base + encodeURIComponent(filename)} target="_blank" rel="noreferrer" aria-label={`Ampliar imagem: ${alt}`}>
      {/* Private media must bypass the public image optimizer cache. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base + encodeURIComponent(filename)} alt={alt} width={width} height={height} loading="lazy" />
      </a>
    </figure>
  );
}

export function CaseDivider() {
  return <hr className="case-divider" />;
}
