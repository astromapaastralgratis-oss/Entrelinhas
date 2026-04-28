import { describe, expect, it } from "vitest";
import { buildCompactTextPrompt, parseAiJson } from "../../lib/ai/text-generation";

describe("text generation service", () => {
  it("builds a compact provider-agnostic prompt without long branding", () => {
    const prompt = buildCompactTextPrompt({
      format: "carrossel",
      objective: "ganhar seguidores",
      scienceBase: "trânsito astral",
      theme: "energia da semana",
      hookType: "identificação emocional",
      moment: "manhã",
      cards: 6,
      ctaType: "seguir página",
      tone: "direto, EI, acessível",
      limits: {
        titleMaxWords: 12,
        subtitleMaxWords: 18
      }
    });

    expect(prompt.length).toBeLessThan(420);
    expect(prompt).toContain("JSON keys");
    expect(prompt).not.toContain("Você é o motor de copy do Astral Pessoal");
  });

  it("parses fenced JSON returned by providers", () => {
    const copy = parseAiJson(`\`\`\`json
{"title":"Energia da semana","subtitle":"Um sinal simples para hoje","slides":[],"caption":"Legenda com CTA.","hashtags":["#AstralPessoal","#Autoconhecimento","#Astrologia","#ClarezaEmocional","#EnergiaDoDia"],"cta":"Comente sua palavra.","pinnedComment":"Qual parte fez sentido?","qualityNotes":{"scrollStop":"gancho","identification":"tema","action":"cta"}}
\`\`\``);

    expect(copy.title).toBe("Energia da semana");
    expect(copy.qualityNotes.action).toBe("cta");
  });
});
