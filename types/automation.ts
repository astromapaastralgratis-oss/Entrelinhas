import type { ContentIntensity } from "@/types/content";
import type { TextProvider } from "@/types/copy";

export type AutomationMode = "economico" | "padrao" | "crescimento";

export type AiGenerationField = "hook" | "copy" | "caption" | "creative_variation" | "visual_prompt";

export type AutomationSettings = {
  dailyGenerationLimit: number;
  weeklyGenerationLimit: number;
  monthlyCostLimit: number;
  mode: AutomationMode;
  aiProviderPreference: TextProvider;
  automaticGenerationEnabled: boolean;
  lockedWeeklyThemes: string[];
};

export type TokenBudget = {
  dailyLimit: number;
  weeklyLimit: number;
  monthlyCostLimit: number;
  currentUsage: number;
  mode: AutomationMode;
};

export type AutomationUsage = {
  dailyGenerations: number;
  weeklyGenerations: number;
  monthlyEstimatedCost: number;
  dailyTokens: number;
  weeklyTokens: number;
};

export type AutomationModePolicy = {
  mode: AutomationMode;
  label: string;
  intensity: ContentIntensity;
  aiFields: AiGenerationField[];
  variationLimit: number;
  allowAbTest: boolean;
  reuseCarouselStructure: boolean;
  useTemplateHashtags: boolean;
  useTemplateCtas: boolean;
  copyCompleteness: "minimal" | "complete" | "variations";
};

export type AutomationAlert = {
  level: "info" | "warning" | "danger";
  message: string;
};

export type BudgetDecision = {
  allowed: boolean;
  alerts: AutomationAlert[];
  projectedTokens: number;
  projectedMonthlyCost: number;
  reason?: string;
};

export type ScheduledGeneration = {
  type: "weekly_plan" | "daily_content";
  enabled: boolean;
  scheduledFor: string;
  description: string;
};
