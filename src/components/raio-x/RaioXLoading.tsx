import { BrandAvatar } from "@/components/entrelinhas/BrandAssets";

export function RaioXLoading() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center justify-center text-center">
      <div className="editorial-panel w-full p-8">
        <div className="mx-auto w-fit animate-pulse">
          <BrandAvatar className="h-16 w-16" size={80} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Sua leitura estrategica</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Organizando seu Raio-X Executivo.</h1>
        <p className="mt-4 leading-7 text-entrelinhas-muted">
          Alguns instantes para devolver uma leitura clara, aplicavel e sofisticada.
        </p>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-entrelinhas-navy/70">
          <div className="h-full w-2/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-entrelinhas-blueLight via-entrelinhas-gold to-entrelinhas-goldLight" />
        </div>
      </div>
    </section>
  );
}
