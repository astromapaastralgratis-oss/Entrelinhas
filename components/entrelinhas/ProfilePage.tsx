"use client";

import { Save, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ProfileForm } from "@/lib/entrelinhas";
import { getActiveExecutivePresenceProfile } from "@/src/lib/entrelinhas";

const emptyProfile: ProfileForm = {
  full_name: "",
  current_role: "",
  seniority: "",
  industry: "",
  main_challenge: "",
  career_goal: "",
  preferred_style: "Executivo"
};

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [status, setStatus] = useState<string | null>(null);
  const [executivePresenceName, setExecutivePresenceName] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: row } = await client.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (row) {
        setProfile({
          full_name: row.full_name ?? "",
          current_role: row.current_role ?? "",
          seniority: row.seniority ?? "",
          industry: row.industry ?? "",
          main_challenge: row.main_challenge ?? "",
          career_goal: row.career_goal ?? "",
          preferred_style: row.preferred_style ?? "Executivo"
        });
        setExecutivePresenceName(getActiveExecutivePresenceProfile(row).profileName);
      } else {
        setProfile((current) => ({ ...current, full_name: data.user.user_metadata?.full_name ?? "" }));
      }
    });
  }, []);

  function updateField(field: keyof ProfileForm, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Nao conseguimos salvar agora. Tente novamente em instantes.");
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString()
    });
    setStatus(error ? "Nao conseguimos salvar agora. Tente novamente em instantes." : "Perfil salvo.");
  }

  return (
    <div className="brand-fade-in mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Contexto</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Contexto executivo</h1>
      <p className="mt-3 text-sm leading-6 text-entrelinhas-muted sm:text-base">
        Use poucos detalhes. Eles ajudam a calibrar postura, criterio e objetivo profissional.
      </p>
      {executivePresenceName ? (
        <div className="mt-5 rounded-2xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm font-semibold leading-6 text-entrelinhas-goldLight">
          Seu Raio-X ativo: {executivePresenceName}
        </div>
      ) : null}

      <form onSubmit={save} className="editorial-panel mt-6 space-y-4 p-5">
        <User className="text-entrelinhas-gold" size={26} />
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Nome</span>
          <input value={profile.full_name} onChange={(event) => updateField("full_name", event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Cargo atual</span>
          <input value={profile.current_role} onChange={(event) => updateField("current_role", event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Senioridade</span>
          <input value={profile.seniority} onChange={(event) => updateField("seniority", event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Segmento</span>
          <input value={profile.industry} onChange={(event) => updateField("industry", event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Principal desafio</span>
          <textarea rows={3} value={profile.main_challenge} onChange={(event) => updateField("main_challenge", event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Objetivo profissional</span>
          <textarea rows={4} value={profile.career_goal} onChange={(event) => updateField("career_goal", event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Estilo preferido</span>
          <select value={profile.preferred_style} onChange={(event) => updateField("preferred_style", event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55">
            <option>Diplomatico</option>
            <option>Firme</option>
            <option>Executivo</option>
          </select>
        </label>
        {status ? <p className="rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:bg-entrelinhas-goldLight">
          <Save size={18} /> Salvar perfil
        </button>
      </form>
    </div>
  );
}
