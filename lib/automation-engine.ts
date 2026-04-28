import { getModePolicy } from "@/lib/cost-control";
import type { EditorialPlanItem } from "@/types/content";
import type {
  AiGenerationField,
  AutomationMode,
  AutomationSettings,
  ScheduledGeneration
} from "@/types/automation";

export function getModeContentIntensity(mode: AutomationMode) {
  return getModePolicy(mode).intensity;
}

export function createGenerationCacheKey(item: EditorialPlanItem, mode: AutomationMode, variant = 0) {
  return [
    mode,
    variant,
    item.date,
    item.moment,
    item.platform,
    item.format,
    item.objective,
    item.scienceBase,
    item.theme,
    item.hookType,
    item.ctaType
  ].join("|");
}

export function applyLockedThemes(plan: EditorialPlanItem[], lockedThemes: string[]) {
  const themes = lockedThemes.map((theme) => theme.trim()).filter(Boolean);
  if (themes.length === 0) return plan;

  return plan.map((item, index) => {
    const lockedTheme = themes[index % themes.length];
    return {
      ...item,
      theme: lockedTheme,
      strategicReason: `${item.strategicReason} Tema travado manualmente para manter consistencia da semana.`
    };
  });
}

export function planScheduledGenerations(now: Date, settings: AutomationSettings): ScheduledGeneration[] {
  const sundayNight = nextWeekdayAt(now, 0, 20);
  const nextMorning = nextHourAt(now, 7);

  return [
    {
      type: "weekly_plan",
      enabled: settings.automaticGenerationEnabled,
      scheduledFor: sundayNight.toISOString(),
      description: "Gerar plano semanal domingo a noite."
    },
    {
      type: "daily_content",
      enabled: settings.automaticGenerationEnabled,
      scheduledFor: nextMorning.toISOString(),
      description: "Gerar conteudos do dia pela manha."
    }
  ];
}

export function shouldUseAiForField(mode: AutomationMode, field: AiGenerationField) {
  return getModePolicy(mode).aiFields.includes(field);
}

function nextWeekdayAt(now: Date, weekday: number, hour: number) {
  const scheduled = new Date(now);
  scheduled.setHours(hour, 0, 0, 0);
  const daysUntil = (weekday - scheduled.getDay() + 7) % 7;
  scheduled.setDate(scheduled.getDate() + daysUntil);
  if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 7);
  return scheduled;
}

function nextHourAt(now: Date, hour: number) {
  const scheduled = new Date(now);
  scheduled.setHours(hour, 0, 0, 0);
  if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);
  return scheduled;
}
