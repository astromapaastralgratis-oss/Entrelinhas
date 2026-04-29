import { describe, expect, it } from "vitest";
import { generatePostArtwork, validatePostArtworkInput } from "../../lib/post-artwork";
import type { GenerateImageRequest } from "../../types/image-generation";

const feedPost: GenerateImageRequest = {
  format: "feed",
  ratio: "4:5",
  title: "Nem todo cansaco e fisico",
  subtitle: "Observe sua energia antes de decidir hoje",
  cta: "Salva para consultar depois",
  scienceBase: "energia emocional",
  visualStyle: "Cosmic Gold Dark",
  prompt: "modo escuro premium cosmico",
  negativePrompt: "grid, colagem"
};

describe("post artwork renderer", () => {
  it("renders feed posts in 1080x1350", () => {
    const artwork = generatePostArtwork(feedPost);

    expect(artwork.width).toBe(1080);
    expect(artwork.height).toBe(1350);
    expect(artwork.contentType).toBe("image/svg+xml");
    expect(artwork.svg).toContain("Nem todo cansaco");
  });

  it("renders stories and reels in 1080x1920", () => {
    const story = generatePostArtwork({ ...feedPost, format: "stories", ratio: "9:16" });
    const reels = generatePostArtwork({ ...feedPost, format: "reels", ratio: "9:16" });

    expect(story.width).toBe(1080);
    expect(story.height).toBe(1920);
    expect(reels.width).toBe(1080);
    expect(reels.height).toBe(1920);
  });

  it("rejects text that is too long before approval", () => {
    const validation = validatePostArtworkInput({
      ...feedPost,
      title: "Este titulo ficou longo demais para funcionar como uma arte final legivel no celular"
    });

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("titulo muito longo");
  });

  it("does not allow square carousel cards by default", () => {
    const validation = validatePostArtworkInput({ ...feedPost, format: "carrossel", ratio: "1:1" });

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("formato quadrado so deve ser usado quando escolhido");
  });
});
