"use client";

import { FormEvent, ReactNode, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ExecutivePresenceContextSnapshot } from "@/src/types/executivePresence";
import { BrandAvatar } from "@/components/entrelinhas/BrandAssets";

type RaioXContextStepProps = {
  initialContext?: ExecutivePresenceContextSnapshot | null;
  onContinue: (context: ExecutivePresenceContextSnapshot) => void;
};

const seniorityOptions = ["Inicio de carreira", "Pleno", "Senior", "Coordenacao", "Gerencia", "Diretoria", "Fundadora / C-level"];
const industryOptions = [
  "Tecnologia",
  "Financeiro",
  "Saude",
  "Educacao",
  "Varejo/Consumo",
  "Industria",
  "Servicos",
  "Juridico/Compliance",
  "Comunicacao/Marketing",
  "Consultoria",
  "Setor publico/Impacto",
  "Outro"
];

const challengeOptions = [
  "Sentir que preciso sustentar tudo",
  "Me posicionar com mais firmeza",
  "Excesso de cobranca interna",
  "Falta de reconhecimento",
  "Ambientes muito politicos",
  "Dificuldade de colocar limites",
  "Sensacao de estar sempre devendo",
  "Recuperar minha confiança profissional"
];

const goalOptions = [
  "Presença executiva",
  "Clareza para crescer",
  "Seguranca para me posicionar",
  "Influência nas decisões",
  "Equilibrio emocional no trabalho",
  "Reconhecimento profissional",
  "Liderança",
  "Confiança profissional"
];

export function RaioXContextStep({ initialContext, onContinue }: RaioXContextStepProps) {
  const [context, setContext] = useState<ExecutivePresenceContextSnapshot>({
    currentRole: initialContext?.currentRole ?? "",
    seniority: initialContext?.seniority ?? "",
    industry: initialContext?.industry ?? "",
    mainChallenge: initialContext?.mainChallenge ?? "",
    careerGoal: initialContext?.careerGoal ?? ""
  });
  const canContinue = Boolean(
    normalize(context.currentRole) &&
      normalize(context.seniority) &&
      normalize(context.industry) &&
      normalize(context.mainChallenge) &&
      normalize(context.careerGoal)
  );

  function update(field: keyof ExecutivePresenceContextSnapshot, value: string) {
    setContext((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue) return;

    onContinue({
      currentRole: normalize(context.currentRole),
      seniority: normalize(context.seniority),
      industry: normalize(context.industry),
      mainChallenge: normalize(context.mainChallenge),
      careerGoal: normalize(context.careerGoal)
    });
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-6 py-4 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="brand-fade-in">
        <BrandAvatar className="h-16 w-16 sm:h-20 sm:w-20" size={140} priority />
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.26em] text-entrelinhas-gold">Seu momento profissional</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          O mesmo padrão pode fortalecer ou desgastar você dependendo do momento profissional que está vivendo hoje.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-entrelinhas-muted">
          Alguns padrões se intensificam em momentos de crescimento, pressão, inseguranca ou transição. Esse contexto ajuda sua leitura a ficar mais precisa e humana.
        </p>
        <p className="mt-5 max-w-lg rounded-2xl border border-entrelinhas-gold/16 bg-entrelinhas-gold/[0.07] px-4 py-3 text-sm font-semibold leading-6 text-entrelinhas-goldLight">
          Nem sempre o que fez você crescer e o que vai sustentar sua próxima fase.
        </p>
      </div>

      <form onSubmit={submit} className="editorial-panel brand-fade-in space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>

        <Field label="Area ou segmento">
          <select
            required
            value={context.industry ?? ""}
            onChange={(event) => update("industry", event.target.value)}
            className="w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none transition duration-300 focus:border-entrelinhas-gold/55"
          >
            <option value="">Selecione</option>
            {industryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>

        <SelectableCardGroup
          label="O que mais tem consumido sua energia profissional hoje?"
          options={challengeOptions}
          value={context.mainChallenge ?? ""}
          onChange={(value) => update("mainChallenge", value)}
        />

        <SelectableCardGroup
          label="O que você mais deseja fortalecer agora?"
          options={goalOptions}
          value={context.careerGoal ?? ""}
          onChange={(value) => update("careerGoal", value)}
        />

        <button
          disabled={!canContinue}
          className="w-full rounded-2xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:bg-entrelinhas-goldLight disabled:cursor-not-allowed disabled:opacity-45"
        >
          Comecar minha leitura executiva
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

function SelectableCardGroup({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/85">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold leading-5 transition duration-300 ${
                selected
                  ? "border-entrelinhas-gold/55 bg-entrelinhas-gold/[0.12] text-white"
                  : "border-entrelinhas-gold/10 bg-entrelinhas-navy/48 text-entrelinhas-muted hover:border-entrelinhas-gold/32 hover:text-white"
              }`}
            >
              <span>{option}</span>
              {selected ? <CheckCircle2 className="shrink-0 text-entrelinhas-gold" size={16} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function normalize(value: string | null) {
  const cleanValue = value?.trim();
  return cleanValue ? cleanValue : null;
}
