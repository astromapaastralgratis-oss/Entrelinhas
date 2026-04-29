import type { EditorialFormat, EditorialScienceBase } from "@/types/content";

export type VisualRatio = "1:1" | "4:5" | "9:16";
export type VisualMode = "dark" | "light";
export type VisualLayoutType =
  | "viral-hook"
  | "educational"
  | "emotional"
  | "product-cta"
  | "carousel-card"
  | "story-frame"
  | "reels-cover";

export type VisualTextBlock = {
  type: "title" | "subtitle" | "cta";
  text: string;
  maxWords: number;
};

export type VisualStyle = {
  id: string;
  name: string;
  mode: VisualMode;
  palette: string[];
  elements: string[];
  bestUse: string[];
  layoutType: VisualLayoutType;
  typography: {
    title: string;
    body: string;
  };
  compositionRules: string[];
  intensity: "leve" | "media" | "alta";
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
  width: number;
  height: number;
  safeArea: true;
  textBlocks: VisualTextBlock[];
  styleName: string;
  visualMode: VisualMode;
  layoutType: VisualLayoutType;
  isPostReady: boolean;
  validationNotes: string[];
  imageUrl?: string;
  storagePath?: string;
  exportStatus?: "not_exported" | "ready" | "image_generated" | "exported" | "failed";
  estimatedCost?: number;
};
