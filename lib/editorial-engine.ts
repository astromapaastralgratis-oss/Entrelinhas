import type {
  ContentIntensity,
  EditorialCtaType,
  EditorialFormat,
  EditorialHistoryItem,
  EditorialHookType,
  EditorialMoment,
  EditorialObjective,
  EditorialPlanItem,
  EditorialPlatform,
  EditorialScienceBase,
  EditorialScore
} from "@/types/content";

type DayRule = {
  theme: string;
  scienceBases: EditorialScienceBase[];
  objective: EditorialObjective;
  preferredFormats: EditorialFormat[];
  hookTypes: EditorialHookType[];
  ctaTypes: EditorialCtaType[];
  reason: string;
};

type SlotTemplate = {
  moment: EditorialMoment;
  platform: EditorialPlatform;
  format: EditorialFormat;
  objectiveBias?: EditorialObjective;
  ctaBias?: EditorialCtaType;
};

const dayRules: Record<number, DayRule> = {
  0: {
    theme: "fechamento da semana",
    scienceBases: ["energia emocional", "cristal", "astrologia"],
    objective: "engajar",
    preferredFormats: ["feed", "stories", "reels"],
    hookTypes: ["pergunta direta", "identificação emocional", "microensinamento"],
    ctaTypes: ["comentar", "salvar", "seguir página"],
    reason: "Fechamento reflexivo prepara a audiência para recomeçar com intenção."
  },
  1: {
    theme: "energia da semana",
    scienceBases: ["trânsito astral", "astrologia", "energia emocional"],
    objective: "ganhar seguidores",
    preferredFormats: ["carrossel", "reels", "feed"],
    hookTypes: ["identificação emocional", "curiosidade", "alerta simbólico"],
    ctaTypes: ["seguir página", "compartilhar", "salvar"],
    reason: "Abertura de semana com alto potencial de identificação e compartilhamento."
  },
  2: {
    theme: "tarot do dia",
    scienceBases: ["tarot", "energia emocional", "cristal"],
    objective: "engajar",
    preferredFormats: ["reels", "stories", "tiktok"],
    hookTypes: ["identificação emocional", "pergunta direta", "verdade desconfortável"],
    ctaTypes: ["compartilhar", "comentar", "seguir página"],
    reason: "Tarot direto favorece resposta emocional rápida e envio para outras pessoas."
  },
  3: {
    theme: "decisão prática",
    scienceBases: ["numerologia", "cor", "energia emocional"],
    objective: "educar",
    preferredFormats: ["carrossel", "feed", "stories"],
    hookTypes: ["microensinamento", "quebra de padrão", "curiosidade"],
    ctaTypes: ["salvar", "comentar", "acessar link na bio"],
    reason: "Meio da semana pede utilidade clara, checklist e conteúdo salvável."
  },
  4: {
    theme: "astrologia educativa",
    scienceBases: ["astrologia", "trânsito astral", "elemento"],
    objective: "gerar autoridade",
    preferredFormats: ["carrossel", "feed", "reels"],
    hookTypes: ["microensinamento", "curiosidade", "alerta simbólico"],
    ctaTypes: ["salvar", "seguir página", "compartilhar"],
    reason: "Conteúdo explicativo fortalece autoridade sem depender de texto longo."
  },
  5: {
    theme: "energia afetiva e social",
    scienceBases: ["elemento", "cor", "energia emocional"],
    objective: "engajar",
    preferredFormats: ["stories", "reels", "feed"],
    hookTypes: ["pergunta direta", "identificação emocional", "curiosidade"],
    ctaTypes: ["comentar", "compartilhar", "acessar link na bio"],
    reason: "Sexta favorece interação leve, enquete, bastidor e leitura afetiva."
  },
  6: {
    theme: "autoconhecimento leve",
    scienceBases: ["cristal", "cor", "tarot"],
    objective: "levar para app",
    preferredFormats: ["stories", "feed", "tiktok"],
    hookTypes: ["curiosidade", "pergunta direta", "identificação emocional"],
    ctaTypes: ["acessar link na bio", "gerar relatório no app", "comentar"],
    reason: "Fim de semana combina conteúdo leve com convite natural para o app."
  }
};

