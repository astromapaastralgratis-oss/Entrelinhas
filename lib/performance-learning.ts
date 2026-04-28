import type { PerformanceIndicators, PerformanceMetrics, WeeklyInsights, LearningRecommendation } from "@/types/performance";

export function calculatePerformanceScore(metrics: PerformanceMetrics): PerformanceIndicators {
  const views = Math.max(metrics.views, 1);
  const saveRate = metrics.saves / views;
  const shareRate = metrics.shares / views;
  const commentRate = metrics.comments / views;
  const followerConversionRate = metrics.newFollowers / views;
  const bioClickRate = metrics.bioClicks / views;

  const weightedRaw =
    normalized(metrics.newFollowers, views) * 30 +
    normalized(metrics.shares, views) * 25 +
    normalized(metrics.saves, views) * 20 +
    normalized(metrics.comments, views) * 15 +
    normalized(metrics.bioClicks, views) * 10;

  return {
    saveRate,
    shareRate,
    commentRate,
    followerConversionRate,
    bioClickRate,
    performanceScore: Math.round(Math.min(100, weightedRaw))
  };
}

export function createLearningRecommendation(metrics: PerformanceMetrics[]): LearningRecommendation {
  if (metrics.length === 0) {
    return {
      reason: "Ainda não há dados suficientes. Registre ao menos um conteúdo para iniciar o aprendizado."
    };
  }

  const top = [...metrics].sort((a, b) => calculatePerformanceScore(b).performanceScore - calculatePerformanceScore(a).performanceScore)[0];

  return {
    format: top.format,
    theme: top.theme,
    scienceBase: top.scienceBase,
    hookType: top.hookType,
    ctaType: top.ctaType,
    visualStyle: top.visualStyle,
    moment: top.moment,
    reason: `Recomendar mais conteúdos parecidos com "${top.theme}", pois teve score ${calculatePerformanceScore(top).performanceScore}/100.`
  };
}

export function getWeeklyInsights(metrics: PerformanceMetrics[]): WeeklyInsights {
  if (metrics.length === 0) {
    return {
      recommendation: "Registre performances manuais para gerar insights semanais."
    };
  }

  const ranked = [...metrics].sort((a, b) => calculatePerformanceScore(b).performanceScore - calculatePerformanceScore(a).performanceScore);
  const recommendation = createLearningRecommendation(metrics);

  return {
    bestContent: ranked[0],
    worstContent: ranked.at(-1),
    bestScienceBase: bestByGroup(metrics, (item) => item.scienceBase),
    bestFormat: bestByGroup(metrics, (item) => item.format),
    bestCta: bestByGroup(metrics, (item) => item.ctaType),
    bestMoment: bestByGroup(metrics, (item) => item.moment),
    recommendation: recommendation.reason
  };
}

function bestByGroup(metrics: PerformanceMetrics[], getKey: (item: PerformanceMetrics) => string) {
  const groups = new Map<string, { score: number; count: number }>();

  metrics.forEach((metric) => {
    const key = getKey(metric);
    const current = groups.get(key) ?? { score: 0, count: 0 };
    groups.set(key, {
      score: current.score + calculatePerformanceScore(metric).performanceScore,
      count: current.count + 1
    });
  });

  return Array.from(groups.entries())
    .sort(([, a], [, b]) => b.score / b.count - a.score / a.count)
    .at(0)?.[0];
}

function normalized(value: number, views: number) {
  return Math.min(1, value / views / 0.08);
}
