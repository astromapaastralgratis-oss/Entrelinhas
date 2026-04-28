import type { EditorialCtaType, EditorialHookType, EditorialObjective, EditorialScienceBase } from "@/types/content";
import type {
  ShortVideoBrief,
  ShortVideoFormat,
  ShortVideoIntent,
  ShortVideoScript,
  ShortVideoSeries
} from "@/types/short-video";

const weeklyIntentPattern: ShortVideoIntent[] = [
  "identificacao",
  "educativo",
  "identificacao",
  "educativo",
  "cta_app",
  "identificacao",
  "fechamento_reflexao"
];

const formatByIntent: Record<ShortVideoIntent, ShortVideoFormat[]> = {
  identificacao: ["pov_emocional", "verdade_desconfortavel", "se_voce_sentiu_isso_hoje"],
  educativo: ["transito_astral_simples", "serie_educativa", "mito_ou_verdade", "numero_do_dia"],
  cta_app: ["gancho_explicacao_cta", "tarot_do_dia"],
  fechamento_reflexao: ["energia_da_semana", "se_voce_sentiu_isso_hoje"]
};

const seriesByFormat: Record<ShortVideoFormat, ShortVideoSeries> = {
  gancho_explicacao_cta: "Energia do Dia",
  verdade_desconfortavel: "Tarot que ninguém quer ouvir",
  pov_emocional: "O que você sente tem pista",
  tarot_do_dia: "Tarot que ninguém quer ouvir",
  numero_do_dia: "Número do dia",
  transito_astral_simples: "O trânsito astral explicou",
  energia_da_semana: "Energia do Dia",
  serie_educativa: "Astrologia sem complicar",
  mito_ou_verdade: "Astrologia sem complicar",
  se_voce_sentiu_isso_hoje: "Sinais de que sua energia pediu pausa"
};

const scienceByFormat: Record<ShortVideoFormat, EditorialScienceBase> = {
  gancho_explicacao_cta: "energia emocional",
  verdade_desconfortavel: "tarot",
  pov_emocional: "energia emocional",
  tarot_do_dia: "tarot",
  numero_do_dia: "numerologia",
  transito_astral_simples: "trânsito astral",
  energia_da_semana: "astrologia",
  serie_educativa: "astrologia",
  mito_ou_verdade: "astrologia",
  se_voce_sentiu_isso_hoje: "energia emocional"
};

const objectiveByIntent: Record<ShortVideoIntent, EditorialObjective> = {
  identificacao: "ganhar seguidores",
  educativo: "educar",
  cta_app: "levar para app",
  fechamento_reflexao: "engajar"
};

const ctaByIntent: Record<ShortVideoIntent, EditorialCtaType> = {
  identificacao: "comentar",
  educativo: "seguir página",
  cta_app: "acessar link na bio",
  fechamento_reflexao: "comentar"
};

const hookByIntent: Record<ShortVideoIntent, EditorialHookType> = {
  identificacao: "identificação emocional",
  educativo: "microensinamento",
  cta_app: "curiosidade",
  fechamento_reflexao: "pergunta direta"
};

export const shortVideoSeries: ShortVideoSeries[] = [
  "Energia do Dia",
  "Tarot que ninguém quer ouvir",
  "Número do dia",
  "O trânsito astral explicou",
  "Sinais de que sua energia pediu pausa",
  "Astrologia sem complicar",
  "O que você sente tem pista"
];

export function generateWeeklyShortVideoPlan(startDate: Date | string = new Date()): ShortVideoScript[] {
  const start = toDate(startDate);

  return weeklyIntentPattern.map((intent, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return generateShortVideoScript(createShortVideoBrief(date, intent, index));
  });
}

export function createShortVideoBrief(date: Date | string, intent: ShortVideoIntent, dayIndex = 0): ShortVideoBrief {
  const formatOptions = formatByIntent[intent];
  const format = formatOptions[dayIndex % formatOptions.length];

  return {
    date: toIsoDate(toDate(date)),
    dayIndex,
    platform: dayIndex % 2 === 0 ? "reels" : "tiktok",
    format,
    intent,
    series: seriesByFormat[format],
    objective: objectiveByIntent[intent],
    scienceBase: scienceByFormat[format],
    theme: buildTheme(format, intent),
    hookType: hookByIntent[intent],
    ctaType: ctaByIntent[intent]
  };
}

export function generateShortVideoScript(brief: ShortVideoBrief): ShortVideoScript {
  const hook = trimWords(buildHook(brief), 12);
  const insight = buildInsight(brief);
  const cta = buildCta(brief.ctaType);
  const screenTexts = [
    trimWords(hook, 9),
    trimWords(insight, 10),
    trimWords(cta, 8)
  ];

  return {
    videoTitle: `${brief.series}: ${brief.theme}`,
    hook,
    script: [
      hook,
      buildDevelopment(brief),
      `A virada é simples: ${insight}`,
      cta
    ].join("\n"),
    sceneList: [
      "Close no rosto, primeira frase sem introdução.",
      "Corte seco para a explicação em uma frase curta.",
      "Texto grande na tela com a virada do vídeo.",
      "CTA olhando para a câmera e pergunta nos comentários."
    ],
    screenTexts,
    caption: `${hook}\n\n${brief.theme}. Se isso fez sentido, comenta uma palavra para o seu dia.\n\n${cta}`,
    hashtags: buildHashtags(brief),
    cta,
    pinnedComment: buildPinnedComment(brief),
    series: brief.series,
    format: brief.format,
    intent: brief.intent,
    strategicReason: buildStrategicReason(brief)
  };
}

