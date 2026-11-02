"use client";

import { useId, useState, type FormEvent } from "react";
import { homeTextFont, homeTitleFont } from "@/components/home/fonts";
import { CaseHeader } from "./case-header";
import { HomeFooter } from "@/components/home/home-footer";
import "./protected-case-gate.css";

export function ProtectedCaseGate({ slug }: { slug: string }) {
  const id = useId();
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
    <div className={`${homeTextFont.className} portfolio-home case-gate bg-home-white text-home-brown`} lang="pt-BR">
      <CaseHeader />
      <main className="case-gate-main">
        <section className="case-gate-card" aria-labelledby={`${id}-title`}>
          <div className="case-gate-intro">
            <h1 id={`${id}-title`} className={homeTitleFont.className}>Insira a senha</h1>
            <p id={`${id}-help`}>Alguns detalhes deste projeto precisam ser preservados por questões de confidencialidade. Para conhecer o trabalho completo, insira a senha de acesso.</p>
          </div>
          <form onSubmit={unlock} className="case-gate-form" aria-busy={pending}>
            <label htmlFor={`${id}-password`} className="sr-only">Senha do case</label>
            <input id={`${id}-password`} name="password" type="password" required maxLength={1024}
              autoComplete="current-password" placeholder="Insira a senha" aria-describedby={`${id}-help ${id}-error`}
              aria-invalid={Boolean(error)} className="case-gate-input" />
            <p id={`${id}-error`} role="alert" className={error ? "case-gate-error" : "hidden"}>{error}</p>
            <button type="submit" disabled={pending} className="case-gate-submit">
              {pending ? "Acessando…" : "Acessar"}
            </button>
            <p role="status" className="sr-only">{pending ? "Verificando a senha." : ""}</p>
          </form>
          <p className="case-gate-contact">Não possui senha? <a href="https://www.linkedin.com/in/polianabatistads/" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">Fala comigo!</a></p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
