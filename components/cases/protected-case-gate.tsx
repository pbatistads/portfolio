"use client";

import { useId, useState, type FormEvent } from "react";

export function ProtectedCaseGate({ slug, title }: { slug: string; title: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const password = new FormData(form).get("password");
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(slug)}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ password }),
      });
      form.reset();
      if (!response.ok) {
        setError(response.status === 401 ? "Senha incorreta. Tente novamente." :
          response.status === 429 ? "Muitas tentativas. Aguarde 15 minutos antes de tentar novamente." :
            "Desbloqueio indisponível. Tente novamente mais tarde.");
        setPending(false);
        form.querySelector("input")?.focus();
        return;
      }
      // Discard any pre-authentication router cache and request an authorized render.
      window.location.reload();
    } catch {
      form.reset();
      setError("Não foi possível conectar. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <section className="mx-auto my-16 w-full max-w-md rounded-xl border border-zinc-300 p-6 dark:border-zinc-700" aria-labelledby={`${id}-title`}>
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4">
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4" />
      </svg>
      <h1 id={`${id}-title`} className="text-2xl font-semibold">Conteúdo protegido</h1>
      <p className="mt-3" id={`${id}-help`}>Informe a senha de {title}. O acesso será liberado somente para este case por 24 horas.</p>
      <form onSubmit={unlock} className="mt-6 space-y-4" aria-busy={pending}>
        <label htmlFor={`${id}-password`} className="block font-medium">Senha do case</label>
        <div className="flex gap-2">
          <input id={`${id}-password`} name="password" type={visible ? "text" : "password"} required maxLength={1024}
            autoComplete="current-password" aria-describedby={`${id}-help ${id}-error`} aria-invalid={Boolean(error)}
            className="min-w-0 flex-1 rounded border border-zinc-400 bg-transparent px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2" />
          <button type="button" onClick={() => setVisible(!visible)} aria-pressed={visible} aria-controls={`${id}-password`}
            className="rounded border border-zinc-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2">
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <p id={`${id}-error`} role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>
        <button type="submit" disabled={pending} className="w-full rounded bg-foreground px-4 py-3 text-background disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2">
          {pending ? "Desbloqueando…" : "Desbloquear"}
        </button>
        <p role="status" className="sr-only">{pending ? "Verificando a senha." : ""}</p>
      </form>
    </section>
  );
}
