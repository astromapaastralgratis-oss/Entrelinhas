import type { EditorialPlanItem } from "@/types/content";
import type { GenerateCopyResult } from "@/types/copy";
import type { VisualPromptResult } from "@/types/visual";

export type ProductionStatus =
  | "planejado"
  | "copy gerada"
  | "imagem pendente"
  | "imagem gerada"
  | "precisa ajuste"
  | "aprovado"
  | "publicado";

export type QualityScore = {
  scrollStop: number;
  identification: number;
  action: number;
  clarity: number;
  nonRepetition: number;
};

export type ProductionContent = {
  id: string;
  plan: EditorialPlanItem;
  copy?: GenerateCopyResult;
  visualPrompts: VisualPromptResult[];
  status: ProductionStatus;
  qualityScore: QualityScore;
  regeneratedCount: number;
  generatedPostId?: string | null;
  publishedAt?: string;
};
