import "server-only";
import { privateCases } from "./private-media-manifest.mjs";

export { privateCases };
export function getPrivateCase(slug: string) {
  return Object.hasOwn(privateCases, slug) ? privateCases[slug as keyof typeof privateCases] : null;
}
