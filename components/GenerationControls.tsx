"use client";

import { CalendarDays, Sparkles, Wand2 } from "lucide-react";
import type { ContentIntensity, EditorialObjective } from "@/types/content";

export type EditorialSettings = {
  intensity: ContentIntensity;
  primaryObjective: EditorialObjective;
};

const intensities: ContentIntensity[] = ["leve", "padrão", "intensa"];
const objectives: EditorialObjective[] = [
  "ganhar seguidores",
  "engajar",
  "levar para app",
  "educar",
  "gerar autoridade"
];

type GenerationControlsProps = {
  settings: EditorialSettings;
  onSettingsChange: (settings: EditorialSettings) => void;
  onGenerateDay: () => void;
  onGenerateWeek: () => void;
};

export function GenerationControls({
  settings,
  onSettingsChange,
  onGenerateDay,
  onGenerateWeek
}: GenerationControlsProps) {
  return (
    <section className="rounded-lg border border-astral-line bg-astral-panel/86 p-4 shadow-astral backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-astral-gold">
            <Sparkles className="h-4 w-4" />
            Motor editorial inteligente
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-stone-50 md:text-3xl">
            Astral Content Studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
            Escolhe momento, formato, ciência base, gancho, CTA e pontuação usando regras estruturadas, sem IA.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[560px]">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-stone-400">Intensidade</span>
            <select
              value={settings.intensity}
              onChange={(event) =>
                onSettingsChange({ ...settings, intensity: event.target.value as ContentIntensity })
              }
              className="h-11 w-full rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 outline-none transition focus:border-astral-gold"
            >
              {intensities.map((intensity) => (
                <option key={intensity}>{intensity}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-stone-400">Objetivo principal</span>
            <select
              value={settings.primaryObjective}
              onChange={(event) =>
                onSettingsChange({ ...settings, primaryObjective: event.target.value as EditorialObjective })
              }
              className="h-11 w-full rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 outline-none transition focus:border-astral-gold"
            >
              {objectives.map((objective) => (
                <option key={objective}>{objective}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerateDay}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-astral-gold px-4 text-sm font-semibold text-astral-void transition hover:bg-[#e7c783] focus:outline-none focus:ring-2 focus:ring-astral-gold/60"
        >
          <Wand2 className="h-4 w-4" />
          Gerar plano do dia
        </button>
        <button
          type="button"
          onClick={onGenerateWeek}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-astral-line bg-astral-night px-4 text-sm font-semibold text-stone-100 transition hover:border-astral-violet hover:text-white focus:outline-none focus:ring-2 focus:ring-astral-violet/50"
        >
          <CalendarDays className="h-4 w-4" />
          Gerar plano da semana
        </button>
      </div>
    </section>
  );
}
