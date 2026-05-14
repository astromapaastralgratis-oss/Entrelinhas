"use client";

import Link from "next/link";
import { ArrowRight, Goal, MessageSquareText, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { situationOptions } from "@/lib/entrelinhas";
import { getActiveExecutivePresenceProfile, hasActiveExecutivePresence } from "@/src/lib/entrelinhas";
import { BrandAvatar, BrandLockup } from "@/components/entrelinhas/BrandAssets";

export function DashboardPage() {
  const [name, setName] = useState("executiva");
  const [goal, setGoal] = useState("Definir um objetivo profissional no perfil");
  const [hasExecutivePresenceResult, setHasExecutivePresenceResult] = useState(false);
  const [executivePresenceName, setExecutivePresenceName] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const metadataName = data.user.user_metadata?.full_name;
      const { data: profile } = await client
        .from("profiles")
        .select("full_name, career_goal, active_executive_presence_result_id, executive_presence_profile_id, executive_presence_completed_at")
        .eq("id", data.user.id)
        .maybeSingle();

      setName(profile?.full_name || metadataName || data.user.email?.split("@")[0] || "executiva");
      setGoal(profile?.career_goal || "Definir um objetivo profissional no perfil");
      setHasExecutivePresenceResult(hasActiveExecutivePresence(profile));
      setExecutivePresenceName(getActiveExecutivePresenceProfile(profile).profileName);
    });
  }, []);

  return (
    <div className="space-y-7">
      <section className="editorial-panel overflow-hidden rounded-[1.75rem] p-5 sm:p-7 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <BrandLockup priority avatarClassName="h-12 w-12" size={88} textClassName="text-lg" />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-entrelinhas-gold">Sua jornada executiva</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
              Ola, {name}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-entrelinhas-muted sm:text-lg">
              Evolução profissional exige movimentos bem escolhidos.
            </p>
            <Link href="/mentor" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-fit">
              Receber direcionamento estratégico <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-6 rounded-full bg-entrelinhas-blueLight/10 blur-3xl" />
            <BrandAvatar className="relative mx-auto h-44 w-44 sm:h-56 sm:w-56" size={256} priority />
            <div className="relative mt-5 rounded-2xl border border-entrelinhas-gold/18 bg-[#071525]/78 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Raio-X Executivo</p>
              <p className="mt-2 text-lg font-semibold text-white">{executivePresenceName ?? "Seu direcionamento"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
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
          className="group rounded-2xl border border-entrelinhas-gold/15 bg-[#08182A]/82 p-5 shadow-entrelinhas transition duration-300 hover:-translate-y-0.5 hover:border-entrelinhas-gold/30 hover:bg-[#0B2742]/82"
        >
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-entrelinhas-gold/20 bg-[#0B2742] text-entrelinhas-gold">
              <ScanLine size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Analise executiva</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-white">
                {executivePresenceName ?? "Raio-X Executivo"}
              </h2>
              <span className="mt-4 inline-flex items-center justify-center rounded-xl border border-entrelinhas-gold/35 px-4 py-3 text-sm font-bold text-entrelinhas-gold transition group-hover:border-entrelinhas-gold/70">
                {hasExecutivePresenceResult ? "Rever meu direcionamento" : "Fazer meu Raio-X"}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-white">Repertorio executivo</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {situationOptions.map((situation) => (
            <Link key={situation} href={`/mentor?situation=${encodeURIComponent(situation)}`} className="glass-card group min-h-32 p-4">
              <MessageSquareText className="text-entrelinhas-gold transition group-hover:text-entrelinhas-goldLight" size={23} />
              <h3 className="mt-4 text-base font-semibold leading-snug text-white sm:text-lg">{situation}</h3>
              <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">Plano de ação aplicado</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
