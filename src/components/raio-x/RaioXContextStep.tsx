"use client";

import { FormEvent, ReactNode, useState } from "react";
import type { ExecutivePresenceContextSnapshot } from "@/src/types/executivePresence";
import { BrandAvatar } from "@/components/entrelinhas/BrandAssets";

type RaioXContextStepProps = {
  initialContext?: ExecutivePresenceContextSnapshot | null;
  onContinue: (context: ExecutivePresenceContextSnapshot) => void;
};

const seniorityOptions = ["Inicio de carreira", "Pleno", "Senior", "Coordenacao", "Gerencia", "Diretoria", "Fundadora / C-level"];

export function RaioXContextStep({ initialContext, onContinue }: RaioXContextStepProps) {
  const [context, setContext] = useState<ExecutivePresenceContextSnapshot>({
    currentRole: initialContext?.currentRole ?? "",
    seniority: initialContext?.seniority ?? "",
    industry: initialContext?.industry ?? "",
    mainChallenge: initialContext?.mainChallenge ?? "",
    careerGoal: initialContext?.careerGoal ?? ""
  });

  function update(field: keyof ExecutivePresenceContextSnapshot, value: string) {
    setContext((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onContinue({
      currentRole: normalize(context.currentRole),
      seniority: normalize(context.seniority),
      industry: normalize(context.industry),
      mainChallenge: normalize(context.mainChallenge),
      careerGoal: normalize(context.careerGoal)
    });
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="brand-fade-in">
        <BrandAvatar className="h-20 w-20" size={140} priority />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.26em] text-entrelinhas-gold">Contexto executivo</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Antes do Raio-X, situe sua fase profissional.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-entrelinhas-muted">
          O mesmo padrao de presenca muda de peso conforme cargo, senioridade e objetivo. Esse contexto calibra sua devolutiva sem transformar o Raio-X em teste psicologico.
        </p>
      </div>

      <form onSubmit={submit} className="editorial-panel brand-fade-in space-y-4 p-5 sm:p-7">
        <Field label="Cargo atual">
          <input
            required
            value={context.currentRole ?? ""}
            onChange={(event) => update("currentRole", event.target.value)}
            placeholder="Ex.: Coordenadora de marketing"
            className="w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/70 focus:border-entrelinhas-gold/55"
          />
        </Field>

        <Field label="Senioridade">
          <select
            required
            value={context.seniority ?? ""}
            onChange={(event) => update("seniority", event.target.value)}
            className="w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55"
          >
            <option value="">Selecione</option>
            {seniorityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Area ou segmento">
          <input
            required
            value={context.industry ?? ""}
            onChange={(event) => update("industry", event.target.value)}
            placeholder="Ex.: Tecnologia, financeiro, saude"
            className="w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/70 focus:border-entrelinhas-gold/55"
          />
        </Field>

        <Field label="Principal desafio agora">
          <textarea
            required
            rows={3}
            value={context.mainChallenge ?? ""}
            onChange={(event) => update("mainChallenge", event.target.value)}
            placeholder="Ex.: ganhar mais visibilidade sem parecer defensiva"
            className="w-full resize-none rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/70 focus:border-entrelinhas-gold/55"
          />
        </Field>

        <Field label="Objetivo profissional">
          <textarea
            required
            rows={3}
            value={context.careerGoal ?? ""}
            onChange={(event) => update("careerGoal", event.target.value)}
            placeholder="Ex.: assumir uma posicao de lideranca nos proximos 12 meses"
            className="w-full resize-none rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-entrelinhas-muted/70 focus:border-entrelinhas-gold/55"
          />
        </Field>

        <button className="w-full rounded-2xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:bg-entrelinhas-goldLight">
          Continuar para o Raio-X
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/85">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function normalize(value: string | null) {
  const cleanValue = value?.trim();
  return cleanValue ? cleanValue : null;
}
