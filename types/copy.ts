import type {
  EditorialCtaType,
  EditorialFormat,
  EditorialHookType,
  EditorialMoment,
  EditorialObjective,
  EditorialPlanItem,
  EditorialScienceBase
} from "@/types/content";
import type { AutomationMode } from "@/types/automation";

export type CopyBrief = {
  format: EditorialFormat;
  cards: number;
  objective: EditorialObjective;
  scienceBase: EditorialScienceBase;
  theme: string;
  hookType: EditorialHookType;
  moment: EditorialMoment;
  ctaType: EditorialCtaType;
  tone: string;
  imageTextLimit: string;
  wordLimit: number;
};

export type GeneratedSlide = {
  number: number;
  title: string;
  subtitle: string;
  visualCue: string;
};

export type GeneratedCopy = {
  title: string;
  subtitle: string;
  slides: GeneratedSlide[];
  caption: string;
  hashtags: string[];
  cta: string;
  pinnedComment: string;
  qualityNotes: {
    scrollStop: string;
    identification: string;
    action: string;
  };
};

export type CopyCostEstimate = {
  model: string;
  promptTokensEstimate: number;
  completionTokensEstimate: number;
  totalTokensEstimate: number;
  estimatedCost: number;
  dailyLimit: number;
  blocked: boolean;
  reason?: string;
  mode?: AutomationMode;
  cached?: boolean;
};

export type GenerateCopyResult = {
  brief: CopyBrief;
  copy: GeneratedCopy;
  cost: CopyCostEstimate;
  source: "openai" | "gemini" | "fallback" | "mock";
};

export type TextProvider = "openai" | "gemini";

export type CompactGenerateCopyRequest = {
  planItemId?: string;
  format: EditorialFormat;
  objective: EditorialObjective;
  scienceBase: EditorialScienceBase;
  theme: string;
  hookType: EditorialHookType;
  moment: EditorialMoment;
  cards: number;
  ctaType: EditorialCtaType;
  tone?: string;
  limits?: {
    titleMaxWords?: number;
    subtitleMaxWords?: number;
  };
  userId?: string;
  provider?: TextProvider;
};

export type GenerateCopyRequest = {
  planItem: EditorialPlanItem;
  planItemId?: string;
  userId?: string;
  intensity?: "leve" | "padrão" | "intensa";
  automationMode?: AutomationMode;
  currentDailyCost?: number;
  forceMock?: boolean;
  provider?: TextProvider;
};
