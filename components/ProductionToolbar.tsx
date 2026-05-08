"use client";

import { CalendarDays, Download, PackageOpen, Wand2 } from "lucide-react";
import { buildPlanningCsv, downloadDayZip, downloadTextFile } from "@/lib/export-utils";
import type { AutomationMode } from "@/types/automation";
import type { ProductionContent } from "@/types/production";

type ProductionToolbarProps = {
  contents: ProductionContent[];
  weeklyContents: ProductionContent[];
  intensity: AutomationMode;
  isGenerating?: boolean;
  onIntensityChange: (mode: AutomationMode) => void;
  onGenerateToday: () => void;
  onGenerateWeek: () => void;
};

const intensityOptions: Array<{ value: AutomationMode; label: string }> = [
  { value: "economico", label: "Leve" },
  { value: "padrao", label: "Padrao" },
  { value: "crescimento", label: "Intenso" }
];

export function ProductionToolbar({
  contents,
  weeklyContents,
  intensity,
  isGenerating,
  onIntensityChange,
  onGenerateToday,
  onGenerateWeek
}: ProductionToolbarProps) {
  return (
    <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/86 p-5 shadow-entrelinhas backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">Gerar, revisar, baixar</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-50 md:text-4xl">Conteudos de Hoje</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
            Crie textos, posts finais, legendas e hashtags do dia em um clique. Depois revise e baixe para postar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[360px]">
          <button
            onClick={onGenerateToday}
            disabled={isGenerating}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-entrelinhas-gold bg-entrelinhas-gold px-5 text-base font-semibold text-black transition hover:bg-[#f4d783] disabled:cursor-wait disabled:opacity-70"
            type="button"
          >
            <Wand2 className="h-5 w-5" />
            {isGenerating ? "Gerando textos e posts..." : "Gerar conteudos de hoje"}
          </button>
          <button
            onClick={onGenerateWeek}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-entrelinhas-line bg-entrelinhas-night px-4 text-sm text-stone-100 transition hover:border-entrelinhas-gold"
            type="button"
          >
            <CalendarDays className="h-4 w-4" />
            Gerar semana
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Intensidade</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {intensityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onIntensityChange(option.value)}
                className={
                  intensity === option.value
                    ? "rounded-md border border-entrelinhas-gold bg-entrelinhas-gold/15 px-4 py-2 text-sm font-semibold text-stone-50"
                    : "rounded-md border border-entrelinhas-line bg-entrelinhas-void/45 px-4 py-2 text-sm text-stone-300 transition hover:border-entrelinhas-gold"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => downloadDayZip(contents)} className="toolbar-button" type="button">
            <PackageOpen className="h-4 w-4" />
            Baixar dia
          </button>
          <button
            onClick={() => downloadDayZip(weeklyContents.length ? weeklyContents : contents, "entrelinhas-content-semana.zip")}
            className="toolbar-button"
            type="button"
          >
            <Download className="h-4 w-4" />
            Baixar semana
          </button>
          <button
            onClick={() => downloadTextFile("planejamento.csv", buildPlanningCsv(contents), "text/csv;charset=utf-8")}
            className="toolbar-button"
            type="button"
          >
            Planejamento
          </button>
        </div>
      </div>
    </section>
  );
}
