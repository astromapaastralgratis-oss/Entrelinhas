import type { EditorialFormat, EditorialPlanItem } from "@/types/content";
import type { GeneratedCopy } from "@/types/copy";
import type { VisualPromptInput, VisualPromptResult, VisualRatio, VisualStyle } from "@/types/visual";

export const visualStyles: VisualStyle[] = [
  {
    id: "cosmic-gold",
    name: "Cosmic Gold",
    palette: ["preto profundo", "azul noite", "dourado quente", "roxo escuro"],
    elements: ["lua fina", "poeira estelar", "linhas douradas", "aura sutil"],
    bestUse: ["feed", "carrossel", "reels"],
    promptFragment: "acabamento editorial premium com detalhes dourados, brilho suave e atmosfera cosmica elegante"
  },
  {
    id: "mystic-violet",
    name: "Mystic Violet",
    palette: ["roxo profundo", "preto", "violeta", "azul noite"],
    elements: ["gradiente violeta", "estrelas discretas", "energia sutil", "planeta distante"],
    bestUse: ["stories", "tiktok", "reels"],
    promptFragment: "visual mistico moderno com violeta intenso, contraste alto e glow suave ao redor do texto"
  },
  {
    id: "lunar-minimal",
    name: "Lunar Minimal",
    palette: ["preto", "cinza lunar", "dourado discreto", "azul escuro"],
    elements: ["lua grande", "estrelas pequenas", "espaco negativo", "halo delicado"],
    bestUse: ["stories", "feed"],
    promptFragment: "composicao minimalista lunar, poucos elementos, muito espaco negativo e foco total na leitura"
  },
  {
    id: "tarot-premium",
    name: "Tarot Premium",
    palette: ["preto luxo", "dourado antigo", "vinho escuro", "violeta"],
    elements: ["moldura tarot", "simbolos finos", "textura de papel premium", "estrela dourada"],
    bestUse: ["carrossel", "feed"],
    promptFragment: "estetica tarot premium sem caricatura, moldura sofisticada e simbolismo discreto"
  },
  {
    id: "numerology-glow",
    name: "Numerology Glow",
    palette: ["azul noite", "preto", "ciano suave", "dourado"],
    elements: ["numeros abstratos", "linhas orbitais", "particulas", "glow matematico sutil"],
    bestUse: ["carrossel", "stories"],
    promptFragment: "numerologia contemporanea com numeros abstratos ao fundo, sem poluir a area do texto"
  },
  {
    id: "deep-space-editorial",
    name: "Deep Space Editorial",
    palette: ["preto espacial", "azul profundo", "roxo quase preto", "dourado pontual"],
    elements: ["planetas distantes", "nebulosa escura", "estrelas pequenas", "gradiente cosmico"],
    bestUse: ["reels", "tiktok", "feed"],
    promptFragment: "capa editorial de alto impacto para scroll, fundo cosmico escuro e hierarquia tipografica forte"
  },
  {
    id: "soft-ritual",
    name: "Soft Ritual",
    palette: ["preto suave", "violeta queimado", "rosa escuro", "dourado leve"],
    elements: ["vela abstrata", "aura suave", "cristal discreto", "brilho difuso"],
    bestUse: ["stories", "feed"],
    promptFragment: "ritual suave e acolhedor, brilho difuso, poucos objetos e leitura mobile prioritaria"
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    palette: ["preto luxo", "grafite", "ouro", "azul noite"],
    elements: ["textura acetinada", "borda dourada fina", "luz lateral", "estrelas quase invisiveis"],
    bestUse: ["feed", "carrossel", "stories"],
    promptFragment: "luxo escuro, contraste forte, textura premium e elementos dourados contidos"
  }
];

export function getVisualStyle(index: number, format?: EditorialFormat) {
  const candidates = format
    ? visualStyles.filter((style) => style.bestUse.includes(format))
    : visualStyles;

  return candidates[index % candidates.length] ?? visualStyles[index % visualStyles.length];
}

