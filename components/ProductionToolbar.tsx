"use client";

import { Archive, CalendarDays, Download, FileSpreadsheet, PackageOpen, Wand2 } from "lucide-react";
import { buildPlanningCsv, downloadDayZip, downloadTextFile } from "@/lib/export-utils";
import type { ProductionContent } from "@/types/production";

type ProductionToolbarProps = {
  contents: ProductionContent[];
  weeklyContents: ProductionContent[];
  onGenerateToday: () => void;
  onGenerateWeek: () => void;
  onShowLibrary: () => void;
};

export function ProductionToolbar({
  contents,
  weeklyContents,
  onGenerateToday,
  onGenerateWeek,
  onShowLibrary
}: ProductionToolbarProps) {
  return (
    <section className="rounded-lg border border-astral-line bg-astral-panel/86 p-4 shadow-astral backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-astral-gold">Fluxo operacional</p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-50 md:text-3xl">Conteúdos de Hoje</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
            Gere, revise, copie, aprove e exporte conteúdos sem recomeçar do zero.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <button onClick={onGenerateToday} className="toolbar-button" type="button">
            <Wand2 className="h-4 w-4" />
            Gerar conteúdos de hoje
          </button>
          <button onClick={onGenerateWeek} className="toolbar-button" type="button">
            <CalendarDays className="h-4 w-4" />
            Gerar semana
          </button>
          <button onClick={onShowLibrary} className="toolbar-button" type="button">
            <Archive className="h-4 w-4" />
            Biblioteca
          </button>
          <button onClick={() => downloadDayZip(contents)} className="toolbar-button" type="button">
            <PackageOpen className="h-4 w-4" />
            ZIP do dia
          </button>
          <button onClick={() => downloadDayZip(weeklyContents.length ? weeklyContents : contents, "astral-content-semana.zip")} className="toolbar-button" type="button">
            <Download className="h-4 w-4" />
            ZIP da semana
          </button>
          <button onClick={() => downloadTextFile("planejamento.csv", buildPlanningCsv(contents), "text/csv;charset=utf-8")} className="toolbar-button" type="button">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {[
          ["1", "Gerar plano", "Cria os cards do dia."],
          ["2", "Gerar copy", "Preenche legenda, CTA e hashtags."],
          ["3", "Gerar imagem", "Cria a arte principal."],
          ["4", "Aprovar e baixar", "Exporta para postar."]
        ].map(([step, title, description]) => (
          <div key={step} className="rounded-md border border-white/5 bg-astral-void/35 p-3">
            <p className="text-xs text-astral-gold">Passo {step}</p>
            <p className="mt-1 text-sm font-semibold text-stone-100">{title}</p>
            <p className="mt-1 text-xs text-stone-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
