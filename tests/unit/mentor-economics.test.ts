import { describe, expect, it } from "vitest";
import { parseExecutiveScriptSections, type ExecutiveScriptInput } from "@/lib/entrelinhas";
import {
  buildDeterministicExecutiveSections,
  buildMentorEconomicsMetadata,
  composeExecutiveScript,
  estimateTokens,
  getUtcDayStart,
  hasReachedDailyAiLimit
} from "@/src/lib/entrelinhas";

const input: ExecutiveScriptInput = {
  situation: "Fui interrompida",
  context: "Fui cortada durante uma reunião com liderança.",
  desiredOutcome: "retomar minha fala sem criar tensão",
  peopleInvolved: "pares e liderança",
  tone: "Executivo"
};

describe("mentor economics", () => {
  it("estimates tokens locally from text length", () => {
    expect(estimateTokens("1234")).toBe(1);
    expect(estimateTokens("12345")).toBe(2);
    expect(estimateTokens("")).toBe(0);
  });

  it("uses UTC day start consistently", () => {
    const utcStart = getUtcDayStart(new Date("2026-05-09T23:45:30.000Z"));

    expect(utcStart.toISOString()).toBe("2026-05-09T00:00:00.000Z");
  });

  it("decides daily AI limit using ai usage count", () => {
    expect(hasReachedDailyAiLimit(4, 5)).toBe(false);
    expect(hasReachedDailyAiLimit(5, 5)).toBe(true);
    expect(hasReachedDailyAiLimit(6, 5)).toBe(true);
  });

  it("keeps deterministic fallback complete for daily limit flow", () => {
    const response = composeExecutiveScript(buildDeterministicExecutiveSections(input));
    const sections = parseExecutiveScriptSections(response);

    expect(sections).toHaveLength(8);
    expect(sections.every((section) => section.body && section.body !== "Ainda não gerado.")).toBe(true);
  });

  it("builds invisible metadata without changing the user-facing response", () => {
    const responseText = composeExecutiveScript(buildDeterministicExecutiveSections(input));
    const metadata = buildMentorEconomicsMetadata({
      generationMode: "deterministic_fallback",
      fallbackUsed: true,
      promptText: "deterministic_fallback",
      responseText,
      dailyAiLimitReached: true
    });

    expect(metadata.generationMode).toBe("deterministic_fallback");
    expect(metadata.fallbackUsed).toBe(true);
    expect(metadata.dailyAiLimitReached).toBe(true);
    expect(metadata.promptTokensEstimate).toBeGreaterThan(0);
    expect(metadata.completionTokensEstimate).toBeGreaterThan(0);
    expect(metadata.totalTokensEstimate).toBe(metadata.promptTokensEstimate + metadata.completionTokensEstimate);
  });
});
