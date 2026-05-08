import type {
  ContentFormat,
  ContentObjective,
  ContentPillar,
  ContentScience,
  HookType,
  PostStructure,
  VisualStyle
} from "@/types/content";

export const contentFormats: ContentFormat[] = ["feed", "carrossel", "stories", "reels_tiktok"];

export const objectiveRotation: ContentObjective[] = [
  "ganhar seguidores",
  "engajamento",
  "tráfego para app",
  "venda/relatório",
  "autoridade",
  "educação"
];

export const scienceRotation: ContentScience[] = [
  "astrologia",
  "tarot",
  "numerologia",
  "elemento do dia",
  "cor do dia",
  "cristal do dia",
  "energia emocional",
  "trânsito entrelinhas da semana"
];

export const pillarRotation: ContentPillar[] = [
  "post emocional",
  "post educativo",
  "post salvável",
  "post compartilhável",
  "CTA app"
];

export const hookTemplates: Record<HookType, string[]> = {
  identificação: [
    "Se hoje você acordou sentindo {emotion}, observe este sinal.",
    "Talvez não seja falta de foco. Pode ser {theme} pedindo direção."
  ],
  curiosidade: [
    "A energia de hoje favorece uma escolha que quase ninguém percebe.",
    "O detalhe entrelinhas desta semana explica por que {theme} está tão presente."
  ],
  contraste: [
    "O que parece atraso pode ser ajuste de rota.",
    "Nem toda intensidade é alerta. Às vezes, é convite para decidir."
  ],
  salvável: [
    "Salve este ritual rápido para quando {theme} aparecer.",
    "Checklist entrelinhas do dia para voltar ao centro em poucos minutos."
  ],
  compartilhável: [
    "Envie para alguém que precisa transformar confusão em clareza hoje.",
    "Se isso descreve alguém perto de você, este post é um sinal."
  ],
  autoridade: [
    "Na leitura simbólica de hoje, {science} aponta para uma decisão prática.",
    "O padrão energético da semana mostra onde ajustar expectativa e ação."
  ]
};

export const hookRotation: HookType[] = [
  "identificação",
  "curiosidade",
  "contraste",
  "salvável",
  "compartilhável",
  "autoridade"
];

export const structuresByFormat: Record<ContentFormat, PostStructure[]> = {
  feed: ["insight_pratico", "diagnostico_emocional", "mito_verdade"],
  carrossel: ["passo_a_passo", "checklist", "mito_verdade"],
  stories: ["diagnostico_emocional", "insight_pratico", "checklist"],
  reels_tiktok: ["roteiro_curto", "mito_verdade", "insight_pratico"]
};

export const ctaTemplates: Record<ContentObjective, string[]> = {
  "ganhar seguidores": ["Siga a Entrelinhas para receber sua direção do dia."],
  engajamento: ["Comente a palavra que define sua energia de hoje."],
  "tráfego para app": ["Abra o app para ver sua leitura completa do dia."],
  "venda/relatório": ["Gere seu relatório Entrelinhas e veja seus próximos sinais."],
  autoridade: ["Salve para consultar quando a energia da semana mudar."],
  educação: ["Compartilhe com quem está aprendendo a ler os próprios ciclos."]
};

export const visualStyles: VisualStyle[] = [
  "noite_mistica",
  "editorial_dourado",
  "tarot_moderno",
  "cristal_luminoso",
  "calendario_entrelinhas"
];

export const themeBank = [
  "clareza antes de responder",
  "limites emocionais",
  "energia de recomeço",
  "decisão adiada",
  "autoconfiança prática",
  "ritual de foco",
  "sinais de esgotamento",
  "abertura para receber",
  "organização da intuição",
  "coragem para simplificar"
];
