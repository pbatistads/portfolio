import "server-only";

/**
 * Deliberately deny every read until per-project authorization is implemented.
 * Do not import, read, cache or return private files here in this phase.
 * server-only prevents client imports; it does not authorize a request.
 */
export function readProtectedCase(): null {
  return null;
}
