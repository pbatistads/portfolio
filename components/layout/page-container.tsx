import type { ReactNode } from "react";

export function PageContainer({ children, width = "page", className = "" }: {
  children: ReactNode;
  width?: "page" | "reading";
  className?: string;
}) {
  return <div className={`portfolio-container portfolio-container--${width} ${className}`}>{children}</div>;
}
