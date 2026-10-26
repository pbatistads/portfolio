import "server-only";

import { NextResponse } from "next/server";
import { getProjectMetadata } from "../catalog";
import { getCaseCredentials } from "./authorization";
import { verifyPassword } from "./passwords.mjs";
import { consumeUnlockAttempt } from "./rate-limit";
import { cookieName, issueSession, SESSION_SECONDS } from "./session-token.mjs";

export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function error(message: string, status: number, extra = {}) {
  return NextResponse.json({ error: message }, { status, headers: { ...privateHeaders, ...extra } });
}

export async function unlockCase(request: Request, slug: string) {
  if (getProjectMetadata(slug)?.access !== "protected") return error("Case não encontrado.", 404);
  const origin = process.env.CASE_ALLOWED_ORIGIN ?? (process.env.NODE_ENV !== "production" ? new URL(request.url).origin : null);
  if (!origin) return error("Desbloqueio indisponível.", 503);
  if (request.headers.get("origin") !== origin ||
      !request.headers.get("content-type")?.startsWith("application/json")) return error("Requisição não permitida.", 403);

  // Consume a shared attempt before expensive scrypt work or parsing input.
  const rate = await consumeUnlockAttempt(slug);
  if (rate.status === "unavailable") return error("Desbloqueio temporariamente indisponível.", 503);
  if (rate.status === "limited") return error("Muitas tentativas. Tente novamente mais tarde.", 429, { "Retry-After": String(rate.retryAfter) });
  const credentials = getCaseCredentials(slug);
  if (!credentials) return error("Desbloqueio temporariamente indisponível.", 503);

  // Bounded streamed input, even if Content-Length is absent or forged.
  const reader = request.body?.getReader();
  if (!reader) return error("Requisição inválida.", 400);
  let text = "";
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return error("Requisição muito grande.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const input = JSON.parse(text);
    if (typeof input?.password !== "string" || Buffer.byteLength(input.password) > 1024) return error("Requisição inválida.", 400);
    if (!await verifyPassword(input.password, credentials.hash)) return error("Senha incorreta.", 401);
  } catch {
    return error("Requisição inválida.", 400);
  } finally {
    reader.releaseLock();
  }

  const response = NextResponse.json({ ok: true }, { headers: privateHeaders });
  const production = process.env.NODE_ENV === "production";
  response.cookies.set(cookieName(slug, production), issueSession(slug, credentials.secret, credentials.hash), {
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
    expires: new Date(Date.now() + SESSION_SECONDS * 1000),
  });
  return response;
}
