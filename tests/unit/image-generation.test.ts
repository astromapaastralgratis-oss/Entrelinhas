import { describe, expect, it } from "vitest";
import {
  buildFinalImagePrompt,
  buildFinalNegativePrompt,
  buildImageFilename,
  generateImage,
  getBucketForFormat,
  validateImageGenerationInput
} from "../../lib/ai/image-generation";
import type { GenerateImageRequest } from "../../types/image-generation";

const baseInput: GenerateImageRequest = {
  format: "carrossel",
  ratio: "1:1",
  title: "Energia da semana",
  subtitle: "Um sinal simples para hoje",
  cta: "Comente sua palavra",
  scienceBase: "trânsito astral",
  visualStyle: "Cosmic Gold",
  prompt: "Composição editorial escura, uma única tela por imagem.",
  negativePrompt: "grid, colagem",
  date: "2026-04-27",
  moment: "manhã",
  cardIndex: 1
};

describe("image generation", () => {
  it("builds mandatory visual and negative prompts", () => {
    expect(buildFinalImagePrompt(baseInput)).toContain("uma única tela por imagem");
    expect(buildFinalImagePrompt(baseInput)).toContain("sem grid");
    expect(buildFinalNegativePrompt(baseInput)).toContain("múltiplos cards");
  });

  it("maps formats to storage buckets and filenames", () => {
    expect(getBucketForFormat("feed")).toBe("posts");
    expect(getBucketForFormat("story")).toBe("stories");
    expect(getBucketForFormat("carrossel")).toBe("carousels");
    expect(getBucketForFormat("reels")).toBe("reels-covers");
    expect(buildImageFilename(baseInput)).toBe("2026-04-27_manha_carrossel_card-01.png");
    expect(buildImageFilename({ ...baseInput, format: "story", ratio: "9:16", cardIndex: 2 })).toBe(
      "2026-04-27_manha_story-02.png"
    );
  });

  it("rejects prompts that ask for grid or collage", () => {
    const result = validateImageGenerationInput({
      ...baseInput,
      prompt: "Criar uma colagem com múltiplos cards"
    });

    expect(result.valid).toBe(false);
  });

  it("returns a PNG data URL fallback without configured provider", async () => {
    const result = await generateImage(baseInput);

    expect(result.imageUrl).toContain("data:image/png;base64,");
    expect(result.exportStatus).toBe("image_generated");
    expect(result.source).toBe("fallback");
  });
});