const intensitySlots: Record<ContentIntensity, SlotTemplate[]> = {
  leve: [
    { moment: "manhã", platform: "instagram", format: "feed" },
    { moment: "tarde", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "comentar" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "levar para app", ctaBias: "acessar link na bio" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "compartilhar" }
  ],
  padrão: [
    { moment: "manhã", platform: "instagram", format: "carrossel" },
    { moment: "manhã", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "comentar" },
    { moment: "tarde", platform: "instagram", format: "stories", objectiveBias: "educar", ctaBias: "salvar" },
    { moment: "tarde", platform: "instagram", format: "feed" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "levar para app", ctaBias: "acessar link na bio" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "compartilhar" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "levar para app", ctaBias: "gerar relatório no app" }
  ],
  intensa: [
    { moment: "manhã", platform: "instagram", format: "carrossel" },
    { moment: "manhã", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "comentar" },
    { moment: "manhã", platform: "instagram", format: "stories", objectiveBias: "educar", ctaBias: "salvar" },
    { moment: "tarde", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "compartilhar" },
    { moment: "tarde", platform: "instagram", format: "stories", objectiveBias: "gerar autoridade", ctaBias: "salvar" },
    { moment: "tarde", platform: "tiktok", format: "tiktok", objectiveBias: "ganhar seguidores", ctaBias: "comentar" },
    { moment: "noite", platform: "instagram", format: "reels", objectiveBias: "ganhar seguidores", ctaBias: "seguir página" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "levar para app", ctaBias: "acessar link na bio" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "comentar" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "levar para app", ctaBias: "gerar relatório no app" },
    { moment: "noite", platform: "instagram", format: "stories", objectiveBias: "engajar", ctaBias: "compartilhar" }
  ]
};

const objectiveMap: Record<string, EditorialObjective> = {
  "ganhar seguidores": "ganhar seguidores",
  engajamento: "engajar",
  engajar: "engajar",
  "tráfego para app": "levar para app",
  "levar para app": "levar para app",
  "venda/relatório": "levar para app",
  autoridade: "gerar autoridade",
  "gerar autoridade": "gerar autoridade",
  educação: "educar",
  educar: "educar"
};

const scoreByFormat: Record<EditorialFormat, EditorialScore> = {
  feed: { follow: 6, save: 7, share: 6, comment: 4, bioClick: 3, repetitionRisk: 3, emotionalIntensity: 5 },
  carrossel: { follow: 7, save: 9, share: 8, comment: 4, bioClick: 3, repetitionRisk: 4, emotionalIntensity: 5 },
  stories: { follow: 3, save: 2, share: 3, comment: 8, bioClick: 8, repetitionRisk: 2, emotionalIntensity: 6 },
  reels: { follow: 9, save: 5, share: 8, comment: 7, bioClick: 3, repetitionRisk: 5, emotionalIntensity: 8 },
  tiktok: { follow: 9, save: 4, share: 8, comment: 8, bioClick: 2, repetitionRisk: 5, emotionalIntensity: 8 }
};

export function generateEditorialPlan(
  date: Date | string,
  intensity: ContentIntensity,
  mainObjective: string,
  history: EditorialHistoryItem[] = []
): EditorialPlanItem[] {
  const planDate = toDate(date);
  const dayRule = dayRules[planDate.getDay()];
  const normalizedMainObjective = objectiveMap[mainObjective] ?? "ganhar seguidores";
  const slots = intensitySlots[intensity];
  const planned: EditorialPlanItem[] = [];

  slots.forEach((slot, index) => {
    const rollingHistory = [...history, ...planned];
    const format = chooseFormat(slot, dayRule, rollingHistory, index);
    const objective = chooseObjective(slot, dayRule, normalizedMainObjective, rollingHistory, index);
    const scienceBase = chooseWithoutFatigue(dayRule.scienceBases, rollingHistory.at(-1)?.scienceBase, index);
    const hookType = chooseWithoutFatigue(dayRule.hookTypes, rollingHistory.at(-1)?.hookType, index);
    const ctaType = chooseCta(slot, dayRule, objective, rollingHistory, index);
    const theme = buildTheme(dayRule.theme, slot.moment, index);

    planned.push({
      date: toIsoDate(planDate),
      moment: slot.moment,
      platform: slot.platform,
      format,
      objective,
      scienceBase,
      theme,
      hookType,
      ctaType,
      strategicReason: buildStrategicReason(dayRule, slot, format, objective, hookType, ctaType),
      score: scoreContent(format, objective, ctaType, hookType, rollingHistory)
    });
  });

  return planned;
}

export function generateWeeklyEditorialPlan(
  startDate: Date | string,
  intensity: ContentIntensity,
  mainObjective: string,
  history: EditorialHistoryItem[] = []
) {
  const firstDate = toDate(startDate);
  const days: EditorialPlanItem[][] = [];
  let rollingHistory = [...history];

  for (let day = 0; day < 7; day += 1) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + day);
    const plan = generateEditorialPlan(date, intensity, mainObjective, rollingHistory);
    days.push(plan);
    rollingHistory = [...rollingHistory, ...plan];
  }

  return days.flat();
}

