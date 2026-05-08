export type ContentFormat =
  | "feed"
  | "carrossel"
  | "stories"
  | "reels_tiktok";

export type ContentObjective =
  | "ganhar seguidores"
  | "engajamento"
  | "tráfego para app"
  | "venda/relatório"
  | "autoridade"
  | "educação";

export type ContentIntensity = "leve" | "padrão" | "intensa";

export type ContentScience =
  | "astrologia"
  | "tarot"
  | "numerologia"
  | "elemento do dia"
  | "cor do dia"
  | "cristal do dia"
  | "energia emocional"
  | "trânsito entrelinhas da semana";

export type HookType =
  | "identificação"
  | "curiosidade"
  | "contraste"
  | "salvável"
  | "compartilhável"
  | "autoridade";

export type PostStructure =
  | "insight_pratico"
  | "passo_a_passo"
  | "roteiro_curto"
  | "checklist"
  | "mito_verdade"
  | "diagnostico_emocional";

export type VisualStyle =
  | "noite_mistica"
  | "editorial_dourado"
  | "tarot_moderno"
  | "cristal_luminoso"
  | "calendario_entrelinhas";

export type ContentPillar =
  | "CTA app"
  | "post educativo"
  | "post emocional"
  | "post salvável"
  | "post compartilhável";

export type PlannedContent = {
  id: string;
  date: string;
  platform: "Instagram" | "TikTok" | "Instagram + TikTok";
  format: ContentFormat;
  objective: ContentObjective;
  science: ContentScience;
  pillar: ContentPillar;
  hookType: HookType;
  hook: string;
  theme: string;
  title: string;
  cta: string;
  structure: PostStructure;
  visualStyle: VisualStyle;
  strategicReason: string;
  compactAiBrief: CompactAiBrief;
};

export type CompactAiBrief = {
  brand: "Entrelinhas";
  format: ContentFormat;
  objective: ContentObjective;
  science: ContentScience;
  pillar: ContentPillar;
  theme: string;
  hookType: HookType;
  tone: string;
  outputFields: Array<"hook" | "caption" | "slides" | "script" | "visual_prompt" | "cta">;
  maxTokens: number;
};

export type GenerationSettings = {
  intensity: ContentIntensity;
  primaryObjective: ContentObjective;
};

export type ContentHistoryItem = Pick<
  PlannedContent,
  "id" | "date" | "format" | "objective" | "science" | "hookType" | "theme" | "cta"
>;

export type WeeklyPlan = {
  startDate: string;
  days: Array<{
    date: string;
    items: PlannedContent[];
  }>;
};

export type EditorialMoment = "manhã" | "tarde" | "noite";

export type EditorialObjective =
  | "ganhar seguidores"
  | "engajar"
  | "levar para app"
  | "educar"
  | "gerar autoridade";

export type EditorialFormat = "feed" | "carrossel" | "stories" | "reels" | "tiktok";

export type EditorialScienceBase =
  | "astrologia"
  | "tarot"
  | "numerologia"
  | "elemento"
  | "cor"
  | "cristal"
  | "energia emocional"
  | "trânsito entrelinhas";

export type EditorialHookType =
  | "identificação emocional"
  | "verdade desconfortável"
  | "quebra de padrão"
  | "curiosidade"
  | "pergunta direta"
  | "microensinamento"
  | "alerta simbólico";

export type EditorialCtaType =
  | "seguir página"
  | "salvar"
  | "compartilhar"
  | "comentar"
  | "acessar link na bio"
  | "gerar relatório no app";

export type EditorialPlatform = "instagram" | "tiktok";

export type EditorialScore = {
  follow: number;
  save: number;
  share: number;
  comment: number;
  bioClick: number;
  repetitionRisk: number;
  emotionalIntensity: number;
};

export type EditorialPlanItem = {
  date: string;
  moment: EditorialMoment;
  platform: EditorialPlatform;
  format: EditorialFormat;
  objective: EditorialObjective;
  scienceBase: EditorialScienceBase;
  theme: string;
  hookType: EditorialHookType;
  ctaType: EditorialCtaType;
  strategicReason: string;
  score: EditorialScore;
};

export type EditorialHistoryItem = Pick<
  EditorialPlanItem,
  "date" | "moment" | "platform" | "format" | "objective" | "scienceBase" | "theme" | "hookType" | "ctaType"
>;
