import Link from "next/link";
import { ArrowRight, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
  {
    title: "Saiba exatamente o que dizer",
    description: "Transforme contexto, tensão e objetivo em frases prontas para usar.",
    icon: MessageSquareText
  },
  {
    title: "Posicione-se com confiança",
    description: "Tenha clareza de postura antes de entrar em reuniões importantes.",
    icon: ShieldCheck
  },
  {
    title: "Conduza conversas difíceis com presença executiva",
    description: "Responda com firmeza, elegância e inteligência emocional.",
    icon: Sparkles
  }
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-entrelinhas-void text-entrelinhas-ivory">
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_16%,rgba(139,92,246,0.26),transparent_24rem),radial-gradient(circle_at_16%_10%,rgba(224,194,126,0.18),transparent_22rem),linear-gradient(135deg,#070a12_0%,#0d1322_48%,#090910_100%)]" />
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
              <Sparkles size={20} />
            </span>
            <span className="text-base font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-entrelinhas-muted transition hover:text-white sm:inline-flex" href="/login">
              Entrar
            </Link>
            <Link className="rounded-lg bg-entrelinhas-gold px-4 py-2 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight" href="/signup">
              Começar grátis
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.86fr]">
          <div className="max-w-3xl">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Sua mentora executiva com IA para conversas corporativas difíceis.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted sm:text-xl">
              Transforme pressão, insegurança e tensão em posicionamento executivo claro.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight" href="/signup">
                Começar grátis <ArrowRight size={18} />
              </Link>
              <Link className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/7 px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:border-entrelinhas-gold/50 hover:bg-white/10" href="/login">
                Entrar
              </Link>
            </div>
          </div>

          <div className="glass-panel relative p-4 sm:p-5">
            <div className="rounded-2xl border border-white/10 bg-[#0c111d]/90 p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">script executivo</p>
                  <p className="mt-1 text-lg font-semibold text-white">Reunião com liderança</p>
                </div>
                <span className="rounded-lg border border-entrelinhas-purple/40 bg-entrelinhas-purple/15 px-3 py-1 text-xs font-semibold text-entrelinhas-purpleLight">
                  Executivo
                </span>
              </div>
              <div className="space-y-4 pt-5">
                {["Leitura estratégica", "O que NÃO dizer", "Script pronto para usar", "Próximo passo recomendado"].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">{item}</p>
                    <p className="mt-2 text-sm leading-6 text-white/88">
                      {index === 0
                        ? "A conversa pede clareza de expectativa, dados concretos e fechamento com decisão."
                        : "Frase objetiva, elegante e pronta para adaptar ao seu contexto."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pb-8 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title} className="glass-card">
                <Icon className="text-entrelinhas-gold" size={24} />
                <h2 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
