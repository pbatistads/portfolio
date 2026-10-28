import type { ReactNode } from "react";

export function CaseDecisions({ children, className, nodeId }: { children: ReactNode; className: string; nodeId: string }) {
  return <section className={className} data-node-id={nodeId}>{children}</section>;
}
