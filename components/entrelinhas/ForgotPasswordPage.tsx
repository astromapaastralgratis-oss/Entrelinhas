"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BrandLockup } from "@/components/entrelinhas/BrandAssets";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendReset(event: FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (!supabase || !isSupabaseConfigured) {
      setStatus("Não conseguimos enviar o acesso agora. Tente novamente em instantes.");
      return;
    }

    setLoading(true);
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setStatus(error ? "Não conseguimos enviar o acesso agora. Confira o email e tente novamente." : "Enviamos o link para redefinir sua senha.");
    setLoading(false);
  }

  return (
    <main className="brand-surface flex min-h-screen items-center justify-center px-5 py-10 text-entrelinhas-ivory">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit justify-center">
          <BrandLockup priority avatarClassName="h-11 w-11" size={72} textClassName="text-lg" />
        </Link>
        <form onSubmit={sendReset} className="editorial-panel brand-fade-in rounded-3xl p-6 sm:p-7">
          <h1 className="text-3xl font-semibold text-white">Redefinir senha</h1>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            Informe seu email para receber um link seguro de acesso.
          </p>
          <label className="mt-7 block">
            <span className="text-sm font-semibold text-white/85">Email</span>
            <input required type="email" className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="você@empresa.com" />
          </label>
          {status ? <p className="mt-4 rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}
          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            Enviar link <ArrowRight size={18} />
          </button>
          <p className="mt-5 text-center text-sm">
            <Link className="font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight" href="/login">
              Voltar para entrada
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
