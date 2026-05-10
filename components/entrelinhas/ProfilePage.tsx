"use client";

import { Save, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ProfileForm } from "@/lib/entrelinhas";

const emptyProfile: ProfileForm = {
  full_name: "",
  current_role: "",
  industry: "",
  career_goal: "",
  preferred_style: "Executivo"
};

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [status, setStatus] = useState<string | null>(null);

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
          industry: row.industry ?? "",
          career_goal: row.career_goal ?? "",
          preferred_style: row.preferred_style ?? "Executivo"
        });
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
      setStatus("Não conseguimos salvar agora. Tente novamente em instantes.");
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString()
    });
    setStatus(error ? "Não conseguimos salvar agora. Tente novamente em instantes." : "Perfil salvo.");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Perfil</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Contexto profissional</h1>
      <p className="mt-3 text-sm leading-6 text-entrelinhas-muted sm:text-base">
        Use poucos detalhes. Eles ajudam a calibrar tom, postura e objetivo.
      </p>

      <form onSubmit={save} className="glass-panel mt-6 space-y-4 p-5">
        <User className="text-entrelinhas-gold" size={26} />
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Nome</span>
          <input value={profile.full_name} onChange={(event) => updateField("full_name", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Cargo atual</span>
          <input value={profile.current_role} onChange={(event) => updateField("current_role", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Segmento</span>
          <input value={profile.industry} onChange={(event) => updateField("industry", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Objetivo profissional</span>
          <textarea rows={4} value={profile.career_goal} onChange={(event) => updateField("career_goal", event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/85">Estilo preferido</span>
          <select value={profile.preferred_style} onChange={(event) => updateField("preferred_style", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c111d] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60">
            <option>Diplomático</option>
            <option>Firme</option>
            <option>Executivo</option>
          </select>
        </label>
        {status ? <p className="rounded-xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight">
          <Save size={18} /> Salvar perfil
        </button>
      </form>
    </div>
  );
}
