import type { EditorialFormat, EditorialScienceBase } from "@/types/content";
import type { VisualRatio } from "@/types/visual";

export type ImageGenerationProvider = "renderer" | "openai" | "ideogram" | "leonardo" | "replicate" | "canva" | "fallback";

export type GenerateImageRequest = {
  generatedPostId?: string;
  userId?: string;
  date?: string;
  moment?: string;
  format: EditorialFormat | "story";
  ratio: VisualRatio;
  title: string;
  subtitle: string;
  cta: string;
  scienceBase: EditorialScienceBase | string;
  visualStyle: string;
  prompt: string;
  negativePrompt: string;
  cardIndex?: number;
};

export type GeneratedImageResult = {
  imageUrl: string;
  storagePath: string;
  bucket: string;
  filename: string;
  format: string;
  ratio: VisualRatio;
  cardIndex: number;
  provider: ImageGenerationProvider;
  estimatedCost: number;
  exportStatus: "image_generated" | "failed";
  source: "renderer" | "provider" | "fallback";
};

export type GenerateImagesBatchRequest = {
  userId?: string;
  generatedPostId?: string;
  images: GenerateImageRequest[];
};
