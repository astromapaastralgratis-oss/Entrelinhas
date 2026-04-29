import { describe, expect, it } from "vitest";
import {
  generateVisualPrompt,
  generateVisualPromptsForContent,
  getRatioForFormat,
  getVisualStyle,
  selectPostVisualStyle
} from "../../lib/visual-prompts";
import type { EditorialPlanItem } from "../../types/content";
import type { GeneratedCopy } from "../../types/copy";

const planItem: EditorialPlanItem = {
  date: "2026-04-27",
  moment: "tarde",
  platform: "instagram",
  format: "carrossel",
  objective: "educar",
  scienceBase: "astrologia",
  theme: "astrologia educativa: decisao pratica",
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
  subtitle: "Nem toda urgencia merece sua entrega",
  slides: [
    { number: 1, title: "Pausa antes da resposta", subtitle: "Nem toda urgencia merece sua entrega", visualCue: "lua" },
    { number: 2, title: "Observe o corpo", subtitle: "A tensao mostra onde simplificar", visualCue: "aura" },
    { number: 3, title: "Escolha uma acao", subtitle: "Um passo pequeno ja muda o ritmo", visualCue: "estrela" }
  ],
  caption: "Legenda",
  hashtags: ["#AstralPessoal", "#Autoconhecimento", "#Astrologia", "#ClarezaEmocional", "#EnergiaDoDia"],
  cta: "Salve para consultar depois",
  pinnedComment: "Qual sinal apareceu?",
  qualityNotes: {
    scrollStop: "Titulo curto.",
    identification: "Tema emocional.",
    action: "CTA claro."
  }
};

describe("visual prompts", () => {
  it("uses post-ready ratios by format", () => {
    expect(getRatioForFormat("feed")).toBe("4:5");
    expect(getRatioForFormat("feed", true)).toBe("1:1");
    expect(getRatioForFormat("carrossel")).toBe("4:5");
    expect(getRatioForFormat("stories")).toBe("9:16");
    expect(getRatioForFormat("reels")).toBe("9:16");
    expect(getRatioForFormat("tiktok")).toBe("9:16");
  });

  it("generates independent carousel cards without mixing styles", () => {
    const prompts = generateVisualPromptsForContent(planItem, copy);

    expect(prompts).toHaveLength(3);
    expect(new Set(prompts.map((prompt) => prompt.styleName)).size).toBe(1);
    expect(new Set(prompts.map((prompt) => prompt.visualMode)).size).toBe(1);
    prompts.forEach((prompt) => {
      expect(prompt.ratio).toBe("4:5");
      expect(prompt.width).toBe(1080);
      expect(prompt.height).toBe(1350);
      expect(prompt.safeArea).toBe(true);
      expect(prompt.prompt).toContain("Arte final postavel");
      expect(prompt.prompt).toContain("Texto sera renderizado pelo sistema");
      expect(prompt.prompt).toContain("sem grid");
      expect(prompt.negativePrompt).toContain("multiplos cards");
    });
  });

  it("creates a mobile-first post direction with safe text limits", () => {
    const style = getVisualStyle(0, "stories");
    const prompt = generateVisualPrompt(
      {
        format: "stories",
        ratio: "9:16",
        title: "Hoje sua energia pede pausa antes de decidir qualquer coisa",
        subtitle: "Nem toda urgencia merece sua entrega completa neste momento",
        cta: "Acesse o link na bio agora",
        scienceBase: "energia emocional",
        style: "premium cosmic dark"
      },
      style
    );

    expect(prompt.textBlocks.find((block) => block.type === "title")?.text.split(/\s+/).length).toBeLessThanOrEqual(12);
    expect(prompt.textBlocks.find((block) => block.type === "subtitle")?.text.split(/\s+/).length).toBeLessThanOrEqual(18);
    expect(prompt.prompt).toContain("leitura perfeita no celular");
    expect(prompt.prompt).toContain("margens");
  });

  it("selects the correct visual style by content strategy", () => {
    expect(selectPostVisualStyle({ ...planItem, scienceBase: "tarot" }).name).toBe("Tarot Premium");
    expect(selectPostVisualStyle({ ...planItem, scienceBase: "numerologia" }).name).toBe("Numerology Editorial Light");
    expect(selectPostVisualStyle({ ...planItem, scienceBase: "astrologia", objective: "autoridade" }).name).toBe(
      "Elegant Astro Light"
    );
    expect(selectPostVisualStyle({ ...planItem, scienceBase: "energia emocional" }).name).toBe("Cosmic Gold Dark");
  });

  it("rejects visual prompts without ratio", () => {
    const style = getVisualStyle(0, "stories");

    expect(() =>
      generateVisualPrompt(
        {
          format: "stories",
          ratio: "" as never,
          title: "Energia do dia",
          subtitle: "Uma direcao simples",
          cta: "Comente",
          scienceBase: "energia emocional",
          style: "premium cosmic dark"
        },
        style
      )
    ).toThrow("Estilo do post rejeitado");
  });
});
