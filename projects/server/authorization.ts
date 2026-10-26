import "server-only";

import { cookies } from "next/headers";
import { getProjectMetadata } from "../catalog";
import { getPrivateCase } from "./private-registry";
import { isPasswordHash } from "./passwords.mjs";
import { cookieName, verifySession } from "./session-token.mjs";

export function getCaseCredentials(slug: string) {
  const entry = getPrivateCase(slug);
  const secret = process.env.CASE_SESSION_SECRET;
  const hash = entry && process.env[entry.passwordEnv];
  if (getProjectMetadata(slug)?.access !== "protected" || !entry ||
      !secret || !/^[A-Za-z0-9_-]{43,}$/.test(secret) || !isPasswordHash(hash)) return null;
  return { secret, hash: hash as string };
}

export async function isCaseAuthorized(slug: string) {
  const cookieStore = await cookies();
  const credentials = getCaseCredentials(slug);
  if (!credentials) return false;
  const token = cookieStore.get(cookieName(slug, process.env.NODE_ENV === "production"))?.value;
  return verifySession(token, slug, credentials.secret, credentials.hash);
}
