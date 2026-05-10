"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { hasActiveExecutivePresence } from "@/src/lib/entrelinhas";

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
      setError("Não conseguimos abrir sua conta agora. Tente novamente em alguns instantes.");
      return;
    }

    setLoading(true);
    const result = isSignup
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError("Não foi possível entrar com esses dados. Confira email e senha e tente novamente.");
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
      .select("active_executive_presence_result_id, executive_presence_profile_id, executive_presence_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    router.push(hasActiveExecutivePresence(profile) ? "/dashboard" : "/raio-x");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-entrelinhas-void px-5 py-10 text-entrelinhas-ivory">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_24%_14%,rgba(224,194,126,0.16),transparent_22rem),radial-gradient(circle_at_76%_18%,rgba(139,92,246,0.22),transparent_26rem),linear-gradient(145deg,#070a12,#0d1322_52%,#090910)]" />
      <section className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
            <Sparkles size={21} />
          </span>
          <span className="text-base font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
        </Link>

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-7">
          <h1 className="text-3xl font-semibold text-white">{isSignup ? "Comece grátis" : "Entrar"}</h1>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            {isSignup ? "Comece pelo seu Raio-X e prepare conversas com mais clareza." : "Entre para continuar seus scripts e diagnósticos."}
          </p>

          <div className="mt-7 space-y-4">
            {isSignup ? (
              <label className="block">
                <span className="text-sm font-semibold text-white/85">Nome</span>
                <input className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Seu nome" />
              </label>
            ) : null}
            <label className="block">
              <span className="text-sm font-semibold text-white/85">Email</span>
              <input required type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/85">Senha</span>
              <input required minLength={6} type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="mínimo 6 caracteres" />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isSignup ? "Criar conta" : "Entrar"} <ArrowRight size={18} />
          </button>

          <p className="mt-5 text-center text-sm text-entrelinhas-muted">
            {isSignup ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
            <Link className="font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight" href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Entrar" : "Começar grátis"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
