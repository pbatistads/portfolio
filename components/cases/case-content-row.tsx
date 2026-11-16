import type { ReactNode } from "react";
import "./case-composition.css";

export function CaseContentRow({ children, nodeId, className = "" }: { children: ReactNode; nodeId: string; className?: string }) {
  return <div className={`case-content-row ${className}`} data-node-id={nodeId} data-name="Text Div">{children}</div>;
}
