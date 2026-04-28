import { describe, expect, it } from "vitest";
import { checkRepetitionRisk, getCtaVariant } from "../../lib/content-persistence";
import type { EditorialHistoryItem, EditorialPlanItem } from "../../types/content";

const baseCandidate: EditorialPlanItem = {
  date: "2026-04-27",
  moment: "manhã",
  platform: "instagram",
  format: "carrossel",
  objective: "ganhar seguidores",
  scienceBase: "trânsito astral",
  theme: "energia da semana: direção do dia",
  hookType: "identificação emocional",
  ctaType: "seguir página",
  strategicReason: "Conteúdo de abertura da semana com alto potencial de identificação.",
  score: {
    follow: 9,
    save: 7,
    share: 8,
    comment: 5,
    bioClick: 3,
    repetitionRisk: 2,
    emotionalIntensity: 8
  }
};

describe("checkRepetitionRisk", () => {
  it("blocks same format in sequence on the same day and same science consecutively", () => {
    const history: EditorialHistoryItem[] = [
      {
        date: "2026-04-27",
        moment: "manhã",
        platform: "instagram",
        format: "carrossel",
        objective: "educar",
        scienceBase: "trânsito astral",
        theme: "outro tema",
        hookType: "curiosidade",
        ctaType: "salvar"
      }
    ];

    const result = checkRepetitionRisk(baseCandidate, history);

    expect(result.allowed).toBe(false);
    expect(result.violations).toContain("Mesmo formato em sequência no mesmo dia.");
    expect(result.violations).toContain("Mesma ciência base em conteúdos consecutivos.");
  });

  it("blocks CTA fatigue after two daily uses, except follow CTA as a warning", () => {
    const history: EditorialHistoryItem[] = [
      makeHistory("2026-04-27", "stories", "comentar"),
      makeHistory("2026-04-27", "feed", "comentar")
    ];

    const commentCandidate = { ...baseCandidate, ctaType: "comentar" as const, format: "reels" as const };
    const followCandidate = { ...baseCandidate, ctaType: "seguir página" as const, format: "reels" as const };
    const followHistory = [
      makeHistory("2026-04-27", "stories", "seguir página"),
      makeHistory("2026-04-27", "feed", "seguir página")
    ];

    expect(checkRepetitionRisk(commentCandidate, history).violations).toContain("Mesmo CTA usado mais de 2 vezes no dia.");
    expect(checkRepetitionRisk(followCandidate, followHistory).warnings).toContain("CTA de seguir pode repetir, mas a frase deve variar.");
  });

  it("blocks hook fatigue in the week and recent non-recurring themes", () => {
    const history: EditorialHistoryItem[] = [
      { ...makeHistory("2026-04-25", "feed", "salvar"), hookType: "identificação emocional" },
      { ...makeHistory("2026-04-26", "stories", "comentar"), hookType: "identificação emocional" },
      { ...makeHistory("2026-04-26", "reels", "compartilhar"), theme: baseCandidate.theme }
    ];

    const result = checkRepetitionRisk(baseCandidate, history);

    expect(result.allowed).toBe(false);
    expect(result.violations).toContain("Mesmo tipo de gancho usado mais de 2 vezes na semana.");
    expect(result.violations).toContain("Mesmo tema usado nos últimos 7 dias.");
  });
});

describe("getCtaVariant", () => {
  it("varies follow CTA copy before reusing the first text", () => {
    const first = getCtaVariant("seguir página", []);
    const second = getCtaVariant("seguir página", [first]);

    expect(second).not.toBe(first);
    expect(getCtaVariant("seguir página", [first, second])).toBeTruthy();
  });
});

function makeHistory(date: string, format: EditorialHistoryItem["format"], ctaType: EditorialHistoryItem["ctaType"]): EditorialHistoryItem {
  return {
    date,
    moment: "noite",
    platform: "instagram",
    format,
    objective: "engajar",
    scienceBase: "tarot",
    theme: `${format}-${ctaType}`,
    hookType: "curiosidade",
    ctaType
  };
}
