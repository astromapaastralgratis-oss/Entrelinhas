import { ArrowLeft, Check } from "lucide-react";
import type { ExecutivePresenceOption, ExecutivePresenceQuestion, ExecutivePresenceQuestionFormat } from "@/src/types/executivePresence";
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

const formatLabels: Record<ExecutivePresenceQuestionFormat, string> = {
  situational: "Situacao real",
  frequency: "Padrao recorrente",
  agreement: "Percepcao interna"
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
    <section className="brand-fade-in mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl items-center px-1 py-4 sm:px-3">
      <div className="w-full">
        <RaioXProgress current={currentIndex + 1} total={totalQuestions} />

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-entrelinhas-gold/14 bg-gradient-to-br from-entrelinhas-navy/92 via-entrelinhas-night/88 to-entrelinhas-ink/96 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              disabled={!canGoBack || isAdvancing}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-entrelinhas-gold/14 bg-entrelinhas-ink/35 px-4 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:border-entrelinhas-gold/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowLeft size={17} /> Voltar
            </button>

            <span className="rounded-full border border-entrelinhas-gold/18 bg-entrelinhas-gold/8 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-entrelinhas-goldLight">
              {formatLabels[question.format]}
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-entrelinhas-gold/85">Pergunta {currentIndex + 1} de {totalQuestions}</p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] text-white sm:text-5xl">{question.text}</h1>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-9 sm:gap-4">
            {options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const wasSaved = savedOptionId === option.id && !selectedOptionId;

              return (
                <button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  disabled={isAdvancing}
                  className={`group flex min-h-[5.5rem] w-full items-center justify-between gap-4 rounded-3xl border p-4 text-left transition duration-300 sm:min-h-[6rem] sm:p-5 ${
                    isSelected
                      ? "border-entrelinhas-gold/80 bg-entrelinhas-gold/13 text-white shadow-gold"
                      : wasSaved
                        ? "border-entrelinhas-bronze/50 bg-entrelinhas-blue/22 text-white"
                        : "border-white/10 bg-entrelinhas-blue/12 text-white/88 hover:-translate-y-0.5 hover:border-entrelinhas-gold/30 hover:bg-entrelinhas-blue/24"
                  }`}
                >
                  <span className="max-w-[42rem] text-base leading-7 sm:text-[1.05rem]">{option.text}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                      isSelected || wasSaved ? "border-entrelinhas-gold bg-entrelinhas-gold text-entrelinhas-ink" : "border-white/15 text-transparent group-hover:border-entrelinhas-gold/35"
                    }`}
                  >
                    <Check size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
