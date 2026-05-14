"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BrandLockup } from "@/components/entrelinhas/BrandAssets";

export function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (!supabase || !isSupabaseConfigured) {
      setStatus("Não conseguimos atualizar sua senha agora.");
      return;
    }

    if (password.length < 6) {
      setStatus("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setStatus("O link pode ter expirado. Solicite um novo acesso.");
      return;
    }

    setStatus("Senha atualizada.");
    window.setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <main className="brand-surface flex min-h-screen items-center justify-center px-5 py-10 text-entrelinhas-ivory">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit justify-center">
          <BrandLockup priority avatarClassName="h-11 w-11" size={72} textClassName="text-lg" />
        </Link>
        <form onSubmit={updatePassword} className="editorial-panel brand-fade-in rounded-3xl p-6 sm:p-7">
          <h1 className="text-3xl font-semibold text-white">Nova senha</h1>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            Defina uma nova senha para continuar sua jornada de presença executiva.
          </p>
          <label className="mt-7 block">
            <span className="text-sm font-semibold text-white/85">Senha</span>
            <input required minLength={6} type="password" className="mt-2 w-full rounded-xl border border-entrelinhas-gold/15 bg-[#071525]/72 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/50" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="minimo 6 caracteres" />
          </label>
          {status ? <p className="mt-4 rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}
          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            Atualizar senha <ArrowRight size={18} />
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