function chooseFormat(slot: SlotTemplate, rule: DayRule, history: EditorialHistoryItem[], index: number) {
  const previous = history.at(-1)?.format;
  if ((slot.format === "tiktok" || slot.format === "reels") && previous !== slot.format) {
    return slot.format;
  }

  const preferred = [slot.format, ...rule.preferredFormats.filter((format) => format !== slot.format)];
  return chooseWithoutFatigue(preferred, previous, index);
}

function chooseObjective(
  slot: SlotTemplate,
  rule: DayRule,
  mainObjective: EditorialObjective,
  history: EditorialHistoryItem[],
  index: number
): EditorialObjective {
  const preferred: EditorialObjective[] = [
    slot.objectiveBias ?? rule.objective,
    mainObjective,
    rule.objective,
    "engajar",
    "educar",
    "ganhar seguidores",
    "levar para app",
    "gerar autoridade"
  ];

  return chooseWithoutFatigue(unique(preferred), history.at(-1)?.objective, index);
}

function chooseCta(
  slot: SlotTemplate,
  rule: DayRule,
  objective: EditorialObjective,
  history: EditorialHistoryItem[],
  index: number
) {
  const byObjective: Record<EditorialObjective, EditorialCtaType[]> = {
    "ganhar seguidores": ["seguir página", "compartilhar", "comentar"],
    engajar: ["comentar", "compartilhar", "salvar"],
    "levar para app": ["acessar link na bio", "gerar relatório no app", "comentar"],
    educar: ["salvar", "compartilhar", "seguir página"],
    "gerar autoridade": ["salvar", "seguir página", "compartilhar"]
  };
  const preferred = [slot.ctaBias, ...rule.ctaTypes, ...byObjective[objective]].filter(Boolean) as EditorialCtaType[];
  return chooseWithoutFatigue(unique(preferred), history.at(-1)?.ctaType, index);
}

function chooseWithoutFatigue<T>(items: T[], previous: T | undefined, index: number): T {
  const candidate = items[index % items.length];
  if (candidate !== previous) return candidate;
  return items[(index + 1) % items.length];
}

function scoreContent(
  format: EditorialFormat,
  objective: EditorialObjective,
  ctaType: EditorialCtaType,
  hookType: EditorialHookType,
  history: EditorialHistoryItem[]
): EditorialScore {
  const score = { ...scoreByFormat[format] };

  if (objective === "ganhar seguidores") score.follow += 1;
  if (objective === "educar") score.save += 1;
  if (objective === "engajar") score.comment += 1;
  if (objective === "levar para app") score.bioClick += 1;
  if (ctaType === "compartilhar") score.share += 1;
  if (ctaType === "salvar") score.save += 1;
  if (ctaType === "comentar") score.comment += 1;
  if (ctaType.includes("app") || ctaType.includes("bio")) score.bioClick += 1;
  if (["identificação emocional", "verdade desconfortável", "alerta simbólico"].includes(hookType)) {
    score.emotionalIntensity += 1;
  }

  const last = history.at(-1);
  if (last?.format === format) score.repetitionRisk += 3;
  if (last?.hookType === hookType) score.repetitionRisk += 2;

  return clampScore(score);
}

function clampScore(score: EditorialScore): EditorialScore {
  return Object.fromEntries(
    Object.entries(score).map(([key, value]) => [key, Math.max(1, Math.min(10, value))])
  ) as EditorialScore;
}

function buildStrategicReason(
  rule: DayRule,
  slot: SlotTemplate,
  format: EditorialFormat,
  objective: EditorialObjective,
  hookType: EditorialHookType,
  ctaType: EditorialCtaType
) {
  const platformReason =
    slot.platform === "tiktok"
      ? "TikTok prioriza gancho imediato, curiosidade e comentários."
      : "Instagram usa o formato conforme potencial de salvamento, compartilhamento, retenção e tráfego.";

  return `${rule.reason} ${platformReason} ${format} em ${slot.moment} apoia ${objective} com gancho de ${hookType} e CTA para ${ctaType}.`;
}

function buildTheme(theme: string, moment: EditorialMoment, index: number) {
  const momentAngle: Record<EditorialMoment, string[]> = {
    manhã: ["direção do dia", "força inicial", "clareza prática"],
    tarde: ["ajuste de rota", "decisão prática", "sinal de atenção"],
    noite: ["fechamento emocional", "convite para o app", "preparação energética"]
  };

  return `${theme}: ${momentAngle[moment][index % momentAngle[moment].length]}`;
}

function toDate(date: Date | string) {
  return typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}
