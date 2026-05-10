import { describe, expect, it } from "vitest";
import { parseExecutiveScriptSections, type ExecutiveScriptInput } from "@/lib/entrelinhas";
import {
  buildCompactExecutivePresenceContext,
  buildCompactExecutivePrompt,
  buildDeterministicExecutiveSections,
  composeExecutiveScript,
  mergeAiExecutiveJsonWithFallback
} from "@/src/lib/entrelinhas";

const input: ExecutiveScriptInput = {
  situation: "Definir limites",
  context: "Recebi um pedido urgente que conflita com entregas já combinadas.",
  desiredOutcome: "renegociar prioridade sem parecer pouco colaborativa",
  peopleInvolved: "minha liderança direta",
  tone: "Executivo"
};

describe("economic mentor deterministic layer", () => {
  it("builds a production-ready fallback with the eight expected sections", () => {
    const response = composeExecutiveScript(buildDeterministicExecutiveSections(input));
    const sections = parseExecutiveScriptSections(response);

    expect(sections).toHaveLength(8);
    expect(sections.every((section) => section.body && section.body !== "Ainda não gerado.")).toBe(true);
    expect(sections.map((section) => section.title)).toEqual([
      "Leitura estratégica",
      "Risco da situação",
      "Melhor postura",
      "O que NÃO dizer",
      "Script pronto para usar",
      "Versão curta",
      "Versão mais firme",
      "Próximo passo recomendado"
    ]);
  });

  it("keeps the compact prompt free from internal diagnostic data", () => {
    const fallback = buildDeterministicExecutiveSections(input);
    const executivePresence = buildCompactExecutivePresenceContext({ profile_id: "assertive_executor" });
    const prompt = buildCompactExecutivePrompt(input, fallback, executivePresence);

    expect(prompt).not.toContain("scores");
    expect(prompt).not.toContain("answers");
    expect(prompt).not.toContain("traitKey");
    expect(prompt).not.toContain("direction");
    expect(prompt).not.toContain("influence");
    expect(prompt).not.toContain("diplomacy");
    expect(prompt).not.toContain("precision");
  });

  it("incorporates valid AI JSON into the final numbered response", () => {
    const fallback = buildDeterministicExecutiveSections(input);
    const merged = mergeAiExecutiveJsonWithFallback(
      JSON.stringify({
        strategicReading: "A leitura adaptada pela IA deve aparecer aqui.",
        avoid: "Não abra com justificativas longas.",
        bestPosture: "Entre com clareza e ofereça uma decisão objetiva.",
        suggestedScript: "\"Consigo apoiar, desde que a prioridade seja revista com clareza.\"",
        shortVersion: "\"Posso assumir se realinharmos prioridade.\""
      }),
      fallback
    );
    const response = composeExecutiveScript(merged.sections);

    expect(merged.usedAiFields).toBe(true);
    expect(response).toContain("A leitura adaptada pela IA deve aparecer aqui.");
    expect(response).toContain("Não abra com justificativas longas.");
    expect(parseExecutiveScriptSections(response).map((section) => section.body)).not.toContain("Ainda não gerado.");
  });

  it("falls back only for invalid or oversized AI fields", () => {
    const fallback = buildDeterministicExecutiveSections(input);
    const merged = mergeAiExecutiveJsonWithFallback(
      JSON.stringify({
        strategicReading: "Leitura válida.",
        avoid: "",
        bestPosture: "x".repeat(800),
        suggestedScript: "\"Script válido e curto.\"",
        shortVersion: 42
      }),
      fallback
    );

    expect(merged.sections.strategicReading).toBe("Leitura válida.");
    expect(merged.sections.suggestedScript).toBe("\"Script válido e curto.\"");
    expect(merged.sections.avoid).toBe(fallback.avoid);
    expect(merged.sections.bestPosture).toBe(fallback.bestPosture);
    expect(merged.sections.shortVersion).toBe(fallback.shortVersion);
  });

  it("uses complete fallback when AI output is not valid JSON", () => {
    const fallback = buildDeterministicExecutiveSections(input);
    const merged = mergeAiExecutiveJsonWithFallback("texto fora do schema", fallback);

    expect(merged.usedAiFields).toBe(false);
    expect(merged.sections).toEqual(fallback);
  });
});
