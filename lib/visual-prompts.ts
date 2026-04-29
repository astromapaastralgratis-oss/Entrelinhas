import type { EditorialFormat, EditorialPlanItem } from "@/types/content";
import type { GeneratedCopy } from "@/types/copy";
import type {
  VisualLayoutType,
  VisualMode,
  VisualPromptInput,
  VisualPromptResult,
  VisualRatio,
  VisualStyle
} from "@/types/visual";

export const astralHookLibrary = [
  "Nem todo cansaco e fisico.",
  "Hoje sua energia pede menos reacao.",
  "Voce nao esta confusa. Esta captando sinais demais.",
  "Tem dias em que o corpo entende antes da mente.",
  "O que voce sente pode ter uma pista.",
  "Antes de decidir, entenda o clima do seu dia.",
  "Talvez nao seja falta de forca. Talvez seja excesso de ruido.",
  "Seu dia nao precisa ser perfeito. Precisa ser lido com clareza."
];

export const astralCtaLibrary = {
  follow: "Segue a pagina pra entender o que esta por tras do que voce sente.",
  app: "Acesse o link na bio e veja sua leitura do dia.",
  save: "Salva este post para consultar quando o dia pesar.",
  comment: "Comenta: qual energia voce sentiu hoje?",
  share: "Envia para alguem que tambem sente tudo antes de entender."
};

export const visualStyles: VisualStyle[] = [
  {
    id: "cosmic-gold-dark",
    name: "Cosmic Gold Dark",
    mode: "dark",
    palette: ["#08061A", "#1A1535", "#C9A96E", "#F5EDD6", "#A08CC8"],
    elements: ["fundo cosmico profundo", "particulas douradas", "lua discreta", "roda astrologica translucida"],
    bestUse: ["feed", "carrossel", "reels", "tiktok"],
    layoutType: "viral-hook",
    typography: { title: "serif editorial elegante", body: "sans limpa" },
    compositionRules: ["titulo grande central", "bordas livres", "glow suave", "poucas palavras"],
    intensity: "alta",
    promptFragment: "premium cosmico escuro, dourado refinado, profundidade emocional e impacto de scroll"
  },
  {
    id: "mystic-violet",
    name: "Mystic Violet",
    mode: "dark",
    palette: ["#08061A", "#241447", "#A08CC8", "#C9A96E", "#F5EDD6"],
    elements: ["nebulosa violeta discreta", "estrelas sutis", "energia nas bordas", "linhas orbitais"],
    bestUse: ["stories", "reels", "tiktok"],
    layoutType: "emotional",
    typography: { title: "serif dramatica", body: "sans acessivel" },
    compositionRules: ["contraste alto", "texto com respiro", "elementos so nas bordas"],
    intensity: "alta",
    promptFragment: "mistico moderno violeta sem exagero, sofisticado e emocional"
  },
  {
    id: "tarot-premium",
    name: "Tarot Premium",
    mode: "dark",
    palette: ["#08061A", "#2A1026", "#C9A96E", "#F5EDD6", "#6D578D"],
    elements: ["simbolos finos", "carta abstrata", "estrela dourada", "moldura interna discreta"],
    bestUse: ["feed", "carrossel", "stories", "reels"],
    layoutType: "emotional",
    typography: { title: "serif de luxo", body: "sans editorial" },
    compositionRules: ["sem caricatura tarot", "simbolismo discreto", "titulo protagonista"],
    intensity: "alta",
    promptFragment: "tarot premium sem bruxaria caricata, leitura intima e acabamento de luxo"
  },
  {
    id: "deep-space-editorial",
    name: "Deep Space Editorial",
    mode: "dark",
    palette: ["#050712", "#07182D", "#1A1535", "#C9A96E", "#F5EDD6"],
    elements: ["planeta distante", "poeira estelar", "curvas finas", "horizonte cosmico"],
    bestUse: ["feed", "reels", "tiktok"],
    layoutType: "reels-cover",
    typography: { title: "serif editorial forte", body: "sans condensada limpa" },
    compositionRules: ["capa de impacto", "texto em 2 segundos", "sem poluicao"],
    intensity: "alta",
    promptFragment: "capa editorial cosmica com impacto imediato e leitura perfeita no celular"
  },
  {
    id: "lunar-minimal-dark",
    name: "Lunar Minimal Dark",
    mode: "dark",
    palette: ["#08061A", "#111827", "#C9A96E", "#F5EDD6", "#A08CC8"],
    elements: ["lua crescente", "halo delicado", "poucas estrelas", "espaco negativo"],
    bestUse: ["stories", "feed", "carrossel"],
    layoutType: "emotional",
    typography: { title: "serif delicada", body: "sans leve" },
    compositionRules: ["minimalismo lunar", "muito respiro", "clima de reflexao"],
    intensity: "media",
    promptFragment: "lunar minimalista escuro, intimo, elegante e silencioso"
  },
  {
    id: "soft-ritual-light",
    name: "Soft Ritual Light",
    mode: "light",
    palette: ["#F7F1E8", "#EFE3D1", "#C9A96E", "#2B2118", "#D8B7A6"],
    elements: ["textura suave", "linhas douradas finas", "simbolo lunar pequeno", "respiro editorial"],
    bestUse: ["feed", "stories", "carrossel"],
    layoutType: "product-cta",
    typography: { title: "serif editorial suave", body: "sans limpa" },
    compositionRules: ["fundo claro sem branco puro", "espaco em branco", "detalhe dourado contido"],
    intensity: "leve",
    promptFragment: "ritual claro sofisticado, editorial premium e acolhedor"
  },
  {
    id: "elegant-astro-light",
    name: "Elegant Astro Light",
    mode: "light",
    palette: ["#F7F1E8", "#EFE3D1", "#C9A96E", "#2B2118", "#B9A8D3"],
    elements: ["circulos astrologicos", "linhas editoriais", "glifos pequenos", "diagrama simples"],
    bestUse: ["feed", "carrossel", "stories"],
    layoutType: "educational",
    typography: { title: "serif de revista", body: "sans objetiva" },
    compositionRules: ["autoridade acessivel", "uma ideia por card", "hierarquia clara"],
    intensity: "media",
    promptFragment: "astrologia educativa clara, sofisticada e com aparencia de revista premium"
  },
  {
    id: "numerology-editorial-light",
    name: "Numerology Editorial Light",
    mode: "light",
    palette: ["#F7F1E8", "#EFE3D1", "#C9A96E", "#2B2118", "#D8B7A6"],
    elements: ["numeros abstratos", "linhas finas", "grade editorial invisivel", "pontos dourados"],
    bestUse: ["feed", "carrossel", "stories"],
    layoutType: "educational",
    typography: { title: "serif editorial", body: "sans precisa" },
    compositionRules: ["numeros como textura", "nunca poluir", "explicacao visual simples"],
    intensity: "media",
    promptFragment: "numerologia editorial clara, refinada e objetiva"
  }
];

