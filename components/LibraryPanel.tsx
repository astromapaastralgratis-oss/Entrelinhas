"use client";

import type { ProductionContent } from "@/types/production";

type LibraryPanelProps = {
  contents: ProductionContent[];
};

export function LibraryPanel({ contents }: LibraryPanelProps) {
  const published = contents.filter((content) => content.status === "publicado");
  const generated = contents.filter((content) => content.copy);

  return (
    <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">Biblioteca</p>
          <h2 className="mt-2 text-xl font-semibold text-stone-50">Histórico operacional</h2>
        </div>
        <span className="rounded border border-entrelinhas-teal/25 bg-entrelinhas-teal/10 px-3 py-1 text-xs text-entrelinhas-teal">
          {contents.length} conteúdos
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="gerados" value={generated.length} />
        <Metric label="publicados" value={published.length} />
        <Metric label="temas usados" value={new Set(contents.map((content) => content.plan.theme)).size} />
        <Metric label="CTAs usados" value={new Set(contents.map((content) => content.copy?.copy.cta ?? content.plan.ctaType)).size} />
        <Metric label="formatos" value={new Set(contents.map((content) => content.plan.format)).size} />
        <Metric label="regenerados" value={contents.reduce((total, content) => total + content.regeneratedCount, 0)} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {contents.map((content) => (
          <div key={content.id} className="rounded-md border border-white/5 bg-white/[0.035] p-3">
            <p className="text-sm font-semibold text-stone-50">{content.plan.theme}</p>
            <p className="mt-2 text-xs text-stone-400">
              {content.plan.format} · {content.plan.scienceBase} · {content.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-entrelinhas-line bg-entrelinhas-void/40 p-3">
      <p className="text-xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}
