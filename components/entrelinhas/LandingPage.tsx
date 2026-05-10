import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Faça seu Raio-X Executivo",
    description: "Leia como sua presença aparece quando há pressão, disputa de espaço ou decisão importante.",
    icon: ScanLine
  },
  {
    title: "Traga uma situação real",
    description: "Reunião, limite, reconhecimento, discordância ou uma fala que precisa ser melhor conduzida.",
    icon: MessageSquareText
  },
  {
    title: "Ganhe repertório aplicado",
    description: "Receba orientação, postura e frases para se posicionar com maturidade corporativa.",
    icon: Sparkles
  }
];

const situations = ["Discordar com elegância", "Dizer não com clareza", "Pedir reconhecimento", "Retomar espaço em reunião"];

const previewSections = [
  "Leitura estratégica",
  "Ponto de atenção",
  "Fala recomendada",
  "Versão direta"
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-entrelinhas-void text-entrelinhas-ivory">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_82%_8%,rgba(59,23,32,0.26),transparent_24rem),radial-gradient(circle_at_12%_4%,rgba(184,135,79,0.14),transparent_22rem),linear-gradient(135deg,#050609_0%,#0b0f18_52%,#07080d_100%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
              <Sparkles size={20} />
            </span>
            <span className="text-base font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition hover:text-white" href="/proposito">
              Proposito
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition hover:text-white" href="/login">
              Entrar na mentoria
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-9 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="max-w-3xl">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Presença executiva se constrói nas entrelinhas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted sm:text-xl">
              Uma plataforma de mentoria executiva feminina para transformar situações corporativas em clareza, posicionamento e repertório profissional.
            </p>
            <div className="mt-8">
              <Link className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
                Fazer meu Raio-X Executivo <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <ProductPreview />
        </div>

        <section className="grid gap-4 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="glass-panel p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Como funciona</p>
            <div className="mt-5 grid gap-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-entrelinhas-bronze/25 bg-entrelinhas-bronze/10 text-entrelinhas-bronzeLight">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h2 className="font-semibold text-white">{step.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-entrelinhas-muted">{step.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Vivências corporativas</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Repertório para ocupar espaço sem se expor além do necessário.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {situations.map((situation) => (
                <div key={situation} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <CheckCircle2 className="shrink-0 text-entrelinhas-gold" size={19} />
                  <span className="text-sm font-semibold leading-6 text-white/88">{situation}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 p-4">
              <ShieldCheck className="text-entrelinhas-gold" size={22} />
              <p className="mt-3 text-sm leading-6 text-entrelinhas-goldLight">
                O Entrelinhas parte de vivências reais, inteligência relacional e maturidade corporativa para orientar falas com presença.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-10 pt-2 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">Comece pela leitura da sua presença. Depois pratique seu posicionamento.</h2>
            <p className="mt-3 text-entrelinhas-muted">Em poucos minutos, você entende onde sua comunicação ganha força e onde precisa de mais precisão.</p>
            <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
              Fazer meu Raio-X Executivo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="glass-panel p-4 sm:p-5">
      <div className="rounded-2xl border border-white/10 bg-[#0c111d]/90 p-4 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">prévia da mentoria</p>
            <p className="mt-1 text-lg font-semibold text-white">Retomar espaço em reunião</p>
          </div>
          <span className="w-fit rounded-lg border border-entrelinhas-wineLight/35 bg-entrelinhas-wine/35 px-3 py-1 text-xs font-semibold text-entrelinhas-champagne">
            Executivo
          </span>
        </div>
        <div className="grid gap-3 pt-5 sm:grid-cols-2">
          {previewSections.map((item, index) => (
            <div key={item} className="rounded-xl border border-entrelinhas-champagne/10 bg-white/[0.035] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-entrelinhas-muted">{item}</p>
              <p className="mt-2 text-sm leading-6 text-white/88">
                {index === 0
                  ? "A conversa pede presença calma para recuperar espaço sem transformar a fala em disputa."
                  : index === 1
                    ? "Evite justificar demais antes de concluir seu raciocínio."
                    : index === 2
                      ? "Vou concluir meu ponto e já conecto com a sua contribuição."
                      : "Preciso de trinta segundos para fechar a ideia com clareza."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