export function countWeeklyVideoIntents(videos: ShortVideoScript[]) {
  return videos.reduce<Record<ShortVideoIntent, number>>(
    (counts, video) => {
      counts[video.intent] += 1;
      return counts;
    },
    { identificacao: 0, educativo: 0, cta_app: 0, fechamento_reflexao: 0 }
  );
}

function buildHook(brief: ShortVideoBrief) {
  const hooks: Record<ShortVideoFormat, string> = {
    gancho_explicacao_cta: "Você não precisa entender tudo hoje.",
    verdade_desconfortavel: "Talvez o sinal não seja sobre esperar.",
    pov_emocional: "POV: sua energia cansou de insistir.",
    tarot_do_dia: "A carta de hoje pede uma escolha menor.",
    numero_do_dia: "O número do dia fala sobre direção.",
    transito_astral_simples: "O céu explicou essa inquietação.",
    energia_da_semana: "A semana começa pedindo presença.",
    serie_educativa: "Astrologia não precisa ser complicada.",
    mito_ou_verdade: "Mito ou verdade: signo define tudo?",
    se_voce_sentiu_isso_hoje: "Se você sentiu isso hoje, observa."
  };

  return hooks[brief.format];
}

function buildDevelopment(brief: ShortVideoBrief) {
  const base: Record<EditorialScienceBase, string> = {
    astrologia: "A astrologia aqui funciona como mapa, não como sentença.",
    tarot: "O tarot aponta uma imagem para você pensar melhor.",
    numerologia: "A numerologia organiza o tom do dia em uma direção prática.",
    elemento: "O elemento do dia mostra onde sua energia pede ajuste.",
    cor: "A cor do dia ajuda a lembrar uma intenção simples.",
    cristal: "O cristal entra como símbolo de foco, não como promessa.",
    "energia emocional": "Sua emoção pode ser pista, mas não precisa mandar em tudo.",
    "trânsito astral": "O trânsito astral mostra clima, não destino fechado."
  };

  return `${base[brief.scienceBase]} ${brief.theme}.`;
}

function buildInsight(brief: ShortVideoBrief) {
  const insights: Record<ShortVideoIntent, string> = {
    identificacao: "nem toda urgência merece sua entrega",
    educativo: "um símbolo bom vira ação pequena",
    cta_app: "quando você nomeia o padrão, escolhe melhor",
    fechamento_reflexao: "fechar o ciclo também é direção"
  };

  return insights[brief.intent];
}

function buildTheme(format: ShortVideoFormat, intent: ShortVideoIntent) {
  const themes: Record<ShortVideoFormat, string> = {
    gancho_explicacao_cta: "clareza emocional para abrir o app",
    verdade_desconfortavel: "o conselho que incomoda porque faz sentido",
    pov_emocional: "quando insistir começa a pesar",
    tarot_do_dia: "um símbolo para decidir sem pressa",
    numero_do_dia: "direção prática em um número",
    transito_astral_simples: "o clima astral sem complicar",
    energia_da_semana: "fechamento e preparação energética",
    serie_educativa: "um conceito explicado em 20 segundos",
    mito_ou_verdade: "astrologia sem fatalismo",
    se_voce_sentiu_isso_hoje: "uma pista emocional do dia"
  };

  return intent === "fechamento_reflexao" ? "reflexão para fechar o ciclo" : themes[format];
}

function buildCta(ctaType: EditorialCtaType) {
  const ctas: Record<EditorialCtaType, string> = {
    "seguir página": "Segue para mais clareza prática.",
    salvar: "Salva para rever depois.",
    compartilhar: "Envia para quem sentiria isso.",
    comentar: "Comenta a palavra que veio aí.",
    "acessar link na bio": "Vai no link da bio e abre sua leitura.",
    "gerar relatório no app": "Gera seu relatório no app."
  };

  return ctas[ctaType];
}

function buildPinnedComment(brief: ShortVideoBrief) {
  if (brief.intent === "educativo") return "Quer parte 2 dessa série?";
  if (brief.intent === "cta_app") return "Você usaria isso para decidir o dia?";
  return "Qual frase bateu mais forte em você?";
}

function buildHashtags(brief: ShortVideoBrief) {
  const scienceTag: Record<EditorialScienceBase, string> = {
    astrologia: "#Astrologia",
    tarot: "#TarotDoDia",
    numerologia: "#Numerologia",
    elemento: "#EnergiaDoDia",
    cor: "#CorDoDia",
    cristal: "#Cristais",
    "energia emocional": "#ClarezaEmocional",
    "trânsito astral": "#TransitoAstral"
  };

  return ["#AstralPessoal", "#Autoconhecimento", scienceTag[brief.scienceBase], "#ReelsBrasil", "#TikTokBrasil", "#EnergiaDoDia"];
}

function buildStrategicReason(brief: ShortVideoBrief) {
  const reasons: Record<ShortVideoIntent, string> = {
    identificacao: "Vídeo de identificação para retenção inicial, comentários e ganho de seguidores por reconhecimento imediato.",
    educativo: "Vídeo educativo curto para autoridade e recorrência de série sem parecer aula longa.",
    cta_app: "Vídeo com CTA leve para transformar curiosidade em tráfego para o app.",
    fechamento_reflexao: "Vídeo de fechamento para criar ritual semanal e conversa nos comentários."
  };

  return reasons[brief.intent];
}

function trimWords(text: string, maxWords: number) {
  return text.split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function toDate(date: Date | string) {
  return typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
