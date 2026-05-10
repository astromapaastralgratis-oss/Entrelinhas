import { ArrowRight, ShieldCheck, Sparkles, Target } from "lucide-react";

type RaioXIntroProps = {
  onStart: () => void;
};

export function RaioXIntro({ onStart }: RaioXIntroProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Raio-X de Presença Executiva</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Competência técnica abre portas. Presença executiva sustenta espaço.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-entrelinhas-muted sm:text-lg">
            Uma leitura estratégica sobre como você se posiciona quando precisa ser ouvida, respeitada e levada a sério.
          </p>
          <button
            onClick={onStart}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-6 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-entrelinhas-goldLight sm:w-auto"
          >
            Iniciar Raio-X <ArrowRight size={18} />
          </button>
        </div>

        <aside className="glass-panel p-5">
          <div className="rounded-2xl border border-white/10 bg-[#0c111d]/80 p-5">
            <Sparkles className="text-entrelinhas-gold" size={28} />
            <h2 className="mt-5 text-2xl font-semibold text-white">Presença não é volume. É leitura, timing e clareza.</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: Target, title: "Leitura de espaço", text: "O corporativo nem sempre reconhece quem entrega mais. Muitas vezes reconhece quem se posiciona melhor." },
                { icon: ShieldCheck, title: "Firmeza elegante", text: "Firmeza não é dureza. É clareza sem excesso de justificativa." },
                { icon: Sparkles, title: "Repertório aplicado", text: "Você sai com forças, riscos e próximos movimentos para sustentar presença em conversas reais." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4">
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
