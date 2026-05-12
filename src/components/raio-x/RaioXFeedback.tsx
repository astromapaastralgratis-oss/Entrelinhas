"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  buildExecutivePresenceFeedbackPayload,
  hasExecutivePresenceFeedback,
  type ExecutivePresenceFeedbackDraft
} from "@/src/utils/executivePresenceFeedback";

type RaioXFeedbackProps = {
  resultId?: string;
};

const initialDraft: ExecutivePresenceFeedbackDraft = {
  mostRealPart: "",
  genericPart: "",
  wouldShare: null,
  wouldReturn: null
};

export function RaioXFeedback({ resultId }: RaioXFeedbackProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const canSubmit = useMemo(() => hasExecutivePresenceFeedback(draft), [draft]);

  if (!resultId) return null;

  async function handleSubmit() {
    if (!supabase || !canSubmit || status === "saving") return;

    setStatus("saving");
    const { data: authData } = await supabase.auth.getUser();
    const payload = buildExecutivePresenceFeedbackPayload({
      resultId,
      userId: authData.user?.id,
      draft
    });

    if (!payload) {
      setStatus("idle");
      return;
    }

    const { error } = await supabase
      .from("executive_presence_feedback")
      .upsert(payload, { onConflict: "result_id,user_id" });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("saved");
  }

  if (status === "saved") {
    return (
      <div className="border-t border-entrelinhas-gold/12 p-5 sm:p-7">
        <div className="rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/42 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">
            Essa leitura fez sentido para você?
          </p>
          <p className="mt-3 text-sm leading-6 text-entrelinhas-muted">Obrigada. Sua percepção foi registrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-entrelinhas-gold/12 p-5 sm:p-7">
      <div className="rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/42 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">
              Essa leitura fez sentido para você?
            </p>
            <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
              Responda se fizer sentido. Isso ajuda a calibrar a experiência sem interromper sua jornada.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/38">Opcional</span>
        </div>

        <div className="mt-5 grid gap-4">
          <FeedbackTextarea
            label="Qual parte mais pareceu real?"
            value={draft.mostRealPart}
            onChange={(mostRealPart) => setDraft((current) => ({ ...current, mostRealPart }))}
          />
          <FeedbackTextarea
            label="Algo pareceu genérico?"
            value={draft.genericPart}
            onChange={(genericPart) => setDraft((current) => ({ ...current, genericPart }))}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FeedbackBoolean
              label="Você salvaria ou compartilharia essa leitura?"
              value={draft.wouldShare}
              onChange={(wouldShare) => setDraft((current) => ({ ...current, wouldShare }))}
            />
            <FeedbackBoolean
              label="Você voltaria para uma nova leitura?"
              value={draft.wouldReturn}
              onChange={(wouldReturn) => setDraft((current) => ({ ...current, wouldReturn }))}
            />
          </div>
        </div>

        {status === "error" ? (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
            Não conseguimos registrar agora. Você pode seguir normalmente.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || status === "saving"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/24 bg-entrelinhas-gold/10 px-5 py-3 text-sm font-bold text-entrelinhas-goldLight transition duration-300 hover:border-entrelinhas-gold/45 hover:bg-entrelinhas-gold/16 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
        >
          <Send size={16} />
          {status === "saving" ? "Registrando..." : "Registrar percepção"}
        </button>
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

function FeedbackBoolean({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/84">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <FeedbackChoice selected={value === true} onClick={() => onChange(true)}>
          Sim
        </FeedbackChoice>
        <FeedbackChoice selected={value === false} onClick={() => onChange(false)}>
          Ainda não
        </FeedbackChoice>
      </div>
    </div>
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
