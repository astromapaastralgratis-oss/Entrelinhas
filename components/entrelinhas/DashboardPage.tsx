"use client";

import Link from "next/link";
import { ArrowRight, Goal, MessageSquareText, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { situationOptions } from "@/lib/entrelinhas";

export function DashboardPage() {
  const [name, setName] = useState("executiva");
  const [goal, setGoal] = useState("Definir um objetivo profissional no perfil");
  const [hasExecutivePresenceResult, setHasExecutivePresenceResult] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const metadataName = data.user.user_metadata?.full_name;
      const { data: profile } = await client
        .from("profiles")
        .select("full_name, career_goal")
        .eq("id", data.user.id)
        .maybeSingle();
      setName(profile?.full_name || metadataName || data.user.email?.split("@")[0] || "executiva");
      setGoal(profile?.career_goal || "Definir um objetivo profissional no perfil");

      const { data: raioXResult } = await client
        .from("executive_presence_results")
        .select("id")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setHasExecutivePresenceResult(Boolean(raioXResult));
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Mentoria</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Olá, {name}.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-entrelinhas-muted sm:text-base">
            Um espaço para praticar presença executiva, repertório e posicionamento profissional.
          </p>
        </div>
        <Link href="/mentor" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight sm:w-fit">
          Trabalhar uma situação real <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel p-5">
          <Goal className="text-entrelinhas-gold" size={23} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Direção profissional</p>
          <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">{goal}</h2>
          <Link href="/profile" className="mt-4 inline-flex text-sm font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight">
            Refinar contexto
          </Link>
        </article>

        <Link
          href="/raio-x"
          className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-entrelinhas transition hover:border-entrelinhas-gold/30 hover:bg-white/[0.065]"
        >
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-entrelinhas-bronze/25 bg-entrelinhas-bronze/10 text-entrelinhas-bronzeLight">
              <ScanLine size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Raio-X Executivo</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-white">Uma leitura estratégica sobre como sua presença sustenta espaço.</h2>
              <span className="mt-4 inline-flex items-center justify-center rounded-xl border border-entrelinhas-gold/35 px-4 py-3 text-sm font-bold text-entrelinhas-gold transition group-hover:border-entrelinhas-gold/70">
                {hasExecutivePresenceResult ? "Rever minha leitura" : "Fazer meu Raio-X"}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white">Práticas de posicionamento</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {situationOptions.map((situation) => (
            <Link key={situation} href={`/mentor?situation=${encodeURIComponent(situation)}`} className="glass-card group min-h-32 p-4">
              <MessageSquareText className="text-entrelinhas-gold transition group-hover:text-entrelinhas-goldLight" size={23} />
              <h3 className="mt-4 text-base font-semibold leading-snug text-white sm:text-lg">{situation}</h3>
              <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">Construir repertório</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