export function selectPostVisualStyle(content: EditorialPlanItem, startStyleIndex = 0) {
  const science = content.scienceBase.toLowerCase();
  const objective = content.objective.toLowerCase();
  const theme = content.theme.toLowerCase();
  const hook = content.hookType.toLowerCase();
  const cta = content.ctaType.toLowerCase();

  const exactStyle =
    science.includes("tarot")
      ? "tarot-premium"
      : science.includes("numerologia")
        ? "numerology-editorial-light"
        : science.includes("astrologia") && (objective.includes("educar") || objective.includes("autoridade"))
          ? "elegant-astro-light"
          : science.includes("energia")
            ? "cosmic-gold-dark"
            : content.moment === "noite" || theme.includes("reflex")
              ? "lunar-minimal-dark"
              : null;

  if (exactStyle) {
    return visualStyles.find((style) => style.id === exactStyle) ?? visualStyles[0];
  }

  const preferredMode: VisualMode =
    objective.includes("educar") ||
    objective.includes("autoridade") ||
    objective.includes("app") ||
    theme.includes("produto") ||
    theme.includes("educ")
      ? "light"
      : hook.includes("verdade") || hook.includes("identificacao") || cta.includes("link") || cta.includes("relatorio")
        ? "dark"
        : "dark";

  const candidates = visualStyles.filter((style) => style.mode === preferredMode && style.bestUse.includes(content.format));
  return candidates[startStyleIndex % candidates.length] ?? visualStyles[startStyleIndex % visualStyles.length];
}

export function getVisualStyle(index: number, format?: EditorialFormat) {
  const candidates = format
    ? visualStyles.filter((style) => style.bestUse.includes(format))
    : visualStyles;

  return candidates[index % candidates.length] ?? visualStyles[index % visualStyles.length];
}

export function getRatioForFormat(format: EditorialFormat, squareFeed = false): VisualRatio {
  if (format === "stories" || format === "reels" || format === "tiktok") return "9:16";
  if (format === "feed" || format === "carrossel") return squareFeed ? "1:1" : "4:5";
  return "4:5";
}

export function getDimensionsForRatio(ratio: VisualRatio) {
  if (ratio === "9:16") return { width: 1080, height: 1920 };
  if (ratio === "1:1") return { width: 1080, height: 1080 };
  return { width: 1080, height: 1350 };
}

