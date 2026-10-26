import "server-only";

import type { ComponentType } from "react";

// Explicit imports only: URL parameters must never become filesystem paths.
// Example: ["my-project", () => import("./my-project")]
export const publicCaseLoaders = new Map<
  string,
  () => Promise<{ default: ComponentType }>
>([["demo-publico", () => import("./demo-publico")]]);
