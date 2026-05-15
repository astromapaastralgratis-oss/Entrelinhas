import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Target } from "lucide-react";
import { BrandAvatar } from "@/components/entrelinhas/BrandAssets";
import { RaioXFeedback } from "@/src/components/raio-x/RaioXFeedback";
import { executiveDynamicLabels, executivePresenceSubdimensionLabels } from "@/src/data/executivePresenceMethodology";
import type { ExecutivePresenceResult } from "@/src/types/executivePresence";

type RaioXResultSummaryProps = {
  result: ExecutivePresenceResult;
  onRestart: () => void;
  onViewReading: () => void;
  onViewPlan: () => void;
};

const impactCopyByProfileId: Record<ExecutivePresenceResult["profileId"], string> = {
  assertive_executor: "Sua forca aparece quando ha decisao em jogo. O proximo nivel e fazer sua firmeza criar adesao, nao apenas movimento.",
  strategic_influencer: "Sua presenca mobiliza. O proximo nivel e transformar influencia em decisao antes que a narrativa se alongue.",
  relational_diplomat: "Voce sustenta relacoes com maturidade. O proximo nivel e deixar sua posicao aparecer sem pedir licenca ao desconforto.",
  analytical_advisor: "Sua clareza nasce do criterio. O proximo nivel e transformar analise em posicionamento visivel.",
  leader_mobilizer: "Voce cria movimento. O proximo nivel e garantir que a energia ao redor vire alinhamento real.",
  decision_strategist: "Voce sustenta decisoes dificeis. O proximo nivel e combinar rigor com leitura politica antes de fechar a rota.",
  diplomatic_articulator: "Voce sabe ler interesses. O proximo nivel e articular sem desaparecer da decisao.",
  careful_counselor: "Sua maturidade esta no cuidado. O proximo nivel e fazer esse cuidado aparecer como autoridade.",
  firmness_builder: "Voce ja sabe onde precisa se posicionar. O proximo nivel e sustentar limites sem transformar clareza em justificativa.",
  analytical_influencer: "Sua inteligencia convence quando encontra sintese. O proximo nivel e fazer a mensagem chegar antes do excesso de explicacao."
};

const confidenceCopy = {
  high: "Seu resultado mostra um padrão bem definido.",
  medium: "Seu resultado mostra um perfil consistente, com nuances importantes.",
  low: "Seu resultado mostra um perfil equilibrado entre dois estilos."
};

