import type { ContentIntensity } from "@/types/content";

export const brandRules = {
  name: "Astral Pessoal",
  promise: "clareza prática para decisões emocionais do dia a dia",
  voice: {
    base: "mística, direta, acolhedora e aplicável",
    avoid: ["fatalismo", "promessa absoluta", "jargão astrológico excessivo", "medo como venda"],
    vocabulary: ["clareza", "energia", "direção", "ritual", "sinal", "escolha", "presença"]
  },
  visual: {
    palette: {
      background: "#07070b",
      panel: "#171723",
      gold: "#d9b66d",
      violet: "#8f6ee8",
      teal: "#6bd4c8",
      rose: "#df8caa"
    },
    mood: "dark premium, místico moderno, editorial e limpo",
    avoid: ["neon excessivo", "bruxaria caricata", "poluição visual", "gradientes infantis"]
  },
  contentPrinciples: [
    "um insight por post",
    "começar pelo benefício emocional",
    "fechar com uma ação simples",
    "usar ciência base como lente, não como explicação longa"
  ]
} as const;

export const intensityRules: Record<ContentIntensity, { postsPerDay: number; tone: string; tokenCeiling: number }> = {
  leve: {
    postsPerDay: 2,
    tone: "leve, contemplativo e simples",
    tokenCeiling: 420
  },
  padrão: {
    postsPerDay: 3,
    tone: "prático, magnético e educativo",
    tokenCeiling: 520
  },
  intensa: {
    postsPerDay: 4,
    tone: "assertivo, altamente compartilhável e com CTAs mais presentes",
    tokenCeiling: 650
  }
};
