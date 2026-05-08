import { describe, expect, it } from "vitest";
import { generateEditorialPlan, generateWeeklyEditorialPlan } from "../../lib/editorial-engine";
import type { ContentIntensity, EditorialPlanItem } from "../../types/content";

const expectedCountByIntensity: Record<ContentIntensity, number> = {
  leve: 4,
  padrão: 7,
  intensa: 11
};

describe("generateEditorialPlan", () => {
  it.each(Object.entries(expectedCountByIntensity) as Array<[ContentIntensity, number]>)(
    "generates the expected slot count for %s intensity",
    (intensity, expectedCount) => {
      const plan = generateEditorialPlan("2026-04-27", intensity, "ganhar seguidores", []);

      expect(plan).toHaveLength(expectedCount);
      expect(plan.every((item) => item.date === "2026-04-27")).toBe(true);
      expect(plan.every((item) => item.strategicReason.length > 60)).toBe(true);
    }
  );

  it("keeps the daily plan coherent by moment and avoids immediate fatigue", () => {
    const plan = generateEditorialPlan("2026-04-27", "intensa", "ganhar seguidores", []);

    expect(plan[0].moment).toBe("manhã");
    expect(plan.at(-1)?.moment).toBe("noite");
    expectNoImmediateRepeat(plan, "format");
    expectNoImmediateRepeat(plan, "objective");
    expectNoImmediateRepeat(plan, "scienceBase");
  });

  it("uses Monday distribution rules for week opening", () => {
    const plan = generateEditorialPlan("2026-04-27", "padrão", "ganhar seguidores", []);

    expect(plan[0]).toMatchObject({
      date: "2026-04-27",
      objective: "ganhar seguidores",
      scienceBase: "trânsito entrelinhas",
      theme: expect.stringContaining("energia da semana"),
      ctaType: "seguir página"
    });
  });

  it("returns strategic scores with all required growth signals", () => {
    const [first] = generateEditorialPlan("2026-04-28", "leve", "engajar", []);

    expect(first.score).toEqual(
      expect.objectContaining({
        follow: expect.any(Number),
        save: expect.any(Number),
        share: expect.any(Number),
        comment: expect.any(Number),
        bioClick: expect.any(Number),
        repetitionRisk: expect.any(Number),
        emotionalIntensity: expect.any(Number)
      })
    );
    expect(Object.values(first.score).every((score) => score >= 1 && score <= 10)).toBe(true);
  });

  it("preserves the explicit TikTok slot in intense plans", () => {
    const plan = generateEditorialPlan("2026-04-27", "intensa", "gerar autoridade", []);

    expect(plan.some((item) => item.platform === "tiktok" && item.format === "tiktok")).toBe(true);
  });

  it("uses history to avoid repeating tired choices at the next slot", () => {
    const plan = generateEditorialPlan("2026-04-29", "leve", "educar", [
      {
        date: "2026-04-28",
        moment: "noite",
        platform: "instagram",
        format: "feed",
        objective: "educar",
        scienceBase: "numerologia",
        theme: "decisão prática",
        hookType: "microensinamento",
        ctaType: "salvar"
      }
    ]);

    expect(plan[0].format).not.toBe("feed");
    expect(plan[0].objective).not.toBe("educar");
    expect(plan[0].scienceBase).not.toBe("numerologia");
  });
});

describe("generateWeeklyEditorialPlan", () => {
  it("generates a varied weekly plan with one rule-based block per day", () => {
    const weeklyPlan = generateWeeklyEditorialPlan("2026-04-27", "leve", "ganhar seguidores", []);

    expect(weeklyPlan).toHaveLength(28);
    expect(new Set(weeklyPlan.map((item) => item.date))).toHaveLength(7);
    expect(new Set(weeklyPlan.map((item) => item.theme.split(":")[0]))).toEqual(
      new Set([
        "energia da semana",
        "tarot do dia",
        "decisão prática",
        "astrologia educativa",
        "energia afetiva e social",
        "autoconhecimento leve",
        "fechamento da semana"
      ])
    );
  });
});

function expectNoImmediateRepeat<T extends keyof EditorialPlanItem>(plan: EditorialPlanItem[], key: T) {
  plan.forEach((item, index) => {
    const previous = plan[index - 1];
    if (!previous) return;

    expect(item[key]).not.toBe(previous[key]);
  });
}
