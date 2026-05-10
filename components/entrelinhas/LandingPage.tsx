import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Crown, Route, Sparkles } from "lucide-react";
import { BrandAvatar, BrandLogo } from "@/components/entrelinhas/BrandAssets";

const pillars = [
  {
    title: "Presenca para influenciar",
    description: "Fortaleca autoridade e sustentacao executiva.",
    icon: Crown
  },
  {
    title: "Estrategia para crescer",
    description: "Interprete contextos corporativos com inteligencia.",
    icon: Compass
  },
  {
    title: "Repertorio para liderar",
    description: "Amplie visao, maturidade e capacidade de conducao.",
    icon: Sparkles
  },
  {
    title: "Evolucao continua",
    description: "Desenvolva influencia e crescimento sustentavel.",
    icon: Route
  }
];

const steps = [
  "Faca seu Raio-X Executivo",
  "Compartilhe uma situacao corporativa",
  "Receba seu direcionamento estrategico",
  "Aplique seu plano de acao"
];

const brandLines = [
  "Estrategia tambem e saber como ocupar espaco.",
  "Influencia e construida antes da decisao.",
  "Evolucao profissional exige movimentos bem escolhidos."
];

export function LandingPage() {
  return (
    <main className="brand-surface min-h-screen overflow-hidden text-entrelinhas-ivory">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="block w-44 sm:w-60">
            <BrandLogo priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:text-white" href="/proposito">
              Proposito
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:text-white" href="/login">
              Entrar
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <div className="brand-fade-in max-w-4xl">
            <BrandAvatar className="mb-8 h-20 w-20 sm:h-24 sm:w-24" size={128} priority />
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Ascensao executiva se constroi com presenca, estrategia e evolucao.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted sm:text-xl">
              Receba direcionamentos estrategicos para lidar com situacoes corporativas reais, fortalecer sua influencia e acelerar sua evolucao profissional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight" href="/signup">
                Fazer meu Raio-X Executivo <ArrowRight size={18} />
              </Link>
              <Link className="inline-flex items-center justify-center rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-navy/45 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-entrelinhas-gold/45 hover:bg-entrelinhas-night/70" href="/proposito">
                Conhecer a mentoria
              </Link>
            </div>
          </div>

          <StrategicPreview />
        </div>

        <section className="grid gap-5 pb-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="editorial-panel p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-entrelinhas-gold">PRESENCA • ESTRATEGIA • EVOLUCAO</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Algumas carreiras crescem pela competencia. Outras pela forma como conduzem contextos.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="editorial-link rounded-2xl border border-entrelinhas-gold/12 bg-entrelinhas-panel/70 p-5 hover:border-entrelinhas-gold/30 hover:bg-entrelinhas-night/72">
                  <Icon className="text-entrelinhas-gold" size={22} />
                  <h3 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="glass-panel p-5 sm:p-6">
            <h2 className="text-3xl font-semibold leading-tight text-white">Como funciona</h2>
            <div className="mt-5 grid gap-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-entrelinhas-gold/18 bg-[#0B2742] text-sm font-bold text-entrelinhas-gold">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 sm:p-6">
            <h2 className="text-3xl font-semibold leading-tight text-white">Frases de direcao</h2>
            <div className="mt-5 space-y-3">
              {brandLines.map((line) => (
                <div key={line} className="flex gap-3 rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
                  <CheckCircle2 className="mt-1 shrink-0 text-entrelinhas-gold" size={19} />
                  <p className="text-sm font-semibold leading-6 text-white/88">{line}</p>
                </div>
              ))}
            </div>
            <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
              Fazer meu Raio-X Executivo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function StrategicPreview() {
  const rows = [
    ["Situacao", "Quando voce precisa lidar com uma decisao sensivel no ambiente corporativo."],
    ["Direcionamento", "O diferencial nao esta em reagir rapido. Esta em compreender o contexto antes de mover sua posicao."],
    ["Estrategia", "Mapeie impactos, interesses e riscos antes da tomada de decisao."],
    ["Plano de acao", "Estruture sua conducao com clareza, consistencia e visao de negocio."]
  ];

  return (
    <div className="editorial-panel brand-fade-in p-5 sm:p-6">
      <div className="flex items-center gap-4 border-b border-entrelinhas-gold/12 pb-5">
        <BrandAvatar className="h-16 w-16" size={96} />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">previa do seu direcionamento estrategico</p>
          <p className="mt-1 text-xl font-semibold text-white">Conducao executiva</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {rows.map(([label, body]) => (
          <article key={label} className="rounded-2xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/52 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">{label}</p>
            <p className="mt-2 text-sm leading-6 text-white/88 sm:text-base sm:leading-7">{body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
