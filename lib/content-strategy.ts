import { getLastHistoryValue, rotateWithoutImmediateRepeat } from "@/lib/algorithm-rules";
import { brandRules, intensityRules } from "@/lib/brand-rules";
import {
  contentFormats,
  ctaTemplates,
  hookRotation,
  hookTemplates,
  objectiveRotation,
  pillarRotation,
  scienceRotation,
  structuresByFormat,
  themeBank,
  visualStyles
} from "@/lib/content-templates";
import { getOutputFields } from "@/lib/token-budget";
import type {
  ContentHistoryItem,
  ContentObjective,
  GenerationSettings,
  PlannedContent
} from "@/types/content";

const defaultEmotion = "um pouco disperso";

export const mockHistory: ContentHistoryItem[] = [
  {
    id: "hist-1",
    date: "2026-04-24",
    format: "carrossel",
    objective: "engajamento",
    science: "tarot",
    hookType: "salvável",
    theme: "limites emocionais",
    cta: "Comente a palavra que define sua energia de hoje."
  },
  {
    id: "hist-2",
    date: "2026-04-25",
    format: "stories",
    objective: "tráfego para app",
    science: "numerologia",
    hookType: "curiosidade",
    theme: "decisão adiada",
    cta: "Abra o app para ver sua leitura completa do dia."
  },
  {
    id: "hist-3",
    date: "2026-04-26",
    format: "feed",
    objective: "ganhar seguidores",
    science: "energia emocional",
    hookType: "identificação",
    theme: "clareza antes de responder",
    cta: "Siga a Entrelinhas para receber sua direção do dia."
  }
];

function chooseObjective(index: number, primary: ContentObjective, previous?: ContentObjective) {
  const weighted = [primary, ...objectiveRotation.filter((objective) => objective !== primary)];
  return rotateWithoutImmediateRepeat(weighted, index, previous);
}

function fillTemplate(template: string, science: string, theme: string) {
  return template
    .replace("{science}", science)
    .replace("{theme}", theme)
    .replace("{emotion}", defaultEmotion);
}

export function generateContentItem(
  date: Date,
  index: number,
  settings: GenerationSettings,
  history: ContentHistoryItem[] = mockHistory
): PlannedContent {
  const previousFormat = getLastHistoryValue(history, "format");
  const previousObjective = getLastHistoryValue(history, "objective");
  const previousScience = getLastHistoryValue(history, "science");
  const previousHook = getLastHistoryValue(history, "hookType");
  const previousTheme = getLastHistoryValue(history, "theme");

  const format = rotateWithoutImmediateRepeat(contentFormats, index, previousFormat);
  const objective = chooseObjective(index, settings.primaryObjective, previousObjective);
  const science = rotateWithoutImmediateRepeat(scienceRotation, index, previousScience);
  const hookType = rotateWithoutImmediateRepeat(hookRotation, index, previousHook);
  const theme = rotateWithoutImmediateRepeat(themeBank, index, previousTheme);
  const pillar = pillarRotation[index % pillarRotation.length];
  const cta = ctaTemplates[objective][0];
  const structure = structuresByFormat[format][index % structuresByFormat[format].length];
  const visualStyle = visualStyles[index % visualStyles.length];
  const hook = fillTemplate(hookTemplates[hookType][index % hookTemplates[hookType].length], science, theme);
  const tone = intensityRules[settings.intensity].tone;

  return {
    id: `plan-${date.toISOString().slice(0, 10)}-${index}`,
    date: date.toISOString().slice(0, 10),
    platform: format === "reels_tiktok" ? "Instagram + TikTok" : "Instagram",
    format,
    objective,
    science,
    pillar,
    hookType,
    hook,
    theme,
    title: `${theme[0].toUpperCase()}${theme.slice(1)} por ${science}`,
    cta,
    structure,
    visualStyle,
    strategicReason: `Combina ${format.replace("_", "/")} com ${pillar.toLowerCase()} para apoiar ${objective}; ${science} entra como lente fixa e compacta, evitando briefing longo para IA.`,
    compactAiBrief: {
      brand: brandRules.name,
      format,
      objective,
      science,
      pillar,
      theme,
      hookType,
      tone,
      outputFields: getOutputFields(format),
      maxTokens: intensityRules[settings.intensity].tokenCeiling
    }
  };
}

export function generateDailyPlan(settings: GenerationSettings, date = new Date(), history = mockHistory) {
  const total = intensityRules[settings.intensity].postsPerDay;
  const planned: PlannedContent[] = [];

  for (let index = 0; index < total; index += 1) {
    const item = generateContentItem(date, index, settings, [...history, ...planned]);
    planned.push(item);
  }

  return planned;
}
