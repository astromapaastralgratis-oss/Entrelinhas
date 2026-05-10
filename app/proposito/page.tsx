import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const principles = [
  "Presenca executiva nao nasce de frases prontas. Ela se constroi no modo como voce sustenta clareza quando existe pressao.",
  "O Entrelinhas existe para transformar vivencias corporativas reais em repertorio pratico, sem exposicao desnecessaria.",
  "Nossa mentoria combina maturidade corporativa, inteligencia relacional e linguagem aplicada para conversas que pedem posicao."
];

const commitments = [
  "Ajudar mulheres a nomear o que acontece no trabalho com mais precisao.",
  "Preparar falas firmes, humanas e elegantes para situacoes dificeis.",
  "Fortalecer presenca sem transformar posicionamento em confronto.",
  "Criar repertorio para reunioes, limites, reconhecimento, discordancias e negociacoes."
];

export default function PropositoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-entrelinhas-void text-entrelinhas-ivory">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_82%_8%,rgba(59,23,32,0.26),transparent_24rem),radial-gradient(circle_at_12%_4%,rgba(184,135,79,0.14),transparent_22rem),linear-gradient(135deg,#050609_0%,#0b0f18_52%,#07080d_100%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
              <Sparkles size={20} />
            </span>
            <span className="text-base font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition hover:text-white" href="/login">
            Entrar
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-entrelinhas-gold">Nosso proposito</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl">
              Ajudar mulheres a ocupar espaco com clareza, repertorio e presenca.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted">
              O Entrelinhas nasceu para apoiar conversas corporativas que raramente sao simples: discordar, pedir reconhecimento, definir limites, recuperar espaco e sustentar uma posicao sem perder elegancia.
            </p>
            <Link className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
              Comecar pelo Raio-X Executivo <ArrowRight size={18} />
            </Link>
          </div>

          <div className="glass-panel p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Como pensamos</p>
            <div className="mt-5 space-y-3">
              {principles.map((principle) => (
                <article key={principle} className="rounded-2xl border border-entrelinhas-champagne/10 bg-white/[0.04] p-4">
                  <p className="leading-7 text-white/88">{principle}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section className="pb-12">
          <div className="glass-panel p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">O que entregamos</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Menos improviso. Mais presenca aplicada.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {commitments.map((commitment) => (
                  <div key={commitment} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <CheckCircle2 className="mt-1 shrink-0 text-entrelinhas-gold" size={19} />
                    <span className="text-sm font-semibold leading-6 text-white/88">{commitment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
