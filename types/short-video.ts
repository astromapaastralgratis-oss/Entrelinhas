import type {
  EditorialCtaType,
  EditorialHookType,
  EditorialObjective,
  EditorialScienceBase
} from "@/types/content";

export type ShortVideoFormat =
  | "gancho_explicacao_cta"
  | "verdade_desconfortavel"
  | "pov_emocional"
  | "tarot_do_dia"
  | "numero_do_dia"
  | "transito_astral_simples"
  | "energia_da_semana"
  | "serie_educativa"
  | "mito_ou_verdade"
  | "se_voce_sentiu_isso_hoje";

export type ShortVideoIntent = "identificacao" | "educativo" | "cta_app" | "fechamento_reflexao";

export type ShortVideoSeries =
  | "Energia do Dia"
  | "Tarot que ninguém quer ouvir"
  | "Número do dia"
  | "O trânsito astral explicou"
  | "Sinais de que sua energia pediu pausa"
  | "Astrologia sem complicar"
  | "O que você sente tem pista";

export type ShortVideoBrief = {
  date: string;
  dayIndex: number;
  platform: "reels" | "tiktok";
  format: ShortVideoFormat;
  intent: ShortVideoIntent;
  series: ShortVideoSeries;
  objective: EditorialObjective;
  scienceBase: EditorialScienceBase;
  theme: string;
  hookType: EditorialHookType;
  ctaType: EditorialCtaType;
};

export type ShortVideoScript = {
  videoTitle: string;
  hook: string;
  script: string;
  sceneList: string[];
  screenTexts: string[];
  caption: string;
  hashtags: string[];
  cta: string;
  pinnedComment: string;
  series: ShortVideoSeries;
  format: ShortVideoFormat;
  intent: ShortVideoIntent;
  strategicReason: string;
};
