import { describe, expect, it } from "vitest";
import { buildCompactCopyPrompt, generateCopy, generateCopyBrief, parseGeneratedCopyJson } from "../../lib/copy-generation";
import type { EditorialPlanItem } from "../../types/content";

const planItem: EditorialPlanItem = {
  date: "2026-04-27",
  moment: "tarde",
  platform: "instagram",
  format: "stories",
  objective: "levar para app",
  scienceBase: "energia emocional",
  theme: "clareza emocional",
  hookType: "curiosidade",
  ctaType: "acessar link na bio",
  strategicReason: "Stories de tarde para criar conexão e levar para o app.",
  score: {
    follow: 3,
    save: 2,
    share: 3,
    comment: 8,
    bioClick: 9,
    repetitionRisk: 2,
    emotionalIntensity: 6
  }
};

describe("copy generation", () => {
  it("creates a compact AI brief from a plan item", () => {
    const brief = generateCopyBrief(planItem);
    const prompt = buildCompactCopyPrompt(brief);

    expect(brief).toMatchObject({
      format: "stories",
      cards: 5,
      objective: "levar para app",
      scienceBase: "energia emocional",
      theme: "clareza emocional",
      hookType: "curiosidade",
      moment: "tarde",
      ctaType: "acessar link na bio"
    });
    expect(prompt.length).toBeLessThan(420);
    expect(prompt).not.toContain("clareza prática para decisões emocionais");
  });

  it("returns valid short JSON in mock mode", async () => {
    const result = await generateCopy({ planItem, forceMock: true });

    expect(result.copy).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        subtitle: expect.any(String),
        slides: expect.any(Array),
        caption: expect.any(String),
        hashtags: expect.any(Array),
        cta: expect.any(String),
        pinnedComment: expect.any(String)
      })
    );
    expect(result.copy.slides).toHaveLength(5);
    expect(result.copy.hashtags.length).toBeGreaterThanOrEqual(5);
    expect(result.cost.totalTokensEstimate).toBeGreaterThan(0);
  });

  it("rejects invalid JSON returned by AI", () => {
    expect(() => parseGeneratedCopyJson("{invalid-json")).toThrow("IA retornou JSON inválido para copy.");
  });

  it("blocks intense generation when projected daily limit is exceeded", async () => {
    const result = await generateCopy({
      planItem,
      intensity: "intensa",
      currentDailyCost: 999,
      forceMock: true
    });

    expect(result.cost.blocked).toBe(true);
    expect(result.copy.caption).toBe("");
  });
});
