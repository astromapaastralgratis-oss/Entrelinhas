import { AlertTriangle, CheckCircle2, MessageSquareQuote, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { executiveDynamicLabels, executivePresenceSubdimensionLabels } from "@/src/data/executivePresenceMethodology";
import type { ExecutivePresenceResult } from "@/src/types/executivePresence";

type RaioXFullReadingProps = {
  result: ExecutivePresenceResult;
};

export function RaioXFullReading({ result }: RaioXFullReadingProps) {
  const { profile } = result;
  const mainContradiction = result.executiveContradictions?.[0];
  const subdimensionItems = getTopEntries(result.subdimensionScores, executivePresenceSubdimensionLabels, 5);
  const dynamicItems = getTopEntries(result.executiveDynamicScores, executiveDynamicLabels, 5);
  const behaviorItems = result.behaviorSignals?.slice(0, 6).map((signal) => signal.interpretation) ?? [];
  const insightItems = result.conditionalInsights?.map((insight) => `${insight.title}: ${insight.description}`) ?? [];
  const riskItems = mainContradiction ? [mainContradiction.risk, ...profile.risks] : profile.risks;

  return (
    <section className="brand-fade-in mx-auto max-w-5xl">
      <div className="editorial-panel overflow-hidden">
        <Header title="Direção executiva" subtitle={profile.name} />

        <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-2">
          <ReadingCard icon={Sparkles} title="Sua Direção Executiva" className="lg:col-span-2">
            <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">{profile.shortDescription}</p>
            <p className="mt-4 max-w-3xl leading-7 text-entrelinhas-muted">{profile.executiveReading}</p>
          </ReadingCard>

          <ReadingCard icon={ShieldCheck} title="Como Você E Percebida" className="lg:col-span-2">
            <p className="max-w-3xl leading-7 text-entrelinhas-muted">{profile.perceivedByOthers}</p>
          </ReadingCard>

          {mainContradiction ? (
            <ReadingCard icon={Target} title="Tensao Executiva Principal" className="lg:col-span-2">
              <p className="max-w-3xl text-base font-semibold leading-7 text-white/90">{mainContradiction.title}</p>
              <p className="mt-3 max-w-3xl leading-7 text-entrelinhas-muted">{mainContradiction.summary}</p>
            </ReadingCard>
          ) : null}

          <ListCard icon={CheckCircle2} title="Suas Fortalezas" items={profile.strengths} tone="gold" />
          <ListCard icon={AlertTriangle} title="O Que Reduz Sua Influência" items={riskItems} tone="blue" />
          {subdimensionItems.length ? <ListCard icon={Target} title="Subdimensoes Mais Presentes" items={subdimensionItems} tone="gold" /> : null}
          {dynamicItems.length ? <ListCard icon={Sparkles} title="Dinamicas Executivas Dominantes" items={dynamicItems} tone="blue" /> : null}
          {insightItems.length ? <ListCard icon={TrendingUp} title="Leitura Condicional Do Seu Padrao" items={insightItems} tone="gold" className="lg:col-span-2" /> : null}
          {behaviorItems.length ? <ListCard icon={ShieldCheck} title="Sinais Comportamentais Observados" items={behaviorItems} tone="muted" className="lg:col-span-2" /> : null}

          <ReadingCard icon={MessageSquareQuote} title="Seu Padrão Sob Pressão">
            <p className="leading-7 text-entrelinhas-muted">{profile.pressurePattern}</p>
          </ReadingCard>

          <ReadingCard icon={Target} title="Onde Você Pode Estar Se Sabotando">
            <p className="leading-7 text-entrelinhas-muted">{profile.executiveSabotage}</p>
          </ReadingCard>

          <ReadingCard icon={MessageSquareQuote} title="Como Você Se Comunica">
            <p className="leading-7 text-entrelinhas-muted">{profile.communicationPattern}</p>
          </ReadingCard>

          <ReadingCard icon={Target} title="O Que O Corporativo Espera Da Sua Proxima Versao">
            <p className="leading-7 text-entrelinhas-muted">{profile.corporateExpectation}</p>
          </ReadingCard>

          <ScriptShiftCard items={profile.internalScriptsToChange} />
          <ListCard icon={TrendingUp} title="Frases Para Sustentar Presença" items={profile.startUsingPhrases} tone="gold" className="lg:col-span-2" />
        </div>
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

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-entrelinhas-gold/12 bg-entrelinhas-navy/35 p-5 sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">{title}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">{subtitle}</h1>
    </div>
  );
}

function ReadingCard({
  icon: Icon,
  title,
  children,
  className = ""
}: {
  icon: typeof Sparkles;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-[1.5rem] border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/10 text-entrelinhas-gold">
          <Icon size={19} />
        </span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function ListCard({
  icon: Icon,
  title,
  items,
  tone,
  className = ""
}: {
  icon: typeof Sparkles;
  title: string;
  items: string[];
  tone: "gold" | "blue" | "muted";
  className?: string;
}) {
  const iconClass = {
    gold: "border-entrelinhas-gold/25 bg-entrelinhas-gold/10 text-entrelinhas-gold",
    blue: "border-entrelinhas-blueLight/25 bg-entrelinhas-blue/20 text-entrelinhas-blueLight",
    muted: "border-white/10 bg-white/[0.055] text-entrelinhas-muted"
  }[tone];

  return (
    <article className={`rounded-[1.5rem] border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}>
          <Icon size={19} />
        </span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-void/45 px-4 py-3 text-sm leading-6 text-white/86">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function ScriptShiftCard({ items }: { items: { from: string; to: string }[] }) {
  return (
    <article className="rounded-[1.5rem] border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 p-5 lg:col-span-2">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-blue/18 text-entrelinhas-muted">
          <MessageSquareQuote size={19} />
        </span>
        <h2 className="text-lg font-semibold text-white">Padroes Internos Que Precisam Evoluir</h2>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <div key={`${item.from}-${item.to}`} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-void/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-entrelinhas-muted">De</p>
            <p className="mt-2 text-sm leading-6 text-white/72">{item.from}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-entrelinhas-gold">Para</p>
            <p className="mt-2 text-sm leading-6 text-white/90">{item.to}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
