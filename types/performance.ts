import type {
  EditorialCtaType,
  EditorialFormat,
  EditorialHookType,
  EditorialMoment,
  EditorialObjective,
  EditorialPlatform,
  EditorialScienceBase
} from "@/types/content";

export type PerformanceMetrics = {
  id: string;
  publishedAt: string;
  format: EditorialFormat;
  platform: EditorialPlatform;
  theme: string;
  scienceBase: EditorialScienceBase;
  objective: EditorialObjective;
  hookType: EditorialHookType;
  ctaType: EditorialCtaType;
  visualStyle: string;
  moment: EditorialMoment;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  newFollowers: number;
  bioClicks: number;
  qualitativeNote: string;
};

export type PerformanceIndicators = {
  saveRate: number;
  shareRate: number;
  commentRate: number;
  followerConversionRate: number;
  bioClickRate: number;
  performanceScore: number;
};

export type WeeklyInsights = {
  bestContent?: PerformanceMetrics;
  worstContent?: PerformanceMetrics;
  bestScienceBase?: string;
  bestFormat?: string;
  bestCta?: string;
  bestMoment?: string;
  recommendation: string;
};

export type LearningRecommendation = {
  format?: EditorialFormat;
  theme?: string;
  scienceBase?: EditorialScienceBase;
  hookType?: EditorialHookType;
  ctaType?: EditorialCtaType;
  visualStyle?: string;
  moment?: EditorialMoment;
  reason: string;
};
