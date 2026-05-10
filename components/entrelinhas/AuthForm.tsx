"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { hasActiveExecutivePresence } from "@/src/lib/entrelinhas";
import { BrandAvatar, BrandLogo } from "@/components/entrelinhas/BrandAssets";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!supabase || !isSupabaseConfigured) {
      setError("Nao conseguimos abrir sua conta agora. Tente novamente em alguns instantes.");
      return;
    }

    setLoading(true);

    if (isSignup) {
      try {
        const availability = await fetch("/api/signup-availability");
        const data = await availability.json();
        if (data.allowed === false) {
          setError("As vagas de acesso estao temporariamente fechadas.");
          setLoading(false);
          return;
        }
      } catch {
        // Se a checagem falhar, mantemos o fluxo para nao bloquear uma conta valida.
      }
    }

    const result = isSignup
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError("Nao foi possivel entrar com esses dados. Confira email e senha e tente novamente.");
      setLoading(false);
      return;
    }

    if (isSignup) {
      const user = result.data.user;
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName || user.user_metadata?.full_name || null,
          updated_at: new Date().toISOString()
        });
      }
      router.push("/raio-x");
      router.refresh();
      return;
    }

    const user = result.data.user;
    if (!user) {
      router.push("/raio-x");
      router.refresh();
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("active_executive_presence_result_id, executive_presence_profile_id, executive_presence_completed_at, account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.account_status === "disabled") {
      await supabase.auth.signOut();
      setError("Seu acesso esta temporariamente indisponivel.");
      setLoading(false);
      return;
    }

    router.push(hasActiveExecutivePresence(profile) ? "/dashboard" : "/raio-x");
    router.refresh();
  }

  return (
    <main className="brand-surface flex min-h-screen items-center justify-center px-5 py-10 text-entrelinhas-ivory">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 block max-w-xs">
          <BrandLogo priority />
        </Link>

        <form onSubmit={handleSubmit} className="editorial-panel brand-fade-in rounded-3xl p-6 sm:p-7">
          <BrandAvatar className="mb-5 h-16 w-16" size={96} />
          <h1 className="text-3xl font-semibold text-white">{isSignup ? "Comece pelo seu Raio-X" : "Entrar"}</h1>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            {isSignup ? "Sua jornada de presenca comeca por uma leitura estrategica." : "Entre para continuar sua jornada de presenca executiva."}
          </p>

          <div className="mt-7 space-y-4">
            {isSignup ? (
              <label className="block">
                <span className="text-sm font-semibold text-white/85">Nome</span>
                <input className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Seu nome" />
              </label>
            ) : null}
            <label className="block">
              <span className="text-sm font-semibold text-white/85">Email</span>
              <input required type="email" className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/85">Senha</span>
              <input required minLength={6} type="password" className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="minimo 6 caracteres" />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isSignup ? "Criar conta" : "Entrar"} <ArrowRight size={18} />
          </button>

          <p className="mt-5 text-center text-sm text-entrelinhas-muted">
            {isSignup ? "Ja tem conta?" : "Ainda nao tem conta?"}{" "}
            <Link className="font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight" href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Entrar" : "Comecar pelo Raio-X"}
            </Link>
          </p>
          {!isSignup ? (
            <p className="mt-3 text-center text-sm">
              <Link className="font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight" href="/forgot-password">
                Esqueci minha senha
              </Link>
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
