import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { BrandAvatar, BrandLogo } from "@/components/entrelinhas/BrandAssets";

const steps = [
  {
    title: "Faca seu Raio-X Executivo",
    description: "Leia como sua presenca aparece quando existe pressao, disputa de espaco ou decisao importante.",
    icon: ScanLine
  },
  {
    title: "Traga uma situacao real",
    description: "Reuniao, limite, reconhecimento, discordancia ou uma fala que precisa ser conduzida.",
    icon: MessageSquareText
  },
  {
    title: "Ganhe repertorio aplicado",
    description: "Receba postura e frases para se posicionar com maturidade corporativa.",
    icon: Sparkles
  }
];

const situations = ["Discordar com elegancia", "Dizer nao com clareza", "Pedir reconhecimento", "Retomar espaco em reuniao"];

const previewSections = ["Leitura estrategica", "Ponto de atencao", "Fala recomendada", "Versao direta"];

export function LandingPage() {
  return (
    <main className="brand-surface min-h-screen overflow-hidden text-entrelinhas-ivory">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="block w-44 sm:w-56">
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

        <div className="grid flex-1 items-center gap-9 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="brand-fade-in max-w-3xl">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Presenca executiva se constroi nas entrelinhas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted sm:text-xl">
              Uma plataforma de mentoria executiva feminina para transformar situacoes corporativas em clareza, posicionamento e repertorio profissional.
            </p>
            <div className="mt-8">
              <Link className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
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
                  <article key={step.title} className="flex gap-4 rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-entrelinhas-gold/20 bg-[#0B2742] text-entrelinhas-gold">
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Vivencias corporativas</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Repertorio para ocupar espaco sem se expor alem do necessario.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {situations.map((situation) => (
                <div key={situation} className="flex items-center gap-3 rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
                  <CheckCircle2 className="shrink-0 text-entrelinhas-gold" size={19} />
                  <span className="text-sm font-semibold leading-6 text-white/88">{situation}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-entrelinhas-gold/20 bg-[#0B2742]/70 p-4">
              <ShieldCheck className="text-entrelinhas-gold" size={22} />
              <p className="mt-3 text-sm leading-6 text-entrelinhas-goldLight">
                O Entrelinhas parte de vivencias reais, inteligencia relacional e maturidade corporativa para orientar falas com presenca.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-10 pt-2 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">Comece pela leitura da sua presenca. Depois pratique seu posicionamento.</h2>
            <p className="mt-3 text-entrelinhas-muted">Em poucos minutos, voce entende onde sua comunicacao ganha forca e onde precisa de mais precisao.</p>
            <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
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
    <div className="glass-panel brand-fade-in p-4 sm:p-5">
      <div className="rounded-2xl border border-entrelinhas-gold/14 bg-[#071525]/92 p-4 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-entrelinhas-gold/12 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandAvatar className="h-12 w-12" size={96} />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">previa da mentoria</p>
              <p className="mt-1 text-lg font-semibold text-white">Retomar espaco em reuniao</p>
            </div>
          </div>
          <span className="w-fit rounded-lg border border-entrelinhas-gold/25 bg-[#0B2742] px-3 py-1 text-xs font-semibold text-entrelinhas-champagne">
            Executivo
          </span>
        </div>
        <div className="grid gap-3 pt-5 sm:grid-cols-2">
          {previewSections.map((item, index) => (
            <div key={item} className="rounded-xl border border-entrelinhas-gold/12 bg-[#08182A]/78 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-entrelinhas-muted">{item}</p>
              <p className="mt-2 text-sm leading-6 text-white/88">
                {index === 0
                  ? "A conversa pede presenca calma para recuperar espaco sem transformar a fala em disputa."
                  : index === 1
                    ? "Evite justificar demais antes de concluir seu raciocinio."
                    : index === 2
                      ? "Vou concluir meu ponto e ja conecto com a sua contribuicao."
                      : "Preciso de trinta segundos para fechar a ideia com clareza."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
