import type {
  GeneratedContentValidationChecks,
  GeneratedContentValidationInput,
  GeneratedContentValidationResult
} from "@/types/content-validation";

const medicalPromisePattern =
  /\b(cura|curar|curado|curada|tratamento|diagn[oó]stico|terapia garantida|vai sarar|resolve sua ansiedade|acaba com sua dor)\b/i;

const absolutePredictionPattern =
  /\b(com certeza|garantido|nunca mais|sempre vai|vai acontecer|destino inevit[aá]vel|100%|sem erro|previs[aã]o exata)\b/i;
const psychologicalDiagnosisPattern =
  /\b(voc[eê] tem ansiedade|voc[eê] tem depress[aã]o|seu trauma|diagn[oó]stico|transtorno|borderline|bipolar)\b/i;
const genericCopyPattern =
  /\b(conte[uú]do incr[ií]vel|n[aã]o perca|imperd[ií]vel|confira agora|acesse j[aá]|melhor conte[uú]do|transforme sua vida hoje)\b/i;

export function validateGeneratedContent(input: GeneratedContentValidationInput): GeneratedContentValidationResult {
  const copy = input.copy;
  const text = [
    copy?.title,
    copy?.subtitle,
    copy?.caption,
    copy?.cta,
    copy?.pinnedComment,
    ...(copy?.slides ?? []).flatMap((slide) => [slide?.title, slide?.subtitle])
  ]
    .filter(Boolean)
    .join(" ");

  const checks: GeneratedContentValidationChecks = {
    titleWordCount: wordCount(copy?.title) <= 12,
    subtitleWordCount: wordCount(copy?.subtitle) <= 18,
    hasCTA: Boolean(copy?.cta?.trim()),
    hasCaption: Boolean(copy?.caption?.trim()),
    hasHashtags: Boolean(copy?.hashtags && copy.hashtags.length >= 5 && copy.hashtags.length <= 8),
    noMedicalPromise: !medicalPromisePattern.test(text),
    noAbsolutePrediction: !absolutePredictionPattern.test(text),
    noPsychologicalDiagnosis: !psychologicalDiagnosisPattern.test(text),
    noGenericCopy: !genericCopyPattern.test(text),
    noRepeatedTheme: !isRepeatedTheme(input),
    visualPromptHasRatio: Boolean(input.visualPrompts?.length ? input.visualPrompts.every((prompt) => Boolean(prompt.ratio)) : true),
    visualPostReady: Boolean(
      input.visualPrompts?.length ? input.visualPrompts.every((prompt) => prompt.isPostReady !== false && !prompt.validationNotes?.length) : true
    )
  };

  const errors = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([key]) => validationMessages[key as keyof GeneratedContentValidationChecks]);

  const blockingKeys: Array<keyof GeneratedContentValidationChecks> = [
    "titleWordCount",
    "subtitleWordCount",
    "hasCaption",
    "noMedicalPromise",
    "noAbsolutePrediction",
    "noPsychologicalDiagnosis",
    "noGenericCopy",
    "visualPromptHasRatio",
    "visualPostReady"
  ];
  const blocked = blockingKeys.some((key) => !checks[key]);

  return {
    valid: errors.length === 0,
    blocked,
    checks,
    errors,
    warnings: errors.filter((error) => !blocked || !blockingMessages.has(error))
  };
}

export function assertValidGeneratedContent(input: GeneratedContentValidationInput) {
  const result = validateGeneratedContent(input);
  if (result.blocked) {
    throw new Error(`Conteudo gerado bloqueado: ${result.errors.join(" ")}`);
  }
  return result;
}

function isRepeatedTheme(input: GeneratedContentValidationInput) {
  if ((input.repetitionRisk ?? 0) >= 7) return true;
  if (!input.theme || !input.recentHistory?.length) return false;

  return input.recentHistory.some((item) => item.theme.toLowerCase() === input.theme?.toLowerCase());
}

function wordCount(text?: string) {
  return text?.split(/\s+/).filter(Boolean).length ?? 0;
}

const validationMessages: Record<keyof GeneratedContentValidationChecks, string> = {
  titleWordCount: "Titulo muito longo.",
  subtitleWordCount: "Subtitulo muito longo.",
  hasCTA: "Chamada para acao ausente.",
  hasCaption: "Falta legenda.",
  hasHashtags: "Faltam hashtags.",
  noMedicalPromise: "Conteudo contem promessa medica ou terapeutica.",
  noAbsolutePrediction: "Conteudo contem previsao absoluta ou promessa garantida.",
  noPsychologicalDiagnosis: "Conteudo parece diagnostico psicologico.",
  noGenericCopy: "Texto generico bloqueado.",
  noRepeatedTheme: "Tema repetitivo sinalizado pelo historico.",
  visualPromptHasRatio: "Estilo do post sem proporcao.",
  visualPostReady: "Este post ainda precisa de ajuste antes de publicar."
};

const blockingMessages = new Set([
  validationMessages.titleWordCount,
  validationMessages.subtitleWordCount,
  validationMessages.hasCaption,
  validationMessages.noMedicalPromise,
  validationMessages.noAbsolutePrediction,
  validationMessages.noPsychologicalDiagnosis,
  validationMessages.noGenericCopy,
  validationMessages.visualPromptHasRatio,
  validationMessages.visualPostReady
]);