export function generateVisualPrompt(contentItem: VisualPromptInput, visualStyle: VisualStyle): VisualPromptResult {
  if (!contentItem.ratio) {
    throw new Error("Estilo do post rejeitado: proporcao obrigatoria ausente.");
  }

  const title = trimWords(contentItem.title, 12);
  const subtitle = trimWords(contentItem.subtitle, 18);
  const cta = trimWords(contentItem.cta, 14);
  const dimensions = getDimensionsForRatio(contentItem.ratio);
  const validationNotes = validatePostText(title, subtitle, cta);

  return {
    prompt: [
      `Arte final postavel para Astral Pessoal, formato ${contentItem.format}, proporcao ${contentItem.ratio}, tamanho ${dimensions.width}x${dimensions.height}.`,
      `Modo visual: ${visualStyle.mode === "dark" ? "Premium Cosmico Escuro" : "Editorial Sofisticado Claro"}.`,
      `Estilo do post: ${visualStyle.name}. ${visualStyle.promptFragment}.`,
      `Paleta: ${visualStyle.palette.join(", ")}. Elementos: ${visualStyle.elements.join(", ")}.`,
      `Composicao: ${visualStyle.compositionRules.join("; ")}.`,
      `Texto sera renderizado pelo sistema, nao pela IA de imagem. Use somente fundo, atmosfera, elementos e hierarquia visual.`,
      `Titulo na arte: "${title}". Subtitulo: "${subtitle}". Chamada para acao: "${cta}".`,
      "Post pronto para publicar, leitura perfeita no celular, margens seguras, sem bordas brancas, sem grid, sem colagem, sem multiplos cards na mesma arte."
    ].join(" "),
    negativePrompt: [
      "texto gerado por IA na imagem",
      "palavras aleatorias",
      "erro ortografico",
      "texto pequeno",
      "frase cortada",
      "grid",
      "colagem",
      "multiplos cards",
      "multiplas telas",
      "borda branca",
      "baixo contraste",
      "layout generico de Canva",
      "excesso de elementos",
      "aparencia amadora"
    ].join(", "),
    ratio: contentItem.ratio,
    width: dimensions.width,
    height: dimensions.height,
    safeArea: true,
    styleName: visualStyle.name,
    visualMode: visualStyle.mode,
    layoutType: visualStyle.layoutType,
    isPostReady: validationNotes.length === 0,
    validationNotes,
    textBlocks: [
      { type: "title", text: title, maxWords: 12 },
      { type: "subtitle", text: subtitle, maxWords: 18 },
      { type: "cta", text: cta, maxWords: 14 }
    ]
  };
}

export function generateVisualPromptsForContent(
  planItem: EditorialPlanItem,
  generatedCopy: GeneratedCopy | undefined,
  startStyleIndex = 0
) {
  const ratio = getRatioForFormat(planItem.format);
  const baseTitle = generatedCopy?.title || chooseHook(planItem);
  const baseSubtitle = generatedCopy?.subtitle || planItem.strategicReason;
  const baseCta = generatedCopy?.cta || chooseCta(planItem.ctaType);
  const units = getVisualUnits(planItem, generatedCopy);
  const visualStyle = selectPostVisualStyle(planItem, startStyleIndex);

  return units.map((unit) =>
    generateVisualPrompt(
      {
        format: planItem.format,
        ratio,
        title: unit.title || baseTitle,
        subtitle: unit.subtitle || baseSubtitle,
        cta: unit.cta || baseCta,
        scienceBase: planItem.scienceBase,
        style: visualStyle.name
      },
      visualStyle
    )
  );
}

function getVisualUnits(planItem: EditorialPlanItem, generatedCopy?: GeneratedCopy) {
  if ((planItem.format === "carrossel" || planItem.format === "stories") && generatedCopy?.slides.length) {
    return generatedCopy.slides.map((slide, index) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: index === generatedCopy.slides.length - 1 ? generatedCopy.cta : ""
    }));
  }

  return [
    {
      title: generatedCopy?.title ?? chooseHook(planItem),
      subtitle: generatedCopy?.subtitle ?? planItem.strategicReason,
      cta: generatedCopy?.cta ?? chooseCta(planItem.ctaType)
    }
  ];
}

function chooseHook(planItem: EditorialPlanItem) {
  const science = planItem.scienceBase.toLowerCase();
  if (science.includes("energia")) return "Hoje sua energia pede menos reacao.";
  if (science.includes("tarot")) return "Antes de decidir, observe o sinal do dia.";
  if (science.includes("numerologia")) return "O numero do dia pode organizar sua direcao.";
  return astralHookLibrary[Math.abs(planItem.theme.length) % astralHookLibrary.length];
}

function chooseCta(ctaType: string) {
  const normalized = ctaType.toLowerCase();
  if (normalized.includes("link") || normalized.includes("app") || normalized.includes("relatorio")) return astralCtaLibrary.app;
  if (normalized.includes("salvar")) return astralCtaLibrary.save;
  if (normalized.includes("comentar")) return astralCtaLibrary.comment;
  if (normalized.includes("compartilhar")) return astralCtaLibrary.share;
  return astralCtaLibrary.follow;
}

function validatePostText(title: string, subtitle: string, cta: string) {
  const notes: string[] = [];
  if (wordCount(title) > 12) notes.push("titulo muito longo");
  if (wordCount(subtitle) > 18) notes.push("subtitulo muito longo");
  if (title.length > 72) notes.push("titulo pode passar de 4 linhas");
  if (subtitle.length > 110) notes.push("subtitulo pode cortar");
  if (!cta.trim()) notes.push("falta chamada para acao");
  return notes;
}

function trimWords(text: string, maxWords: number) {
  return text.split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}