export function getRatioForFormat(format: EditorialFormat): VisualRatio {
  return format === "stories" || format === "reels" || format === "tiktok" ? "9:16" : "1:1";
}

export function generateVisualPrompt(contentItem: VisualPromptInput, visualStyle: VisualStyle): VisualPromptResult {
  if (!contentItem.ratio) {
    throw new Error("Prompt visual rejeitado: proporção obrigatória ausente.");
  }

  const title = trimWords(contentItem.title, 12);
  const subtitle = trimWords(contentItem.subtitle, 18);
  const cta = trimWords(contentItem.cta, 8);

  return {
    prompt: [
      `Create one single independent social media image, ratio ${contentItem.ratio}, for Astral Pessoal.`,
      `Composition: premium mystical modern layout with dark background, safe margins on all sides, strong mobile-first text hierarchy, no grid, no collage, no multiple slides in one image.`,
      `Palette: ${visualStyle.palette.join(", ")} with deep purple, black, night blue, cosmic gradient, soft glow and refined gold accents.`,
      `Elements: ${visualStyle.elements.join(", ")}; moon, stars, planets, aura and subtle energy only when they support the message.`,
      `Style: ${contentItem.style}; ${visualStyle.promptFragment}.`,
      `Science base visual cue: ${contentItem.scienceBase}.`,
      `Text hierarchy: large readable title "${title}", supporting subtitle "${subtitle}", short CTA "${cta}".`,
      `Legibility: high contrast, large clean typography, no distorted font, no cropped text, no broken sentence, generous safe area, clear PNG-ready poster composition.`,
      `Impact: designed to stop scroll, premium and minimal, no excess elements.`
    ].join(" "),
    negativePrompt: [
      "small text",
      "cropped sentence",
      "cut off words",
      "multiple screens in one image",
      "multiple cards",
      "grid",
      "collage",
      "low readability",
      "too many elements",
      "distorted font",
      "random words",
      "misspelling",
      "busy background",
      "low contrast",
      "text outside safe area"
    ].join(", "),
    ratio: contentItem.ratio,
    safeArea: true,
    styleName: visualStyle.name,
    textBlocks: [
      { type: "title", text: title, maxWords: 12 },
      { type: "subtitle", text: subtitle, maxWords: 18 },
      { type: "cta", text: cta, maxWords: 8 }
    ]
  };
}

export function generateVisualPromptsForContent(
  planItem: EditorialPlanItem,
  generatedCopy: GeneratedCopy | undefined,
  startStyleIndex = 0
) {
  const ratio = getRatioForFormat(planItem.format);
  const baseTitle = generatedCopy?.title || planItem.theme;
  const baseSubtitle = generatedCopy?.subtitle || planItem.strategicReason;
  const baseCta = generatedCopy?.cta || planItem.ctaType;
  const units = getVisualUnits(planItem, generatedCopy);

  return units.map((unit, index) => {
    const visualStyle = getVisualStyle(startStyleIndex + index, planItem.format);
    return generateVisualPrompt(
      {
        format: planItem.format,
        ratio,
        title: unit.title || baseTitle,
        subtitle: unit.subtitle || baseSubtitle,
        cta: baseCta,
        scienceBase: planItem.scienceBase,
        style: "premium cosmic dark"
      },
      visualStyle
    );
  });
}

function getVisualUnits(planItem: EditorialPlanItem, generatedCopy?: GeneratedCopy) {
  if ((planItem.format === "carrossel" || planItem.format === "stories") && generatedCopy?.slides.length) {
    return generatedCopy.slides.map((slide) => ({
      title: slide.title,
      subtitle: slide.subtitle
    }));
  }

  return [
    {
      title: generatedCopy?.title ?? planItem.theme,
      subtitle: generatedCopy?.subtitle ?? planItem.strategicReason
    }
  ];
}

function trimWords(text: string, maxWords: number) {
  return text.split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}
