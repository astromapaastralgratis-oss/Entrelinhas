import { Sparkles } from "lucide-react";

export function RaioXLoading() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center justify-center text-center">
      <div className="glass-panel w-full p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
          <Sparkles className="animate-pulse" size={28} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Lendo seu padrão</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Organizando sua leitura executiva.</h1>
        <p className="mt-4 leading-7 text-entrelinhas-muted">
          Só alguns instantes para devolver um resultado claro e útil.
        </p>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-2/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-entrelinhas-gold via-entrelinhas-bronzeLight to-entrelinhas-wineLight" />
        </div>
      </div>
    </section>
  );
}
