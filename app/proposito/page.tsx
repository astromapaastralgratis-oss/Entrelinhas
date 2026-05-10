import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandAvatar, BrandLockup } from "@/components/entrelinhas/BrandAssets";

const principles = [
  "Estrategia tambem e saber como ocupar espaco.",
  "Influencia e construida antes da decisao.",
  "Presenca executiva muda a forma como voce e percebida."
];

const commitments = [
  "Direcionamento estrategico para situacoes corporativas reais.",
  "Repertorio executivo para decisoes, limites e reconhecimento.",
  "Conducao profissional com maturidade, criterio e visao de negocio.",
  "Evolucao continua para ampliar influencia ao longo da carreira."
];

export default function PropositoPage() {
  return (
    <main className="brand-surface min-h-screen overflow-hidden text-entrelinhas-ivory">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="rounded-2xl border border-entrelinhas-gold/12 bg-[#08182A]/42 p-2.5 transition duration-300 hover:border-entrelinhas-gold/28">
            <BrandLockup priority avatarClassName="h-10 w-10" size={72} textClassName="text-base" />
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:text-white" href="/login">
            Entrar
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="brand-fade-in">
            <BrandAvatar className="mb-6 h-20 w-20" size={128} priority />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-entrelinhas-gold">PRESENCA • ESTRATEGIA • EVOLUCAO</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl">
              Uma plataforma para mulheres que querem crescer com inteligencia executiva.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-entrelinhas-muted">
              O Entrelinhas transforma vivencias corporativas reais em direcao, repertorio e maturidade profissional.
            </p>
            <Link className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto" href="/signup">
              Fazer meu Raio-X Executivo <ArrowRight size={18} />
            </Link>
          </div>

          <div className="glass-panel p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Como pensamos</p>
            <div className="mt-5 space-y-3">
              {principles.map((principle) => (
                <article key={principle} className="rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">O que sustenta a mentoria</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Ambicao elegante, pensamento estrategico e crescimento sustentavel.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {commitments.map((commitment) => (
                  <div key={commitment} className="flex gap-3 rounded-2xl border border-entrelinhas-gold/12 bg-[#071525]/60 p-4">
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
