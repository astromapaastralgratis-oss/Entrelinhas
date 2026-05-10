import { ArrowLeft, Check } from "lucide-react";
import type { ExecutivePresenceOption, ExecutivePresenceQuestion } from "@/src/types/executivePresence";
import { RaioXProgress } from "@/src/components/raio-x/RaioXProgress";

type RaioXQuestionProps = {
  question: ExecutivePresenceQuestion;
  options: ExecutivePresenceOption[];
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  savedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  canGoBack: boolean;
  isAdvancing: boolean;
};

export function RaioXQuestion({
  question,
  options,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  savedOptionId,
  onSelect,
  onBack,
  canGoBack,
  isAdvancing
}: RaioXQuestionProps) {
  return (
    <section className="brand-fade-in mx-auto max-w-3xl">
      <RaioXProgress current={currentIndex + 1} total={totalQuestions} />

      <div className="mt-7 editorial-panel p-5 sm:p-7">
        <button
          onClick={onBack}
          disabled={!canGoBack || isAdvancing}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/35 px-4 py-2.5 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:border-entrelinhas-gold/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft size={17} /> Voltar
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Leitura {currentIndex + 1}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">{question.text}</h1>

        <div className="mt-7 space-y-3">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const wasSaved = savedOptionId === option.id && !selectedOptionId;

            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                disabled={isAdvancing}
                className={`group flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition duration-300 sm:p-5 ${
                  isSelected
                    ? "border-entrelinhas-gold/75 bg-entrelinhas-blue/34 text-white shadow-gold"
                    : wasSaved
                      ? "border-entrelinhas-bronze/45 bg-entrelinhas-blue/20 text-white"
                      : "border-entrelinhas-gold/10 bg-entrelinhas-navy/50 text-white/88 hover:border-entrelinhas-gold/28 hover:bg-entrelinhas-night/58"
                }`}
              >
                <span className="text-sm leading-7 sm:text-base">{option.text}</span>
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                    isSelected || wasSaved ? "border-entrelinhas-gold bg-entrelinhas-gold text-entrelinhas-ink" : "border-white/15 text-transparent"
                  }`}
                >
                  <Check size={15} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