export function RaioXResultSummary({ result, onRestart, onViewReading, onViewPlan }: RaioXResultSummaryProps) {
  const strongestSubdimensions = getTopEntries(result.subdimensionScores, executivePresenceSubdimensionLabels, 3);
  const strongestDynamics = getTopEntries(result.executiveDynamicScores, executiveDynamicLabels, 3);
  const evolution = result.evolution;
  const recognitionPhrases = result.recognitionPhrases ?? [];
  const impactCopy = impactCopyByProfileId[result.profileId];

  return (
    <section className="brand-fade-in mx-auto max-w-5xl">
      <div className="editorial-panel overflow-hidden">
        <div className="border-b border-entrelinhas-gold/12 bg-entrelinhas-navy/35 p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <BrandAvatar className="h-14 w-14" size={72} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Seu direcionamento estratégico</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-white sm:text-4xl">{result.profile.name}</h1>
            </div>
          </div>
        </div>

        <div className="border-b border-entrelinhas-gold/12 p-5 sm:p-7">
          <div className="rounded-[1.35rem] border border-entrelinhas-gold/14 bg-entrelinhas-void/35 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Leitura central</p>
            <p className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {impactCopy}
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
          <article>
            <p className="text-base leading-7 text-white/90 sm:text-lg">{result.profile.shortDescription}</p>
            <p className="mt-4 line-clamp-4 leading-7 text-entrelinhas-muted">{result.profile.perceivedByOthers}</p>
            {result.contextSnapshot?.mainChallenge ? (
              <p className="mt-4 rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/45 px-4 py-3 text-sm leading-6 text-entrelinhas-goldLight">
                Contexto calibrado: {result.contextSnapshot.mainChallenge}
              </p>
            ) : null}
            <p className="mt-5 rounded-2xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] p-4 text-sm font-semibold leading-6 text-entrelinhas-goldLight">
              {confidenceCopy[result.confidenceLevel]}
            </p>
            {evolution ? (
              <div className="mt-5 rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-navy/45 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">Seu movimento recente</p>
                <p className="mt-3 text-sm leading-6 text-white/86">{evolution.narrative}</p>
                <div className="mt-3 grid gap-2">
                  {evolution.signals.slice(0, 2).map((signal) => (
                    <p key={signal.id} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-void/40 px-3 py-2 text-xs leading-5 text-entrelinhas-muted">
                      {signal.title}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            {recognitionPhrases.length ? (
              <div className="mt-5 rounded-2xl border border-entrelinhas-gold/14 bg-entrelinhas-void/45 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">Para guardar</p>
                <div className="mt-3 grid gap-3">
                  {recognitionPhrases.slice(0, 3).map((phrase) => (
                    <p key={phrase.id} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 px-4 py-3 text-sm font-semibold leading-6 text-white/90">
                      {phrase.text}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3">
              <SummaryList icon={CheckCircle2} title="Fortalezas" items={result.profile.strengths.slice(0, 3)} tone="gold" />
              <SummaryList icon={AlertTriangle} title="Pontos de atencao" items={result.profile.risks.slice(0, 3)} tone="blue" />
              {strongestSubdimensions.length ? <SummaryList icon={Target} title="Subdimensoes dominantes" items={strongestSubdimensions} tone="gold" /> : null}
              {strongestDynamics.length ? <SummaryList icon={Sparkles} title="Dinamicas executivas" items={strongestDynamics} tone="blue" /> : null}
            </div>
          </article>

          <aside className="rounded-[1.5rem] border border-entrelinhas-gold/12 bg-entrelinhas-panel/58 p-5">
            <div className="rounded-2xl border border-entrelinhas-gold/22 bg-entrelinhas-blue/24 p-4">
              <Target className="text-entrelinhas-gold" size={22} />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-goldLight">Proximo movimento</p>
              <p className="mt-2 leading-7 text-white/90">{result.profile.corporateExpectation}</p>
            </div>

            <button
              onClick={onViewReading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight"
            >
              Ver direção <ArrowRight size={17} />
            </button>
            <button
              onClick={onViewPlan}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/25 bg-entrelinhas-navy/35 px-5 py-4 text-sm font-bold text-white transition duration-300 hover:border-entrelinhas-gold/45 hover:bg-entrelinhas-blue/28"
            >
              Ver plano <ArrowRight size={17} />
            </button>
            <button
              onClick={onRestart}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-entrelinhas-muted transition duration-300 hover:border-entrelinhas-gold/35 hover:bg-entrelinhas-navy/45 hover:text-white"
            >
              <RotateCcw size={17} /> Refazer Raio-X
            </button>
          </aside>
        </div>

        {result.conditionalInsights?.length ? (
          <div className="border-t border-entrelinhas-gold/12 p-5 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">Sinais especificos do seu padrão</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {result.conditionalInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="rounded-2xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/42 p-4">
                  <h3 className="font-semibold text-white">{insight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <RaioXFeedback
          resultId={result.resultId}
          profileId={result.profileId}
          methodologyVersion={result.methodologyVersion}
        />
      </div>
    </section>
  );
}

function getTopEntries<T extends string>(
  scores: Record<T, number> | undefined,
  labels: Record<T, string>,
  limit: number
) {
  if (!scores) return [];
  return (Object.entries(scores) as Array<[T, number]>)
    .filter(([, score]) => score > 0)
    .sort((first, second) => second[1] - first[1])
    .slice(0, limit)
    .map(([key, score]) => `${labels[key]} (${score})`);
}

function SummaryList({
  icon: Icon,
  title,
  items,
  tone
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
  tone: "gold" | "blue";
}) {
  const iconClass =
    tone === "gold"
      ? "border-entrelinhas-gold/25 bg-entrelinhas-gold/10 text-entrelinhas-gold"
      : "border-entrelinhas-blueLight/25 bg-entrelinhas-blue/20 text-entrelinhas-blueLight";

  return (
    <div className="rounded-2xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/42 p-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconClass}`}>
          <Icon size={17} />
        </span>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">{title}</p>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-void/45 px-4 py-3 text-sm leading-6 text-white/86">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
