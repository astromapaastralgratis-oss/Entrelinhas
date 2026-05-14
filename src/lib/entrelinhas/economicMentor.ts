import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import type { ExecutivePresenceProfileId } from "@/src/types/executivePresence";
import type { ExecutiveScriptInput } from "@/lib/entrelinhas";
import type { ExecutivePresenceResultRow } from "@/types/database";

export type CompactExecutivePresenceContext = {
  profileName: string;
  communicationPattern: string;
  mainRisk: string;
  evolutionPoint: string;
  recommendedPhrases: string[];
};

export type AiExecutiveScriptJson = {
  strategicReading?: unknown;
  avoid?: unknown;
  bestPosture?: unknown;
  suggestedScript?: unknown;
  shortVersion?: unknown;
};

export type ExecutiveScriptSections = {
  strategicReading: string;
  risk: string;
  bestPosture: string;
  avoid: string;
  suggestedScript: string;
  shortVersion: string;
  firmerVersion: string;
  nextStep: string;
};

const sectionLabels: Array<{ key: keyof ExecutiveScriptSections; label: string }> = [
  { key: "strategicReading", label: "Leitura estratégica" },
  { key: "risk", label: "Risco da situação" },
  { key: "bestPosture", label: "Melhor postura" },
  { key: "avoid", label: "O que NÃO dizer" },
  { key: "suggestedScript", label: "Script pronto para usar" },
  { key: "shortVersion", label: "Versão curta" },
  { key: "firmerVersion", label: "Versão mais firme" },
  { key: "nextStep", label: "Próximo passo recomendado" }
];

const aiFieldLimits: Record<keyof AiExecutiveScriptJson, number> = {
  strategicReading: 420,
  avoid: 260,
  bestPosture: 320,
  suggestedScript: 720,
  shortVersion: 280
};

const situationTemplates: Record<string, Partial<ExecutiveScriptSections>> = {
  "Fui interrompida": {
    risk: "O risco é deixar a interrupção virar padrão ou reagir com irritação e perder o foco da ideia.",
    bestPosture: "Retome a palavra com calma, conclua seu ponto e conecte a fala à qualidade da decisão.",
    avoid: "Evite acusar, ironizar ou pedir permissão para terminar em tom defensivo.",
    shortVersion: "\"Vou concluir meu raciocínio e já conecto com o seu ponto.\""
  },
  "Roubaram minha ideia": {
    risk: "O risco é parecer ressentida ao recuperar crédito ou deixar sua autoria desaparecer.",
    bestPosture: "Recupere a origem da ideia com elegância e puxe a conversa para próximos passos.",
    avoid: "Evite acusações diretas ou comentários indiretos que aumentem tensão sem reposicionar sua contribuição.",
    shortVersion: "\"Quero retomar o ponto que trouxe inicialmente e ajudar a estruturar os próximos passos.\""
  },
  "Negociação salarial": {
    risk: "O risco é pedir validação pessoal em vez de sustentar valor, escopo e impacto.",
    bestPosture: "Conduza com dados, evolução de responsabilidade e uma proposta objetiva.",
    avoid: "Evite pedir desculpas pelo tema ou usar apenas \"acho que mereço\".",
    shortVersion: "\"Quero alinhar minha evolução de escopo, os resultados entregues e uma revisão de remuneração.\""
  },
  "Feedback difícil": {
    risk: "O risco é responder no impulso ou aceitar uma crítica ampla sem exemplos.",
    bestPosture: "Peça fatos, separe percepção de evidência e alinhe expectativa futura.",
    avoid: "Evite rebater antes de entender exemplos concretos.",
    shortVersion: "\"Quero entender exemplos específicos para separar fatos, percepção e próximos ajustes.\""
  },
  "Discordar do líder": {
    risk: "O risco é soar confrontativa demais ou cautelosa demais.",
    bestPosture: "Reconheça a direção, apresente o risco que você enxerga e ofereça uma alternativa.",
    avoid: "Evite abrir com um \"não concordo\" seco ou rodeios que escondam sua recomendação.",
    shortVersion: "\"Entendo a direção. Minha leitura aponta um risco e recomendo ajustarmos a rota.\""
  },
  "Definir limites": {
    risk: "O risco é aceitar um escopo inviável ou transformar o limite em justificativa longa.",
    bestPosture: "Declare o limite, mostre impacto em prioridades e ofereça uma escolha possível.",
    avoid: "Evite \"desculpa, mas\" ou aceitar sem renegociar prazo, escopo ou prioridade.",
    shortVersion: "\"Consigo apoiar se alinharmos prioridade e prazo. Do jeito atual, isso compromete entregas assumidas.\""
  }
};

