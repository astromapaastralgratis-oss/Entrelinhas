import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Target } from "lucide-react";
import type { ExecutivePresenceResult } from "@/src/types/executivePresence";

type RaioXResultSummaryProps = {
  result: ExecutivePresenceResult;
  onRestart: () => void;
  onViewReading: () => void;
  onViewPlan: () => void;
};

const confidenceCopy = {
  high: "Seu resultado mostra um padrao bem definido.",
  medium: "Seu resultado mostra um perfil consistente, com nuances importantes.",
  low: "Seu resultado mostra um perfil equilibrado entre dois estilos."
};

export function RaioXResultSummary({ result, onRestart, onViewReading, onViewPlan }: RaioXResultSummaryProps) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="glass-panel overflow-hidden">
        <div className="border-b border-entrelinhas-champagne/10 bg-white/[0.028] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Sintese executiva</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-white sm:text-4xl">{result.profile.name}</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
          <article>
            <p className="text-base leading-7 text-white/90 sm:text-lg">{result.profile.shortDescription}</p>
            <p className="mt-4 line-clamp-4 leading-7 text-entrelinhas-muted">{result.profile.perceivedByOthers}</p>
            <p className="mt-5 rounded-2xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 p-4 text-sm font-semibold leading-6 text-entrelinhas-goldLight shadow-bronze">
              {confidenceCopy[result.confidenceLevel]}
            </p>
            <div className="mt-5 grid gap-3">
              <SummaryList icon={CheckCircle2} title="Fortalezas" items={result.profile.strengths.slice(0, 3)} tone="gold" />
              <SummaryList icon={AlertTriangle} title="Pontos de atencao" items={result.profile.risks.slice(0, 3)} tone="purple" />
            </div>
          </article>

          <aside className="rounded-2xl border border-entrelinhas-champagne/10 bg-white/[0.035] p-5">
            <div className="rounded-2xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 p-4">
              <Target className="text-entrelinhas-gold" size={22} />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-goldLight">Proximo movimento</p>
              <p className="mt-2 leading-7 text-white/90">{result.profile.corporateExpectation}</p>
            </div>

            <button
              onClick={onViewReading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight"
            >
              Ver leitura <ArrowRight size={17} />
            </button>
            <button
              onClick={onViewPlan}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-entrelinhas-bronze/30 px-5 py-4 text-sm font-bold text-white transition hover:border-entrelinhas-bronzeLight/55 hover:bg-entrelinhas-bronze/10"
            >
              Ver plano <ArrowRight size={17} />
            </button>
            <button
              onClick={onRestart}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-entrelinhas-muted transition hover:border-entrelinhas-gold/45 hover:bg-white/[0.06] hover:text-white"
            >
              <RotateCcw size={17} /> Refazer Raio-X
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryList({
  icon: Icon,
  title,
  items,
  tone
}: {
  icon: typeof Sparkles;
  title: string;
  items: string[];
  tone: "gold" | "purple";
}) {
  const iconClass =
    tone === "gold"
      ? "border-entrelinhas-gold/25 bg-entrelinhas-gold/10 text-entrelinhas-gold"
      : "border-entrelinhas-wineLight/30 bg-entrelinhas-wine/25 text-entrelinhas-bronzeLight";

  return (
    <div className="rounded-2xl border border-entrelinhas-champagne/10 bg-white/[0.032] p-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconClass}`}>
          <Icon size={17} />
        </span>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">{title}</p>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-entrelinhas-champagne/10 bg-[#0a0d14]/78 px-4 py-3 text-sm leading-6 text-white/86">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
