import { ArrowRight, ShieldCheck, Sparkles, Target } from "lucide-react";
import { BrandAvatar } from "@/components/entrelinhas/BrandAssets";

type RaioXIntroProps = {
  onStart: () => void;
};

export function RaioXIntro({ onStart }: RaioXIntroProps) {
  return (
    <section className="brand-fade-in mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Raio-X Executivo</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Competencia tecnica abre portas. Presenca executiva sustenta espaco.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-entrelinhas-muted sm:text-lg">
            Uma analise estrategica sobre como voce ocupa conversas, sustenta posicoes e amplia influencia com maturidade.
          </p>
          <button
            onClick={onStart}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition duration-300 hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto"
          >
            Iniciar Raio-X <ArrowRight size={18} />
          </button>
        </div>

        <aside className="editorial-panel p-5">
          <div className="rounded-[1.75rem] border border-entrelinhas-gold/18 bg-entrelinhas-panel/70 p-5">
            <BrandAvatar className="h-20 w-20" size={96} />
            <h2 className="mt-5 text-2xl font-semibold text-white">Presenca nao e volume. E timing, criterio e clareza.</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: Target, title: "Estrategia de espaco", text: "O corporativo nem sempre reconhece quem entrega mais. Muitas vezes reconhece quem se posiciona melhor." },
                { icon: ShieldCheck, title: "Firmeza elegante", text: "Firmeza nao e dureza. E clareza sem excesso de justificativa." },
                { icon: Sparkles, title: "Repertorio aplicado", text: "Voce sai com fortalezas, riscos e proximos movimentos para sustentar presenca em contextos reais." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/52 p-4 transition duration-300 hover:border-entrelinhas-gold/25 hover:bg-entrelinhas-night/55">
                    <Icon className="mt-0.5 shrink-0 text-entrelinhas-bronzeLight" size={20} />
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-entrelinhas-muted">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
