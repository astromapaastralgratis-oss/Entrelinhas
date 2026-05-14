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

const personalizationOptions: Array<{ value: BetaPersonalizationRating; label: string }> = [
  { value: "sim_muito", label: "Sim, muito" },
  { value: "em_partes", label: "Em partes" },
  { value: "pouco", label: "Pouco" },
  { value: "nao", label: "Nao" }
];

const depthOptions: Array<{ value: BetaDepthRating; label: string }> = [
  { value: "superficial", label: "Superficial" },
  { value: "adequado", label: "Adequado" },
  { value: "profundo", label: "Profundo" },
  { value: "profundo_demais_confuso", label: "Profundo demais/confuso" }
];

const intentOptions: Array<{ value: BetaIntentRating; label: string }> = [
  { value: "sim", label: "Sim" },
  { value: "talvez", label: "Talvez" },
  { value: "nao", label: "Nao" }
];

const toneOptions: Array<{ value: BetaToneRating; label: string }> = [
  { value: "humano_sofisticado", label: "Humano e sofisticado" },
  { value: "um_pouco_generico", label: "Um pouco generico" },
  { value: "muito_tecnico", label: "Muito tecnico" },
  { value: "muito_emocional", label: "Muito emocional" }
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
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">
            Obrigada
          </p>
          <p className="mt-3 text-sm leading-6 text-entrelinhas-muted">
            Sua percepcao ajuda a tornar o Entrelinhas mais preciso e humano.
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
              Feedback beta
            </span>
            <span className="mt-2 block text-base font-semibold text-white">
              Deixar minha percepcao sobre a leitura
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
              label="A leitura pareceu feita para voce?"
              options={personalizationOptions}
              value={draft.personalizationRating}
              onChange={(personalizationRating) => setDraft((current) => ({ ...current, personalizationRating }))}
            />
            <FeedbackChoiceGroup
              label="O nivel de profundidade foi:"
              options={depthOptions}
              value={draft.depthRating}
              onChange={(depthRating) => setDraft((current) => ({ ...current, depthRating }))}
            />
            <FeedbackChoiceGroup
              label="Voce salvaria ou compartilharia algum trecho?"
              options={intentOptions}
              value={draft.wouldShare}
              onChange={(wouldShare) => setDraft((current) => ({ ...current, wouldShare }))}
            />
            <FeedbackChoiceGroup
              label="Voce voltaria para usar de novo?"
              options={intentOptions}
              value={draft.wouldReturn}
              onChange={(wouldReturn) => setDraft((current) => ({ ...current, wouldReturn }))}
            />
            <FeedbackChoiceGroup
              label="O tom da leitura pareceu:"
              options={toneOptions}
              value={draft.toneRating}
              onChange={(toneRating) => setDraft((current) => ({ ...current, toneRating }))}
            />

            <div className="grid gap-4 lg:grid-cols-3">
              <FeedbackTextarea
                label="Qual parte mais pareceu real para voce?"
                value={draft.mostRealPart}
                onChange={(mostRealPart) => setDraft((current) => ({ ...current, mostRealPart }))}
              />
              <FeedbackTextarea
                label="Qual parte pareceu generica ou menos precisa?"
                value={draft.genericPart}
                onChange={(genericPart) => setDraft((current) => ({ ...current, genericPart }))}
              />
              <FeedbackTextarea
                label="O que voce melhoraria?"
                value={draft.improvementSuggestion}
                onChange={(improvementSuggestion) => setDraft((current) => ({ ...current, improvementSuggestion }))}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || status === "saving"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/24 bg-entrelinhas-gold/10 px-5 py-3 text-sm font-bold text-entrelinhas-goldLight transition duration-300 hover:border-entrelinhas-gold/45 hover:bg-entrelinhas-gold/16 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              <Send size={16} />
              {status === "saving" ? "Registrando..." : "Enviar percepcao"}
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
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <FeedbackChoice key={option.value} selected={value === option.value} onClick={() => onChange(option.value)}>
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
        placeholder="Escreva em poucas palavras, se quiser."
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
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition duration-300 ${
        selected
          ? "border-entrelinhas-gold/45 bg-entrelinhas-gold/14 text-entrelinhas-goldLight"
          : "border-entrelinhas-gold/10 bg-entrelinhas-void/35 text-entrelinhas-muted hover:border-entrelinhas-gold/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
