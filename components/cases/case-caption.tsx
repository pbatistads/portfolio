import type { ReactNode } from "react";
import "./case-composition.css";

export function CaseCaption({ children, nodeId, variant = "section" }: {
  children: ReactNode;
  nodeId: string;
  variant?: "section" | "metadata" | "card";
}) {
  return <p className={`case-caption case-caption--${variant}`} data-node-id={nodeId}>{children}</p>;
}
