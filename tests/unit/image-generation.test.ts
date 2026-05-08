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
  ratio: "4:5",
  title: "Energia da semana",
  subtitle: "Um sinal simples para hoje",
  cta: "Comente sua palavra",
  scienceBase: "transito entrelinhas",
  visualStyle: "Cosmic Gold Dark",
  prompt: "Arte final postavel, uma unica tela independente por post, sem grid.",
  negativePrompt: "grid, colagem",
  date: "2026-04-27",
  moment: "manha",
  cardIndex: 1
};

describe("post artwork generation", () => {
  it("builds mandatory post direction and negative prompts", () => {
    expect(buildFinalImagePrompt(baseInput)).toContain("Arte final postavel");
    expect(buildFinalImagePrompt(baseInput)).toContain("Titulo renderizado pelo sistema");
    expect(buildFinalNegativePrompt(baseInput)).toContain("multiplos cards");
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
      prompt: "Criar uma colagem com multiplos cards"
    });

    expect(result.valid).toBe(false);
  });

  it("returns a deterministic post artwork data URL", async () => {
    const result = await generateImage(baseInput);

    expect(result.imageUrl).toContain("data:image/svg+xml;base64,");
    expect(result.exportStatus).toBe("image_generated");
    expect(result.provider).toBe("renderer");
    expect(result.source).toBe("renderer");
    expect(result.estimatedCost).toBe(0);
  });
});
