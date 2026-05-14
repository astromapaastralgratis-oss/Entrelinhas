import type { EditorialPlanItem } from "@/types/content";
import type { GeneratedCopy, GeneratedSlide } from "@/types/copy";

const carouselSixRoles = [
  "hook",
  "identificacao",
  "explicacao",
  "aplicacao",
  "virada",
  "cta"
] as const;

const carouselFourRoles = ["hook", "explicacao", "virada", "cta"] as const;
const storyRoles = ["abertura", "contexto", "conexao", "acao", "cta"] as const;

export function normalizeGeneratedCopySlides(copy: GeneratedCopy, planItem: EditorialPlanItem, cards: number): GeneratedCopy {
  if (planItem.format !== "carrossel" && planItem.format !== "stories") {
    return copy;
  }

  const roles = getNarrativeRoles(planItem.format, cards);
  const baseSlides = Array.from({ length: roles.length }, (_, index) => copy.slides[index]);
  const used = new Set<string>();
  const slides = baseSlides.map((slide, index) => {
    const role = roles[index];
    const candidate = normalizeSlide(slide, index);
    const signature = getSlideSignature(candidate);

    if (!candidate.title || !candidate.subtitle || used.has(signature)) {
      const fallback = buildNarrativeSlide(planItem, copy, role, index, roles.length);
      used.add(getSlideSignature(fallback));
      return fallback;
    }

    used.add(signature);
    return {
      ...candidate,
      visualCue: candidate.visualCue || `${planItem.scienceBase}, ${role}, ${planItem.moment}`
    };
  });

  return {
    ...copy,
    slides
  };
}

export function hasRepeatedSlides(slides: GeneratedSlide[]) {
  const signatures = slides.map(getSlideSignature).filter(Boolean);
  return new Set(signatures).size < signatures.length;
}

function getNarrativeRoles(format: EditorialPlanItem["format"], cards: number) {
  if (format === "stories") return storyRoles;
  return cards <= 4 ? carouselFourRoles : carouselSixRoles;
}

function normalizeSlide(slide: GeneratedSlide | undefined, index: number): GeneratedSlide {
  return {
    number: index + 1,
    title: trimWords(slide?.title ?? "", 12),
    subtitle: trimWords(slide?.subtitle ?? "", 18),
    visualCue: slide?.visualCue ?? ""
  };
}

function buildNarrativeSlide(
  planItem: EditorialPlanItem,
  copy: GeneratedCopy,
  role: string,
  index: number,
  total: number
): GeneratedSlide {
  const science = planItem.scienceBase.toLowerCase();
  const theme = cleanTheme(planItem.theme);
  const isLast = index === total - 1;
  const cta = trimWords(copy.cta || chooseSimpleCta(planItem.ctaType), 12);

  const byRole: Record<string, { title: string; subtitle: string }> = {
    hook: {
      title: trimWords(copy.title || chooseHook(planItem), 12),
      subtitle: trimWords(copy.subtitle || `Uma leitura simples sobre ${theme}.`, 18)
    },
    identificacao: {
      title: "Talvez você já tenha sentido isso.",
      subtitle: trimWords(`Quando ${theme} aparece, o dia pede mais escuta.`, 18)
    },
    explicacao: {
      title: trimWords(`${labelScience(science)} não precisa complicar.`, 12),
      subtitle: trimWords(`Use essa base como pista prática, não como previsão absoluta.`, 18)
    },
    aplicacao: {
      title: "Leve isso para uma escolha pequena.",
      subtitle: trimWords(`Observe o ritmo do dia antes de responder no automatico.`, 18)
    },
    virada: {
      title: "A clareza pode vir do detalhe.",
      subtitle: trimWords(`O sinal importante talvez esteja no que se repetiu hoje.`, 18)
    },
    abertura: {
      title: trimWords(copy.title || chooseHook(planItem), 12),
      subtitle: trimWords(copy.subtitle || `Comece olhando para ${theme}.`, 18)
    },
    contexto: {
      title: "O clima do dia importa.",
      subtitle: trimWords(`${labelScience(science)} ajuda a ler o momento com mais calma.`, 18)
    },
    conexao: {
      title: "Se fez sentido, respira.",
      subtitle: trimWords(`Nem toda sensacao precisa virar urgencia agora.`, 18)
    },
    acao: {
      title: "Escolha um passo possível.",
      subtitle: trimWords(`Menos pressa, mais direção para atravessar o dia.`, 18)
    },
    cta: {
      title: isLast ? cta : "Guarde essa direção.",
      subtitle: trimWords(isLast ? "Use este post como lembrete simples para hoje." : cta, 18)
    }
  };

  const selected = byRole[role] ?? byRole.virada;
  return {
    number: index + 1,
    title: selected.title,
    subtitle: selected.subtitle,
    visualCue: `${planItem.scienceBase}, ${role}, ${planItem.moment}`
  };
}

function getSlideSignature(slide: Pick<GeneratedSlide, "title" | "subtitle">) {
  return normalizeText(`${slide.title} ${slide.subtitle}`);
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTheme(theme: string) {
  return theme.split(":").pop()?.trim().toLowerCase() || theme.toLowerCase();
}

function labelScience(science: string) {
  if (science.includes("tarot")) return "O tarot";
  if (science.includes("numerologia")) return "A numerologia";
  if (science.includes("astrologia")) return "A astrologia";
  if (science.includes("cristal")) return "O cristal do dia";
  if (science.includes("cor")) return "A cor do dia";
  return "A energia do dia";
}

function chooseHook(planItem: EditorialPlanItem) {
  const science = planItem.scienceBase.toLowerCase();
  if (science.includes("tarot")) return "Antes de decidir, observe o sinal.";
  if (science.includes("numerologia")) return "Seu dia tem um numero-guia.";
  if (science.includes("astrologia")) return "O ceu tambem fala em detalhes.";
  return "O que você sente pode ter uma pista.";
}

function chooseSimpleCta(ctaType: string) {
  const normalized = ctaType.toLowerCase();
  if (normalized.includes("link") || normalized.includes("app") || normalized.includes("relatorio")) {
    return "Acesse o link na bio.";
  }
  if (normalized.includes("salvar")) return "Salve para consultar depois.";
  if (normalized.includes("comentar")) return "Comenta: fez sentido?";
  if (normalized.includes("compartilhar")) return "Envie para quem sente tudo.";
  return "Siga para ler seu dia melhor.";
}

function trimWords(text: string, maxWords: number) {
  return String(text).split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}
