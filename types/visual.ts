import type { EditorialFormat, EditorialScienceBase } from "@/types/content";

export type VisualRatio = "1:1" | "9:16";

export type VisualTextBlock = {
  type: "title" | "subtitle" | "cta";
  text: string;
  maxWords: number;
};

export type VisualStyle = {
  id: string;
  name: string;
  palette: string[];
  elements: string[];
  bestUse: string[];
  promptFragment: string;
};

export type VisualPromptInput = {
  format: EditorialFormat;
  ratio: VisualRatio;
  title: string;
  subtitle: string;
  cta: string;
  scienceBase: EditorialScienceBase;
  style: string;
};

export type VisualPromptResult = {
  prompt: string;
  negativePrompt: string;
  ratio: VisualRatio;
  safeArea: true;
  textBlocks: VisualTextBlock[];
  styleName: string;
  imageUrl?: string;
  storagePath?: string;
  exportStatus?: "not_exported" | "ready" | "image_generated" | "exported" | "failed";
  estimatedCost?: number;
};
