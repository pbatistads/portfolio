import type { ReactNode } from "react";
import "./case-composition.css";

export function CaseIntro({ children, id, nodeId }: { children: ReactNode; id: string; nodeId: string }) {
  return <section id={id} className="case-intro" data-node-id={nodeId} data-name="Intro" aria-labelledby={`${id}-title`}>{children}</section>;
}
