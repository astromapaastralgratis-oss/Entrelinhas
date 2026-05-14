"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { hasActiveExecutivePresence } from "@/src/lib/entrelinhas";
import { BrandLockup } from "@/components/entrelinhas/BrandAssets";

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
  const submittingRef = useRef(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;
    setError(null);

    if (!supabase || !isSupabaseConfigured) {
      setError("Não conseguimos abrir sua conta agora. Tente novamente em alguns instantes.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    if (isSignup) {
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
      });
      const signupData = (await signupResponse.json().catch(() => null)) as { error?: string } | null;

      if (!signupResponse.ok) {
        setError(signupData?.error ?? "Não foi possível criar sua conta agora. Confira os dados e tente novamente.");
        setLoading(false);
        submittingRef.current = false;
        return;
      }
    }

    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(getAuthErrorMessage(result.error.message, isSignup));
      setLoading(false);
      submittingRef.current = false;
      return;
    }

    if (isSignup) {
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
      setError("Seu acesso esta temporariamente indisponível.");
      setLoading(false);
      submittingRef.current = false;
      return;
    }

    router.push(hasActiveExecutivePresence(profile) ? "/dashboard" : "/raio-x");
    router.refresh();
  }

  return (
    <main className="brand-surface flex min-h-screen items-center justify-center px-5 py-10 text-entrelinhas-ivory">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit justify-center">
          <BrandLockup priority avatarClassName="h-11 w-11" size={72} textClassName="text-lg" />
        </Link>

        <form onSubmit={handleSubmit} className="editorial-panel brand-fade-in rounded-3xl p-6 sm:p-7">
          <h1 className="text-3xl font-semibold text-white">{isSignup ? "Comece pelo seu Raio-X Executivo" : "Entrar"}</h1>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            {isSignup ? "Sua jornada começa por uma análise estratégica de presença, influência e condução profissional." : "Entre para continuar sua evolução executiva."}
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
              <input required type="email" className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="você@empresa.com" />
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
            {isSignup ? "Ja tem conta?" : "Ainda não tem conta?"}{" "}
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

function getAuthErrorMessage(message: string, isSignup: boolean) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already registered") || normalized.includes("already exists") || normalized.includes("user already")) {
    return "Este email já está cadastrado. Entre com sua senha ou use a recuperacao de acesso.";
  }

  if (normalized.includes("password") && (normalized.includes("weak") || normalized.includes("short") || normalized.includes("6"))) {
    return "Use uma senha mais forte, com pelo menos 6 caracteres.";
  }

  if (normalized.includes("invalid email") || normalized.includes("email address")) {
    return "Confira o email informado. Ele precisa estar em um formato valido.";
  }

  if (normalized.includes("email signups are disabled") || normalized.includes("signup is disabled") || normalized.includes("signups not allowed")) {
    return "O cadastro por email está temporariamente indisponível. Tente novamente mais tarde.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many") ||
    normalized.includes("over_email_send_rate_limit") ||
    normalized.includes("email rate limit") ||
    normalized.includes("security purposes")
  ) {
    return "O envio de acesso ficou temporariamente limitado. Aguarde alguns minutos e tente novamente.";
  }

  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) {
    return "Email ou senha não conferem. Revise os dados ou recupere sua senha.";
  }

  return isSignup
    ? "Não foi possível criar sua conta agora. Confira os dados e tente novamente."
    : "Não foi possível entrar com esses dados. Confira email e senha e tente novamente.";
}
