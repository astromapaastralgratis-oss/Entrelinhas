import { describe, expect, it } from "vitest";
import {
  applyLockedThemes,
  createGenerationCacheKey,
  getModeContentIntensity,
  planScheduledGenerations
} from "../../lib/automation-engine";
import { defaultAutomationSettings } from "../../lib/cost-control";
import type { EditorialPlanItem } from "../../types/content";

const item: EditorialPlanItem = {
  date: "2026-04-27",
  moment: "manhã",
  platform: "instagram",
  format: "carrossel",
  objective: "ganhar seguidores",
  scienceBase: "trânsito astral",
  theme: "energia da semana",
  hookType: "identificação emocional",
  ctaType: "seguir página",
  strategicReason: "Abertura da semana.",
  score: {
    follow: 9,
    save: 7,
    share: 8,
    comment: 5,
    bioClick: 3,
    repetitionRisk: 1,
    emotionalIntensity: 7
  }
};

describe("automation engine", () => {
  it("maps automation modes to editorial intensity", () => {
    expect(getModeContentIntensity("economico")).toBe("leve");
    expect(getModeContentIntensity("padrao")).toBe("padrão");
    expect(getModeContentIntensity("crescimento")).toBe("intensa");
  });

  it("creates stable cache keys per plan item and mode", () => {
    expect(createGenerationCacheKey(item, "economico")).toBe(createGenerationCacheKey(item, "economico"));
    expect(createGenerationCacheKey(item, "economico")).not.toBe(createGenerationCacheKey(item, "padrao"));
  });

  it("applies manually locked weekly themes", () => {
    const [locked] = applyLockedThemes([item], ["clareza emocional"]);

    expect(locked.theme).toBe("clareza emocional");
    expect(locked.strategicReason).toContain("Tema travado");
  });

  it("plans weekly and daily scheduled generations", () => {
    const schedule = planScheduledGenerations(new Date("2026-04-27T10:00:00-03:00"), {
      ...defaultAutomationSettings,
      automaticGenerationEnabled: true
    });

    expect(schedule).toHaveLength(2);
    expect(schedule.every((item) => item.enabled)).toBe(true);
    expect(schedule.map((item) => item.type)).toEqual(["weekly_plan", "daily_content"]);
  });
});