export function buildDeterministicExecutiveSections(
  input: ExecutiveScriptInput,
  executivePresence?: CompactExecutivePresenceContext | null
): ExecutiveScriptSections {
  const situation = normalizeText(input.situation, "situação corporativa");
  const context = normalizeText(input.context, "o fato principal");
  const desiredOutcome = normalizeText(input.desiredOutcome, "alinhar expectativa e próximo passo");
  const people = normalizeText(input.peopleInvolved, "as pessoas envolvidas");
  const tone = normalizeText(input.tone, "Executivo");
  const template = situationTemplates[situation] ?? {};
  const profileSentence = executivePresence
    ? ` Pelo seu perfil ${executivePresence.profileName}, vale cuidar especialmente de ${executivePresence.evolutionPoint.toLowerCase()}`
    : "";
  const phrase = executivePresence?.recommendedPhrases[0];

  return {
    strategicReading:
      template.strategicReading ??
      `Essa conversa pede foco em fato, impacto e pedido claro. O objetivo não é se justificar; é conduzir a conversa para uma decisão melhor.${profileSentence}`,
    risk:
      template.risk ??
      `O risco é entrar reativa, explicar demais ou deixar a tensão tomar o centro da conversa.`,
    bestPosture:
      template.bestPosture ??
      `Use tom ${tone.toLowerCase()}, frases curtas e fatos observáveis. Seja específica sobre o impacto e feche com uma proposta.`,
    avoid:
      template.avoid ??
      `Evite generalizações, acusações amplas, pedidos de desculpa desnecessários e frases que coloquem a outra pessoa na defensiva.`,
    suggestedScript: `"Quero trazer esse ponto com clareza. O que aconteceu foi: ${context}. O impacto é que precisamos ${desiredOutcome}. Como isso envolve ${people}, minha proposta é alinharmos responsabilidades e próximo passo agora."${
      phrase ? `\n\nUma frase alinhada ao seu perfil: "${phrase}"` : ""
    }`,
    shortVersion:
      template.shortVersion ??
      `"Quero alinhar isso com clareza: aconteceu ${context}, o impacto é ${desiredOutcome} e minha proposta é definirmos o próximo passo."`,
    firmerVersion: `"Preciso ser direta: esse ponto afeta a qualidade da decisão. Para seguirmos bem, precisamos alinhar fatos, responsabilidades e próximos passos."`,
    nextStep: `Antes da conversa, anote três fatos, um impacto concreto e uma proposta. Depois, registre o combinado por mensagem.`
  };
}

export function buildDeterministicExecutiveScript(input: ExecutiveScriptInput, executivePresence?: CompactExecutivePresenceContext | null) {
  return composeExecutiveScript(buildDeterministicExecutiveSections(input, executivePresence));
}

export function composeExecutiveScript(sections: ExecutiveScriptSections) {
  return sectionLabels.map((section, index) => `${index + 1}. ${section.label}\n${sections[section.key]}`).join("\n\n");
}

export function buildCompactExecutivePrompt(input: ExecutiveScriptInput, fallback: ExecutiveScriptSections, executivePresence?: CompactExecutivePresenceContext | null) {
  const compactPayload = {
    situation: normalizeText(input.situation, "situação corporativa"),
    context: truncate(normalizeText(input.context, ""), 700),
    desiredOutcome: truncate(normalizeText(input.desiredOutcome, ""), 220),
    peopleInvolved: truncate(normalizeText(input.peopleInvolved, ""), 180),
    tone: normalizeText(input.tone, "Executivo"),
    executivePresence: executivePresence
      ? {
          profileName: executivePresence.profileName,
          communicationPattern: truncate(executivePresence.communicationPattern, 180),
          mainRisk: truncate(executivePresence.mainRisk, 160),
          evolutionPoint: truncate(executivePresence.evolutionPoint, 180),
          recommendedPhrases: executivePresence.recommendedPhrases.slice(0, 2).map((phrase) => truncate(phrase, 180))
        }
      : null,
    deterministicBase: {
      risk: fallback.risk,
      firmerVersion: fallback.firmerVersion,
      nextStep: fallback.nextStep
    }
  };

  return [
    "Gere adaptacoes curtas para uma mentora executiva do Entrelinhas.",
    "Não converse. Não explique o método. Retorne apenas JSON válido.",
    "Schema exato: strategicReading, avoid, bestPosture, suggestedScript, shortVersion.",
    "Tom: executivo, claro, humano, elegante, firme sem agressividade.",
    "Evite coach clichê, motivacional genérico e frases longas.",
    JSON.stringify(compactPayload)
  ].join("\n");
}

export function mergeAiExecutiveJsonWithFallback(rawOutput: string, fallback: ExecutiveScriptSections): { sections: ExecutiveScriptSections; usedAiFields: boolean } {
  const parsed = parseAiJson(rawOutput);
  if (!parsed) return { sections: fallback, usedAiFields: false };

  let usedAiFields = false;
  const sections = { ...fallback };
  const aiFields: Array<keyof AiExecutiveScriptJson> = ["strategicReading", "avoid", "bestPosture", "suggestedScript", "shortVersion"];

  for (const field of aiFields) {
    const value = sanitizeAiField(parsed[field], aiFieldLimits[field]);
    if (value) {
      sections[field] = value;
      usedAiFields = true;
    }
  }

  return { sections, usedAiFields };
}

export function buildCompactExecutivePresenceContext(row: Pick<ExecutivePresenceResultRow, "profile_id"> | null | undefined): CompactExecutivePresenceContext | null {
  if (!row || typeof row.profile_id !== "string") return null;
  const profile = executivePresenceProfiles[row.profile_id as ExecutivePresenceProfileId];
  if (!profile) return null;

  return {
    profileName: profile.name,
    communicationPattern: summarizeSentence(profile.communicationPattern, 170),
    mainRisk: summarizeSentence(profile.risks[0] ?? "", 150),
    evolutionPoint: summarizeSentence(profile.evolutionPoint, 170),
    recommendedPhrases: profile.startUsingPhrases.slice(0, 2).map((phrase) => summarizeSentence(phrase, 170))
  };
}

function parseAiJson(rawOutput: string): AiExecutiveScriptJson | null {
  try {
    const parsed = JSON.parse(stripJsonFences(rawOutput));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as AiExecutiveScriptJson;
  } catch {
    return null;
  }
}

function sanitizeAiField(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s{3,}/g, " ");
  if (!normalized) return null;
  if (normalized.length > maxLength) return null;
  return normalized;
}

function normalizeText(value: string | undefined | null, fallback: string) {
  const normalized = value?.trim();
  return normalized || fallback;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function summarizeSentence(value: string, maxLength: number) {
  return truncate(value.replace(/\s+/g, " ").trim(), maxLength);
}

function stripJsonFences(text: string) {
  return text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
}
