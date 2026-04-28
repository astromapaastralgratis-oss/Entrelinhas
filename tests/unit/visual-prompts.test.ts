import { describe, expect, it } from "vitest";
import { generateVisualPrompt, generateVisualPromptsForContent, getRatioForFormat, getVisualStyle } from "../../lib/visual-prompts";
import type { EditorialPlanItem } from "../../types/content";
import type { GeneratedCopy } from "../../types/copy";

const planItem: EditorialPlanItem = {
  date: "2026-04-27",
  moment: "tarde",
  platform: "instagram",
  format: "carrossel",
  objective: "educar",
  scienceBase: "astrologia",
  theme: "astrologia educativa: decisão prática",
  hookType: "microensinamento",
  ctaType: "salvar",
  strategicReason: "Carrossel educativo com alto potencial de salvamento.",
  score: {
    follow: 7,
    save: 9,
    share: 8,
    comment: 4,
    bioClick: 3,
    repetitionRisk: 2,
    emotionalIntensity: 5
  }
};

const copy: GeneratedCopy = {
  title: "Hoje sua energia pede pausa",
  subtitle: "Nem toda urgência merece sua entrega",
  slides: [
    { number: 1, title: "Pausa antes da resposta", subtitle: "Nem toda urgência merece sua entrega", visualCue: "lua" },
    { number: 2, title: "Observe o corpo", subtitle: "A tensão mostra onde simplificar", visualCue: "aura" },
    { number: 3, title: "Escolha uma ação", subtitle: "Um passo pequeno já muda o ritmo", visualCue: "estrela" }
  ],
  caption: "Legenda",
  hashtags: ["#AstralPessoal", "#Autoconhecimento", "#Astrologia", "#ClarezaEmocional", "#EnergiaDoDia"],
  cta: "Salve para consultar depois",
  pinnedComment: "Qual sinal apareceu?",
  qualityNotes: {
    scrollStop: "Título curto.",
    identification: "Tema emocional.",
    action: "CTA claro."
  }
};

describe("visual prompts", () => {
  it("uses the correct ratio by format", () => {
    expect(getRatioForFormat("feed")).toBe("1:1");
    expect(getRatioForFormat("carrossel")).toBe("1:1");
    expect(getRatioForFormat("stories")).toBe("9:16");
    expect(getRatioForFormat("reels")).toBe("9:16");
    expect(getRatioForFormat("tiktok")).toBe("9:16");
  });

  it("generates one independent prompt for each carousel card", () => {
    const prompts = generateVisualPromptsForContent(planItem, copy);

    expect(prompts).toHaveLength(3);
    expect(new Set(prompts.map((prompt) => prompt.styleName)).size).toBeGreaterThan(1);
    prompts.forEach((prompt) => {
      expect(prompt.ratio).toBe("1:1");
      expect(prompt.safeArea).toBe(true);
      expect(prompt.prompt).toContain("one single independent social media image");
      expect(prompt.prompt).toContain("no multiple slides in one image");
      expect(prompt.negativePrompt).toContain("grid");
      expect(prompt.negativePrompt).toContain("multiple cards");
    });
  });

  it("creates a mobile-first prompt with safe text limits", () => {
    const style = getVisualStyle(0, "stories");
    const prompt = generateVisualPrompt(
      {
        format: "stories",
        ratio: "9:16",
        title: "Hoje sua energia pede pausa antes de decidir qualquer coisa",
        subtitle: "Nem toda urgência merece sua entrega completa neste momento",
        cta: "Acesse o link na bio agora",
        scienceBase: "energia emocional",
        style: "premium cosmic dark"
      },
      style
    );

    expect(prompt.textBlocks.find((block) => block.type === "title")?.text.split(/\s+/).length).toBeLessThanOrEqual(12);
    expect(prompt.textBlocks.find((block) => block.type === "subtitle")?.text.split(/\s+/).length).toBeLessThanOrEqual(18);
    expect(prompt.prompt).toContain("high contrast");
    expect(prompt.prompt).toContain("safe margins");
  });

  it("rejects visual prompts without ratio", () => {
    const style = getVisualStyle(0, "stories");

    expect(() =>
      generateVisualPrompt(
        {
          format: "stories",
          ratio: "" as never,
          title: "Energia do dia",
          subtitle: "Uma direção simples",
          cta: "Comente",
          scienceBase: "energia emocional",
          style: "premium cosmic dark"
        },
        style
      )
    ).toThrow("Prompt visual rejeitado");
  });
});
