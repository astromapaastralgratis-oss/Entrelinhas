import type { EditorialHistoryItem } from "@/types/content";
import type { GeneratedCopy } from "@/types/copy";
import type { VisualPromptResult } from "@/types/visual";

export type GeneratedContentValidationInput = {
  copy?: Partial<GeneratedCopy>;
  visualPrompts?: Array<Partial<VisualPromptResult>>;
  theme?: string;
  recentHistory?: EditorialHistoryItem[];
  repetitionRisk?: number;
};

export type GeneratedContentValidationChecks = {
  titleWordCount: boolean;
  subtitleWordCount: boolean;
  hasCTA: boolean;
  hasCaption: boolean;
  hasHashtags: boolean;
  noMedicalPromise: boolean;
  noAbsolutePrediction: boolean;
  noPsychologicalDiagnosis: boolean;
  noGenericCopy: boolean;
  noRepeatedTheme: boolean;
  visualPromptHasRatio: boolean;
  visualPostReady: boolean;
};

export type GeneratedContentValidationResult = {
  valid: boolean;
  blocked: boolean;
  checks: GeneratedContentValidationChecks;
  errors: string[];
  warnings: string[];
};
