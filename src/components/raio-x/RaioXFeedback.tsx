"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  buildRaioXBetaFeedbackPayload,
  hasRaioXBetaFeedback,
  type BetaDepthRating,
  type BetaIntentRating,
  type BetaPersonalizationRating,
  type BetaToneRating,
  type RaioXBetaFeedbackDraft
} from "@/src/utils/executivePresenceFeedback";

type RaioXFeedbackProps = {
  resultId?: string;
  profileId: string;
  methodologyVersion?: string;
};

const initialDraft: RaioXBetaFeedbackDraft = {
  personalizationRating: null,
  depthRating: null,
  wouldShare: null,
  wouldReturn: null,
  toneRating: null,
  mostRealPart: "",
  genericPart: "",
  improvementSuggestion: ""
};

const momentOptions: Array<{ value: BetaPersonalizationRating; label: string }> = [
  { value: "sim_muito", label: "Fez muito sentido" },
  { value: "em_partes", label: "Fez sentido em parte" },
  { value: "pouco", label: "Ainda não consegui me reconhecer" },
  { value: "nao", label: "Prefiro reler com mais calma" }
];

const identificationOptions: Array<{ value: BetaDepthRating; label: string }> = [
  { value: "profundo", label: "Me vi com clareza" },
  { value: "adequado", label: "Me vi em vários pontos" },
  { value: "superficial", label: "Me identifiquei pouco" },
  { value: "profundo_demais_confuso", label: "Não me reconheci" }
];

const clarityOptions: Array<{ value: BetaToneRating; label: string }> = [
  { value: "humano_sofisticado", label: "Sim, ficou muito clara" },
  { value: "um_pouco_generico", label: "Clara, mas poderia ser mais objetiva" },
  { value: "muito_emocional", label: "Boa, mas senti falta de exemplos" },
  { value: "muito_tecnico", label: "Ainda ficou abstrata" }
];

const valueOptions: Array<{ value: BetaIntentRating; label: string }> = [
  { value: "sim", label: "Entender como sou percebida" },
  { value: "talvez", label: "Perceber meus padrões sob pressão" },
  { value: "talvez", label: "Enxergar meus pontos de sabotagem" },
  { value: "nao", label: "Ter um próximo passo mais claro" },
  { value: "sim", label: "Receber um script de posicionamento" }
];

const deepeningOptions: Array<{ value: BetaIntentRating; label: string }> = [
  { value: "sim", label: "Sim, quero evoluir esse ponto" },
  { value: "talvez", label: "Sim, mas em outro momento" },
  { value: "talvez", label: "Talvez, se for mais prático" },
  { value: "nao", label: "Não agora" }
];

export function RaioXFeedback({ resultId, profileId, methodologyVersion }: RaioXFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const canSubmit = useMemo(() => hasRaioXBetaFeedback(draft), [draft]);

  if (!resultId) return null;

  async function handleSubmit() {
    if (!supabase || !canSubmit || status === "saving") return;

    setStatus("saving");
    const { data: authData } = await supabase.auth.getUser();
    const payload = buildRaioXBetaFeedbackPayload({
      resultId,
      userId: authData.user?.id,
      profileId,
      methodologyVersion,
      draft
    });

    if (!payload) {
      setStatus("idle");
      return;
    }

    const { error } = await supabase
      .from("feedback_ex")
      .upsert(payload, { onConflict: "result_id,user_id" });

    setStatus(error ? "idle" : "saved");
  }

  if (status === "saved") {
    return (
      <div className="border-t border-entrelinhas-gold/12 p-5 sm:p-7">
        <div className="rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/42 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">Percepção registrada</p>
          <p className="mt-3 text-sm leading-6 text-entrelinhas-muted">
            Obrigada. Sua leitura ajuda o Entrelinhas a permanecer profundo, claro e humano.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-entrelinhas-gold/12 p-5 sm:p-7">
      <div className="rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/42 p-5">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">
              Percepção executiva
            </span>
            <span className="mt-2 block text-lg font-semibold leading-snug text-white">
              Como essa leitura chegou para você?
            </span>
            <span className="mt-2 block text-sm leading-6 text-entrelinhas-muted">
              Essa percepção ajuda o Entrelinhas a evoluir sem perder profundidade.
            </span>
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-entrelinhas-gold transition duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen ? (
          <div className="mt-6 space-y-5">
            <FeedbackChoiceGroup
              label="A leitura fez sentido para o seu momento profissional?"
              options={momentOptions}
              value={draft.personalizationRating}
              onChange={(personalizationRating) => setDraft((current) => ({ ...current, personalizationRating }))}
            />
            <FeedbackChoiceGroup
              label="O quanto você se identificou com o perfil apresentado?"
              options={identificationOptions}
              value={draft.depthRating}
              onChange={(depthRating) => setDraft((current) => ({ ...current, depthRating }))}
            />
            <FeedbackChoiceGroup
              label="A leitura foi clara e fácil de aplicar?"
              options={clarityOptions}
              value={draft.toneRating}
              onChange={(toneRating) => setDraft((current) => ({ ...current, toneRating }))}
            />
            <FeedbackMappedChoiceGroup
              label="O que mais gerou valor para você?"
              options={valueOptions}
              value={draft.genericPart}
              onChange={(value) => setDraft((current) => ({ ...current, wouldShare: value.value, genericPart: value.label }))}
            />
            <FeedbackMappedChoiceGroup
              label="Você gostaria de aprofundar essa leitura?"
              options={deepeningOptions}
              value={draft.improvementSuggestion}
              onChange={(value) => setDraft((current) => ({ ...current, wouldReturn: value.value, improvementSuggestion: value.label }))}
            />

            <FeedbackTextarea
              label="Quer deixar uma percepção rápida?"
              value={draft.mostRealPart}
              onChange={(mostRealPart) => setDraft((current) => ({ ...current, mostRealPart }))}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || status === "saving"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/24 bg-entrelinhas-gold/10 px-5 py-3 text-sm font-bold text-entrelinhas-goldLight transition duration-300 hover:border-entrelinhas-gold/45 hover:bg-entrelinhas-gold/16 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              <Send size={16} />
              {status === "saving" ? "Registrando..." : "Enviar percepção"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FeedbackChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/84">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <FeedbackChoice
            key={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </FeedbackChoice>
        ))}
      </div>
    </div>
  );
}

function FeedbackMappedChoiceGroup({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: Array<{ value: BetaIntentRating; label: string }>;
  value: string;
  onChange: (value: { value: BetaIntentRating; label: string }) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/84">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <FeedbackChoice key={option.label} selected={value === option.label} onClick={() => onChange(option)}>
            {option.label}
          </FeedbackChoice>
        ))}
      </div>
    </div>
  );
}

function FeedbackTextarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/84">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        maxLength={600}
        className="mt-2 w-full resize-none rounded-2xl border border-entrelinhas-gold/12 bg-entrelinhas-void/42 px-4 py-3 text-sm leading-6 text-white outline-none transition duration-300 placeholder:text-white/28 focus:border-entrelinhas-gold/40 focus:bg-entrelinhas-navy/54"
        placeholder="Uma frase, um incômodo ou um ponto que fez sentido para você."
      />
    </label>
  );
}

function FeedbackChoice({
  selected,
  onClick,
  children
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold leading-5 transition duration-300 ${
        selected
          ? "border-entrelinhas-gold/45 bg-entrelinhas-gold/14 text-entrelinhas-goldLight"
          : "border-entrelinhas-gold/10 bg-entrelinhas-void/35 text-entrelinhas-muted hover:border-entrelinhas-gold/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
