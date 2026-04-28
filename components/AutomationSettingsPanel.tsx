"use client";

import { AlertTriangle, Bot, Gauge, Lock, TimerReset } from "lucide-react";
import { buildTokenBudget, getAutomationAlerts, getModePolicy } from "@/lib/cost-control";
import { planScheduledGenerations } from "@/lib/automation-engine";
import type { AutomationAlert, AutomationMode, AutomationSettings, AutomationUsage } from "@/types/automation";

type AutomationSettingsPanelProps = {
  settings: AutomationSettings;
  usage: AutomationUsage;
  onChange: (settings: AutomationSettings) => void;
};

const modes: Array<{ value: AutomationMode; label: string; description: string }> = [
  { value: "economico", label: "Econômico", description: "Templates, CTAs e hashtags fixos; IA só no essencial." },
  { value: "padrao", label: "Padrão", description: "Copy completa com equilíbrio entre qualidade e custo." },
  { value: "crescimento", label: "Crescimento", description: "Mais variações, teste A/B e maior consumo." }
];

export function AutomationSettingsPanel({ settings, usage, onChange }: AutomationSettingsPanelProps) {
  const policy = getModePolicy(settings.mode);
  const budget = buildTokenBudget(settings, usage);
  const alerts: AutomationAlert[] = getAutomationAlerts(usage, settings);
  const schedule = planScheduledGenerations(new Date(), settings);

  function updateNumber(key: "dailyGenerationLimit" | "weeklyGenerationLimit" | "monthlyCostLimit", value: string) {
    onChange({ ...settings, [key]: Math.max(0, Number(value) || 0) });
  }

  return (
    <section className="rounded-lg border border-astral-line bg-astral-panel/80 p-5 shadow-astral">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-astral-gold">
            <Bot className="h-4 w-4" />
            Automação e orçamento
          </p>
          <h2 className="mt-2 text-xl font-semibold text-stone-50">Controle rígido de custo</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
            O calendário continua por regras fixas. A IA entra só nos campos liberados pelo modo atual e a regeneração é sempre individual.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-md border border-astral-line bg-astral-void/50 px-3 py-2 text-sm text-stone-200">
          <input
            type="checkbox"
            checked={settings.automaticGenerationEnabled}
            onChange={(event) => onChange({ ...settings, automaticGenerationEnabled: event.target.checked })}
          />
          Geração automática
        </label>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange({ ...settings, mode: mode.value })}
            className={`rounded-md border p-4 text-left transition ${
              settings.mode === mode.value
                ? "border-astral-gold bg-astral-gold/10"
                : "border-astral-line bg-astral-void/40 hover:border-astral-gold/50"
            }`}
          >
            <p className="font-semibold text-stone-50">{mode.label}</p>
            <p className="mt-2 text-sm leading-5 text-stone-400">{mode.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <BudgetMetric label="tokens hoje" value={`${budget.currentUsage}/${budget.dailyLimit}`} />
        <BudgetMetric label="tokens semana" value={`${usage.weeklyTokens}/${budget.weeklyLimit}`} />
        <BudgetMetric label="gerações" value={`${usage.dailyGenerations}/${settings.dailyGenerationLimit}`} />
        <BudgetMetric label="custo mensal" value={`$${usage.monthlyEstimatedCost.toFixed(4)}/$${settings.monthlyCostLimit}`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField
            label="limite diário"
            value={settings.dailyGenerationLimit}
            onChange={(value) => updateNumber("dailyGenerationLimit", value)}
          />
          <NumberField
            label="limite semanal"
            value={settings.weeklyGenerationLimit}
            onChange={(value) => updateNumber("weeklyGenerationLimit", value)}
          />
          <NumberField
            label="limite mensal US$"
            value={settings.monthlyCostLimit}
            onChange={(value) => updateNumber("monthlyCostLimit", value)}
          />
        </div>

        <div className="rounded-md border border-astral-line bg-astral-void/45 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-stone-100">
            <Gauge className="h-4 w-4 text-astral-teal" />
            Política ativa
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Intensidade {policy.intensity}; campos de IA: {policy.aiFields.join(", ")}; variações: {policy.variationLimit}.
          </p>
        </div>
      </div>

      <label className="mt-4 block rounded-md border border-astral-line bg-astral-void/45 p-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-stone-100">
          <Lock className="h-4 w-4 text-astral-gold" />
          Temas travados da semana
        </span>
        <textarea
          value={settings.lockedWeeklyThemes.join("\n")}
          onChange={(event) =>
            onChange({
              ...settings,
              lockedWeeklyThemes: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
            })
          }
          className="mt-3 min-h-20 w-full rounded-md border border-astral-line bg-black/25 p-3 text-sm text-stone-100 outline-none focus:border-astral-gold"
          placeholder="Um tema por linha"
        />
      </label>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <p key={alert.message} className="flex items-center gap-2 rounded-md border border-astral-line bg-astral-void/45 px-3 py-2 text-sm text-stone-300">
              <AlertTriangle className={alert.level === "danger" ? "h-4 w-4 text-red-300" : "h-4 w-4 text-astral-gold"} />
              {alert.message}
            </p>
          ))}
        </div>
        <div className="space-y-2">
          {schedule.map((item) => (
            <p key={item.type} className="flex items-center gap-2 rounded-md border border-astral-line bg-astral-void/45 px-3 py-2 text-sm text-stone-300">
              <TimerReset className="h-4 w-4 text-astral-teal" />
              {item.description} {item.enabled ? "Ativo" : "Pausado"}.
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function BudgetMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-astral-line bg-astral-void/40 px-3 py-2">
      <p className="text-lg font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-astral-line bg-black/25 px-3 py-2 text-sm text-stone-100 outline-none focus:border-astral-gold"
      />
    </label>
  );
}
