import Link from "next/link";
import { ArrowRight, BookOpen, Dumbbell, Lightbulb, MessageSquareText, Sparkles, Target } from "lucide-react";
import type { ExecutivePresenceResult } from "@/src/types/executivePresence";

type RaioXDevelopmentPlanProps = {
  result: ExecutivePresenceResult;
};

export function RaioXDevelopmentPlan({ result }: RaioXDevelopmentPlanProps) {
  const { profile } = result;
  const firstSuggestion = profile.firstScriptSuggestions[0];
  const mentorHref = firstSuggestion ? `/mentor?situation=${encodeURIComponent(firstSuggestion)}` : "/mentor";
  const calibratedPlan = buildCalibratedPlan(result);

  return (
    <section className="brand-fade-in mx-auto max-w-5xl">
      <div className="editorial-panel overflow-hidden">
        <div className="border-b border-entrelinhas-gold/12 bg-entrelinhas-navy/35 p-5 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Plano</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Transforme seu direcionamento em presenca praticada.
          </h1>
        </div>

        <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[1.5rem] border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] p-5">
            <Sparkles className="text-entrelinhas-gold" size={24} />
            <h2 className="mt-4 text-xl font-semibold text-white">Proximo movimento</h2>
            <p className="mt-3 leading-7 text-entrelinhas-goldLight">{profile.evolutionPoint}</p>
            {result.contextualModifiers?.goalLens ? (
              <p className="mt-4 rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/35 p-4 text-sm leading-6 text-white/82">
                {result.contextualModifiers.goalLens}
              </p>
            ) : null}
          </article>

          <PlanList icon={Target} title="Microajustes De Presenca" items={profile.presenceMicroAdjustments} featured />
          <PlanList icon={Sparkles} title="Plano De Evolucao Executiva - 30 dias" items={calibratedPlan} featured className="lg:col-span-2" />
          {result.conditionalInsights?.length ? (
            <PlanList icon={Target} title="Ajustes Pela Sua Dinamica Dominante" items={result.conditionalInsights.map((insight) => insight.recommendation)} featured className="lg:col-span-2" />
          ) : null}
          <PlanList icon={Lightbulb} title="Praticas De Repertorio" items={profile.recommendedPractices} />
          <PlanList icon={BookOpen} title="Referencias" items={profile.recommendedReadings} />
          <PlanList icon={Dumbbell} title="Treinos" items={profile.recommendedTrainings} />
          <PlanList icon={MessageSquareText} title="Situacoes Para Treinar" items={profile.firstScriptSuggestions} />

          <article className="rounded-[1.5rem] border border-entrelinhas-gold/12 bg-entrelinhas-panel/55 p-5 lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Primeira pratica</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Prepare uma conversa alinhada ao seu novo posicionamento.</h2>
              </div>
              <Link
                href={mentorHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight"
              >
                Receber direcionamento personalizado <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function buildCalibratedPlan(result: ExecutivePresenceResult) {
  const context = result.contextSnapshot;
  const basePlan = [...result.profile.thirtyDayEvolutionPlan];
  if (context?.seniority) {
    basePlan[0] = `${basePlan[0]} Calibre a pratica para sua senioridade atual: ${context.seniority}.`;
  }
  if (context?.mainChallenge) {
    basePlan[1] = `${basePlan[1]} Use como laboratorio o desafio: ${context.mainChallenge}.`;
  }
  if (context?.careerGoal) {
    basePlan[3] = `${basePlan[3]} Conecte a revisao ao objetivo: ${context.careerGoal}.`;
  }
  return basePlan;
}

function PlanList({
  icon: Icon,
  title,
  items,
  featured = false,
  className = ""
}: {
  icon: typeof Sparkles;
  title: string;
  items: string[];
  featured?: boolean;
  className?: string;
}) {
  const articleClass = featured
    ? "border-entrelinhas-gold/18 bg-entrelinhas-blue/22"
    : "border-entrelinhas-gold/10 bg-entrelinhas-navy/45";

  const iconClass = featured
    ? "border-entrelinhas-gold/25 bg-entrelinhas-gold/10 text-entrelinhas-gold"
    : "border-entrelinhas-blueLight/22 bg-entrelinhas-blue/20 text-entrelinhas-blueLight";

  return (
    <article className={`rounded-[1.5rem] border ${articleClass} p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}>
          <Icon size={19} />
        </span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-void/45 px-4 py-3 text-sm leading-6 text-white/86">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
