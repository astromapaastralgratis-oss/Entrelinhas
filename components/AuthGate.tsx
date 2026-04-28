"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthMode = "signin" | "signup";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsReady(true);
      setIsAuthenticated(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setIsReady(true);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    const authCall =
      mode === "signup"
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

    const { error } = await authCall;
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(mode === "signup" ? "Conta criada. Entrando..." : "Entrada confirmada.");
  }

  if (!isReady) {
    return (
      <main className="min-h-screen bg-astral-void px-6 py-10 text-stone-100">
        <p className="text-sm text-stone-400">Carregando sessão...</p>
      </main>
    );
  }

  if (isAuthenticated) return <>{children}</>;

  return (
    <main className="min-h-screen bg-astral-void px-6 py-10 text-stone-100">
      <section className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-lg border border-astral-line bg-astral-panel/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs uppercase tracking-[0.28em] text-astral-gold">Astral Content Studio</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">
            {mode === "signin" ? "Entrar no estúdio" : "Criar acesso"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-400">
            Use email e senha para salvar planos, copies, imagens e histórico no Supabase.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Email</span>
              <input
                className="mt-2 w-full rounded-md border border-astral-line bg-astral-void px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-astral-gold"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Senha</span>
              <input
                className="mt-2 w-full rounded-md border border-astral-line bg-astral-void px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-astral-gold"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </label>

            {message ? (
              <p className="rounded-md border border-astral-line bg-astral-void/60 px-3 py-2 text-sm text-stone-300">
                {message}
              </p>
            ) : null}

            <button
              className="w-full rounded-md bg-astral-gold px-4 py-3 text-sm font-semibold text-astral-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processando..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            className="mt-4 w-full text-center text-sm text-stone-400 transition hover:text-stone-100"
            type="button"
            onClick={() => {
              setMode((current) => (current === "signin" ? "signup" : "signin"));
              setMessage(null);
            }}
          >
            {mode === "signin" ? "Ainda não tenho conta" : "Já tenho conta"}
          </button>
        </div>
      </section>
    </main>
  );
}
