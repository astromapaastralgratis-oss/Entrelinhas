import { describe, expect, it } from "vitest";
import { validateGeneratedContent } from "../../lib/content-validation";
import type { GeneratedCopy } from "../../types/copy";

const validCopy: GeneratedCopy = {
  title: "Hoje sua energia pede pausa",
  subtitle: "Nem toda urgência merece sua entrega",
  slides: [],
  caption: "Uma legenda direta com conexão emocional e CTA claro.",
  hashtags: ["#AstralPessoal", "#Autoconhecimento", "#Astrologia", "#ClarezaEmocional", "#EnergiaDoDia"],
  cta: "Comente sua palavra do dia.",
  pinnedComment: "Qual frase fez sentido?",
  qualityNotes: {
    scrollStop: "Gancho direto.",
    identification: "Tema reconhecível.",
    action: "CTA claro."
  }
};

describe("validateGeneratedContent", () => {
  it("accepts safe generated content with CTA, caption, hashtags and visual ratio", () => {
    const result = validateGeneratedContent({
      copy: validCopy,
      visualPrompts: [{ ratio: "9:16" }],
      theme: "clareza emocional"
    });

    expect(result.valid).toBe(true);
    expect(result.blocked).toBe(false);
    expect(result.checks).toMatchObject({
      titleWordCount: true,
      subtitleWordCount: true,
      hasCTA: true,
      hasCaption: true,
      hasHashtags: true,
      noMedicalPromise: true,
      noAbsolutePrediction: true,
      noPsychologicalDiagnosis: true,
      noGenericCopy: true,
      noRepeatedTheme: true,
      visualPromptHasRatio: true
    });
  });

  it("blocks long image text", () => {
    const result = validateGeneratedContent({
      copy: {
        ...validCopy,
        title: "Hoje sua energia pede pausa antes de tomar qualquer decisão importante no dia",
        subtitle: "Um subtítulo longo demais para caber com segurança em uma imagem vertical de rede social sem quebrar texto no mobile"
      }
    });

    expect(result.blocked).toBe(true);
    expect(result.errors).toContain("Título excede 12 palavras.");
    expect(result.errors).toContain("Subtítulo excede 18 palavras.");
  });

  it("blocks medical promises and absolute predictions", () => {
    const result = validateGeneratedContent({
      copy: {
        ...validCopy,
        caption: "Esse ritual cura sua ansiedade com certeza e vai acontecer sem erro."
      }
    });

    expect(result.blocked).toBe(true);
    expect(result.checks.noMedicalPromise).toBe(false);
    expect(result.checks.noAbsolutePrediction).toBe(false);
  });

  it("blocks psychological diagnosis and generic copy", () => {
    const result = validateGeneratedContent({
      copy: {
        ...validCopy,
        caption: "Você tem ansiedade. Confira agora esse conteúdo incrível."
      }
    });

    expect(result.blocked).toBe(true);
    expect(result.checks.noPsychologicalDiagnosis).toBe(false);
    expect(result.checks.noGenericCopy).toBe(false);
  });

  it("signals repeated themes and rejects visual prompts without ratio", () => {
    const result = validateGeneratedContent({
      copy: validCopy,
      theme: "energia da semana",
      recentHistory: [
        {
          date: "2026-04-26",
          moment: "noite",
          platform: "instagram",
          format: "stories",
          objective: "engajar",
          scienceBase: "tarot",
          theme: "energia da semana",
          hookType: "curiosidade",
          ctaType: "comentar"
        }
      ],
      visualPrompts: [{}]
    });

    expect(result.checks.noRepeatedTheme).toBe(false);
    expect(result.checks.visualPromptHasRatio).toBe(false);
    expect(result.blocked).toBe(true);
  });
});
