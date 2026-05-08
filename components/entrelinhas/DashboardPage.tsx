"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Goal, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { situationOptions } from "@/lib/entrelinhas";

export function DashboardPage() {
  const [name, setName] = useState("executiva");
  const [goal, setGoal] = useState("Definir um objetivo profissional no perfil");

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
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Olá, {name}.</h1>
          <p className="mt-3 max-w-2xl text-entrelinhas-muted">Escolha uma situação real e transforme tensão em um script executivo claro.</p>
        </div>
        <Link href="/mentor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight">
          Criar script executivo <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="glass-panel p-5">
          <Goal className="text-entrelinhas-gold" size={24} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Meta profissional</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{goal}</h2>
          <Link href="/profile" className="mt-5 inline-flex text-sm font-semibold text-entrelinhas-gold hover:text-entrelinhas-goldLight">
            Atualizar perfil
          </Link>
        </article>

        <article className="glass-panel p-5">
          <BriefcaseBusiness className="text-entrelinhas-purpleLight" size={24} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Fluxo principal</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Escolher situação → descrever contexto → gerar script → copiar ou salvar.</h2>
        </article>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white">Situações rápidas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {situationOptions.map((situation) => (
            <Link key={situation} href={`/mentor?situation=${encodeURIComponent(situation)}`} className="glass-card group min-h-36">
              <MessageSquareText className="text-entrelinhas-gold transition group-hover:text-entrelinhas-goldLight" size={24} />
              <h3 className="mt-5 text-lg font-semibold text-white">{situation}</h3>
              <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">Abrir gerador com esta situação.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
