import type { CompactAiBrief, ContentFormat } from "@/types/content";

const outputFieldsByFormat: Record<ContentFormat, CompactAiBrief["outputFields"]> = {
  feed: ["hook", "caption", "visual_prompt", "cta"],
  carrossel: ["hook", "slides", "visual_prompt", "cta"],
  stories: ["hook", "slides", "cta"],
  reels_tiktok: ["hook", "script", "visual_prompt", "cta"]
};

export function getOutputFields(format: ContentFormat) {
  return outputFieldsByFormat[format];
}

export function estimateBriefTokens(brief: CompactAiBrief) {
  return Math.ceil(JSON.stringify(brief).length / 4);
}

export const tokenBudgetRules = {
  strategyIsLocal: true,
  aiReceivesOnlyCompactBrief: true,
  repeatedPromptPolicy: "Use IDs and fixed constants locally; send only compact JSON fields to AI.",
  maxBriefTokensTarget: 180,
  maxGenerationTokensTarget: 650
} as const;
