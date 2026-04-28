import { describe, expect, it } from "vitest";
import { calculatePerformanceScore, createLearningRecommendation, getWeeklyInsights } from "../../lib/performance-learning";
import type { PerformanceMetrics } from "../../types/performance";

const baseMetric: PerformanceMetrics = {
  id: "metric-1",
  publishedAt: "2026-04-27",
  format: "carrossel",
  platform: "instagram",
  theme: "energia da semana",
  scienceBase: "astrologia",
  objective: "ganhar seguidores",
  hookType: "identificação emocional",
  ctaType: "seguir página",
  visualStyle: "Cosmic Gold",
  moment: "manhã",
  views: 1000,
  likes: 100,
  comments: 20,
  saves: 60,
  shares: 50,
  newFollowers: 40,
  bioClicks: 10,
  qualitativeNote: "Gerou muitos compartilhamentos."
};

describe("performance learning", () => {
  it("calculates transparent rates and weighted score", () => {
    const score = calculatePerformanceScore(baseMetric);

    expect(score.saveRate).toBeCloseTo(0.06);
    expect(score.shareRate).toBeCloseTo(0.05);
    expect(score.commentRate).toBeCloseTo(0.02);
    expect(score.followerConversionRate).toBeCloseTo(0.04);
    expect(score.bioClickRate).toBeCloseTo(0.01);
    expect(score.performanceScore).toBeGreaterThan(0);
  });

  it("recommends the strongest pattern for next week", () => {
    const weakMetric = {
      ...baseMetric,
      id: "metric-2",
      theme: "conteúdo fraco",
      views: 1000,
      comments: 1,
      saves: 1,
      shares: 1,
      newFollowers: 1,
      bioClicks: 1
    };

    const recommendation = createLearningRecommendation([weakMetric, baseMetric]);

    expect(recommendation.format).toBe("carrossel");
    expect(recommendation.theme).toBe("energia da semana");
    expect(recommendation.reason).toContain("energia da semana");
  });

  it("builds weekly insights without AI", () => {
    const insights = getWeeklyInsights([baseMetric]);

    expect(insights.bestContent?.theme).toBe("energia da semana");
    expect(insights.bestScienceBase).toBe("astrologia");
    expect(insights.bestFormat).toBe("carrossel");
    expect(insights.recommendation).toContain("Recomendar mais conteúdos parecidos");
  });
});
