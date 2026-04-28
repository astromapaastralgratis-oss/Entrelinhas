"use client";

import { BarChart3, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { calculatePerformanceScore, getWeeklyInsights } from "@/lib/performance-learning";
import type { PerformanceMetrics } from "@/types/performance";

type PerformanceManualProps = {
  metrics: PerformanceMetrics[];
  onAddMetric: (metric: PerformanceMetrics) => void;
};

const defaultMetric: Omit<PerformanceMetrics, "id"> = {
  publishedAt: new Date().toISOString().slice(0, 10),
  format: "carrossel",
  platform: "instagram",
  theme: "energia da semana",
  scienceBase: "astrologia",
  objective: "ganhar seguidores",
  hookType: "identificação emocional",
  ctaType: "seguir página",
  visualStyle: "Cosmic Gold",
  moment: "manhã",
  views: 1000,
  likes: 80,
  comments: 12,
  saves: 35,
  shares: 28,
  newFollowers: 16,
  bioClicks: 10,
  qualitativeNote: ""
};

export function PerformanceManual({ metrics, onAddMetric }: PerformanceManualProps) {
  const [draft, setDraft] = useState(defaultMetric);
  const indicators = useMemo(() => calculatePerformanceScore({ ...draft, id: "draft" }), [draft]);
  const insights = useMemo(() => getWeeklyInsights(metrics), [metrics]);

  function update<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    onAddMetric({
      ...draft,
      id: `metric-${Date.now()}`
    });
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-astral-line bg-astral-panel/86 p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-astral-gold" />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-astral-gold">Performance Manual</p>
            <h2 className="mt-1 text-xl font-semibold text-stone-50">Registrar resultado de publicação</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          <Input label="Data" type="date" value={draft.publishedAt} onChange={(value) => update("publishedAt", value)} />
          <Select label="Formato" value={draft.format} options={["feed", "carrossel", "stories", "reels", "tiktok"]} onChange={(value) => update("format", value as typeof draft.format)} />
          <Select label="Plataforma" value={draft.platform} options={["instagram", "tiktok"]} onChange={(value) => update("platform", value as typeof draft.platform)} />
          <Input label="Tema" value={draft.theme} onChange={(value) => update("theme", value)} />
          <Select label="Ciência base" value={draft.scienceBase} options={["astrologia", "tarot", "numerologia", "elemento", "cor", "cristal", "energia emocional", "trânsito astral"]} onChange={(value) => update("scienceBase", value as typeof draft.scienceBase)} />
          <Select label="Objetivo" value={draft.objective} options={["ganhar seguidores", "engajar", "levar para app", "educar", "gerar autoridade"]} onChange={(value) => update("objective", value as typeof draft.objective)} />
          <Input label="Visual style" value={draft.visualStyle} onChange={(value) => update("visualStyle", value)} />
          <Select label="Momento" value={draft.moment} options={["manhã", "tarde", "noite"]} onChange={(value) => update("moment", value as typeof draft.moment)} />
          <NumberInput label="Views" value={draft.views} onChange={(value) => update("views", value)} />
          <NumberInput label="Likes" value={draft.likes} onChange={(value) => update("likes", value)} />
          <NumberInput label="Comentários" value={draft.comments} onChange={(value) => update("comments", value)} />
          <NumberInput label="Salvamentos" value={draft.saves} onChange={(value) => update("saves", value)} />
          <NumberInput label="Compartilhamentos" value={draft.shares} onChange={(value) => update("shares", value)} />
          <NumberInput label="Novos seguidores" value={draft.newFollowers} onChange={(value) => update("newFollowers", value)} />
          <NumberInput label="Cliques na bio" value={draft.bioClicks} onChange={(value) => update("bioClicks", value)} />
          <Input label="Observação" value={draft.qualitativeNote} onChange={(value) => update("qualitativeNote", value)} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-6">
          <Metric label="salvamento" value={percent(indicators.saveRate)} />
          <Metric label="compart." value={percent(indicators.shareRate)} />
          <Metric label="coment." value={percent(indicators.commentRate)} />
          <Metric label="seguidores" value={percent(indicators.followerConversionRate)} />
          <Metric label="bio" value={percent(indicators.bioClickRate)} />
          <Metric label="score" value={`${indicators.performanceScore}/100`} />
        </div>

        <button type="button" onClick={submit} className="toolbar-button mt-5">
          <Plus className="h-4 w-4" />
          Registrar performance
        </button>
      </div>

      <section className="rounded-lg border border-astral-line bg-astral-panel/80 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-astral-gold">Insights da Semana</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Insight label="Melhor conteúdo" value={insights.bestContent?.theme ?? "-"} />
          <Insight label="Pior conteúdo" value={insights.worstContent?.theme ?? "-"} />
          <Insight label="Melhor ciência base" value={insights.bestScienceBase ?? "-"} />
          <Insight label="Melhor formato" value={insights.bestFormat ?? "-"} />
          <Insight label="Melhor CTA" value={insights.bestCta ?? "-"} />
          <Insight label="Melhor momento" value={insights.bestMoment ?? "-"} />
        </div>
        <p className="mt-4 rounded-md border border-astral-teal/25 bg-astral-teal/10 p-3 text-sm leading-6 text-stone-200">
          {insights.recommendation}
        </p>
      </section>

      <section className="rounded-lg border border-astral-line bg-astral-panel/80 p-5">
        <h3 className="text-lg font-semibold text-stone-50">Registros manuais</h3>
        <div className="mt-4 space-y-2">
          {metrics.map((metric) => {
            const score = calculatePerformanceScore(metric);
            return (
              <div key={metric.id} className="grid gap-2 rounded-md border border-white/5 bg-white/[0.035] p-3 text-sm md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold text-stone-50">{metric.theme}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {metric.publishedAt} · {metric.platform} · {metric.format} · {metric.scienceBase}
                  </p>
                </div>
                <p className="font-semibold text-astral-gold">{score.performanceScore}/100</p>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.14em] text-stone-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 outline-none focus:border-astral-gold" />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <Input label={label} type="number" value={String(value)} onChange={(value) => onChange(Number(value))} />;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.14em] text-stone-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 outline-none focus:border-astral-gold">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-astral-line bg-astral-void/40 p-3">
      <p className="font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-stone-500">{label}</p>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.035] p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 font-semibold text-stone-50">{value}</p>
    </div>
  );
}

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
