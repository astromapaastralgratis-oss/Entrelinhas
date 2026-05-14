import type {
  ExecutiveDynamic,
  ExecutivePresenceQuestionCriticality,
  ExecutivePresenceSubdimension,
  TraitKey
} from "@/src/types/executivePresence";

export const EXECUTIVE_PRESENCE_METHODOLOGY_VERSION = "2026-05-12-v2-weighted";

export const executivePresenceCriticalityWeights: Record<ExecutivePresenceQuestionCriticality, number> = {
  standard: 1,
  elevated: 1.25,
  critical: 1.5
};

export const executivePresenceSubdimensionLabels: Record<ExecutivePresenceSubdimension, string> = {
  assertividade: "Assertividade",
  influencia: "Influência",
  leitura_politica: "Leitura politica",
  regulacao_emocional: "Regulacao emocional",
  clareza_de_posicionamento: "Clareza de posicionamento",
  gestao_de_conflito: "Gestao de conflito",
  limites: "Limites",
  tomada_de_decisao: "Tomada de decisao",
  presenca_executiva: "Presença executiva",
  seguranca_relacional: "Seguranca relacional"
};

export const executiveDynamicLabels: Record<ExecutiveDynamic, string> = {
  hipercompetencia_silenciosa: "Hipercompetencia silenciosa",
  excesso_de_sustentacao_emocional: "Excesso de sustentacao emocional",
  lideranca_invisivel: "Liderança invisível",
  diplomacia_defensiva: "Diplomacia defensiva",
  firmeza_situacional: "Firmeza situacional",
  influencia_sem_ocupacao_de_espaco: "Influência sem ocupação de espaço",
  autocensura_estrategica: "Autocensura estrategica",
  excesso_de_adaptacao: "Excesso de adaptacao",
  sobrecarga_por_confiabilidade: "Sobrecarga por confiabilidade",
  validacao_por_performance: "Validacao por performance",
  controle_como_mecanismo_de_seguranca: "Controle como mecanismo de segurança",
  evitacao_de_conflito_politico: "Evitacao de conflito politico",
  presenca_forte_com_desgaste_interno: "Presença forte com desgaste interno"
};

export type ExecutivePresenceMethodologyOption = {
  optionId: string;
  traitKey: TraitKey;
  subdimension: ExecutivePresenceSubdimension;
  executiveDynamic: ExecutiveDynamic;
  behaviorSignal: string;
  interpretation: string;
  risk: string;
  feedback: string;
};

export type ExecutivePresenceMethodologyEntry = {
  questionId: string;
  observedSituation: string;
  evaluatedBehavior: string;
  criticality: ExecutivePresenceQuestionCriticality;
  weight: number;
  weightRationale: string;
  options: ExecutivePresenceMethodologyOption[];
};

const optionBlueprint: Record<TraitKey, Omit<ExecutivePresenceMethodologyOption, "optionId" | "traitKey">> = {
  direction: {
    subdimension: "assertividade",
    executiveDynamic: "firmeza_situacional",
    behaviorSignal: "Escolhe agir, delimitar e conduzir o proximo passo.",
    interpretation: "Indica preferência por direção, decisão e responsabilização visível.",
    risk: "Pode acelerar antes de mapear sensibilidades politicas ou relacionais.",
    feedback: "Manter firmeza, incluindo criterio e leitura de ambiente antes do fechamento."
  },
  influence: {
    subdimension: "influencia",
    executiveDynamic: "influencia_sem_ocupacao_de_espaco",
    behaviorSignal: "Busca adesao, narrativa e mobilizacao de pessoas.",
    interpretation: "Indica preferência por construir tracao e tornar a mensagem mais influente.",
    risk: "Pode buscar receptividade antes de declarar uma posição suficientemente clara.",
    feedback: "Converter narrativa em pedido explícito, decisao e autoria visivel."
  },
  diplomacy: {
    subdimension: "seguranca_relacional",
    executiveDynamic: "diplomacia_defensiva",
    behaviorSignal: "Prioriza clima, relação, timing e redução de tensao.",
    interpretation: "Indica sensibilidade relacional e capacidade de preservar confiança em temas sensíveis.",
    risk: "Pode suavizar limites, atrasar confronto necessário ou carregar custo emocional excessivo.",
    feedback: "Preservar elegancia sem diluir pedido, limite ou recomendação."
  },
  precision: {
    subdimension: "tomada_de_decisao",
    executiveDynamic: "controle_como_mecanismo_de_seguranca",
    behaviorSignal: "Busca dados, criterios, riscos e estrutura antes de avancar.",
    interpretation: "Indica preferência por consistência, preparo e redução de ambiguidade.",
    risk: "Pode explicar demais, adiar posição ou usar controle como forma de segurança.",
    feedback: "Transformar análise em recomendação executiva, com nível de confiança e próximo passo."
  }
};

const overrides: Record<string, Partial<Omit<ExecutivePresenceMethodologyOption, "optionId" | "traitKey">>> = {
  q02_o1: { subdimension: "presenca_executiva", executiveDynamic: "presenca_forte_com_desgaste_interno" },
  q02_o2: { subdimension: "presenca_executiva" },
  q02_o3: { subdimension: "regulacao_emocional", executiveDynamic: "autocensura_estrategica" },
  q03_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "evitacao_de_conflito_politico" },
  q04_o2: { subdimension: "presenca_executiva", executiveDynamic: "validacao_por_performance" },
  q04_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "hipercompetencia_silenciosa" },
  q05_o1: { subdimension: "clareza_de_posicionamento", executiveDynamic: "lideranca_invisivel" },
  q05_o2: { subdimension: "presenca_executiva", executiveDynamic: "lideranca_invisivel" },
  q05_o3: { subdimension: "leitura_politica", executiveDynamic: "diplomacia_defensiva" },
  q05_o4: { subdimension: "leitura_politica", executiveDynamic: "hipercompetencia_silenciosa" },
  q06_o1: { subdimension: "limites" },
  q06_o2: { subdimension: "limites" },
  q06_o3: { subdimension: "limites", executiveDynamic: "excesso_de_adaptacao" },
  q07_o3: { subdimension: "regulacao_emocional", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q08_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q09_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" },
  q10_o1: { subdimension: "regulacao_emocional", executiveDynamic: "presenca_forte_com_desgaste_interno" },
  q10_o3: { subdimension: "regulacao_emocional", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q11_o3: { subdimension: "leitura_politica", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q12_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "validacao_por_performance" },
  q13_o3: { subdimension: "seguranca_relacional", executiveDynamic: "excesso_de_adaptacao" },
  q14_o1: { subdimension: "presenca_executiva" },
  q14_o3: { subdimension: "leitura_politica" },
  q15_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q16_o3: { subdimension: "seguranca_relacional", executiveDynamic: "diplomacia_defensiva" },
  q17_o1: { subdimension: "leitura_politica" },
  q17_o2: { subdimension: "leitura_politica" },
  q17_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" },
  q18_o1: { subdimension: "limites" },
  q18_o3: { subdimension: "seguranca_relacional", executiveDynamic: "excesso_de_adaptacao" },
  q19_o1: { subdimension: "presenca_executiva" },
  q19_o2: { subdimension: "presenca_executiva", executiveDynamic: "lideranca_invisivel" },
  q19_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "validacao_por_performance" },
  q20_o1: { subdimension: "limites" },
  q20_o2: { subdimension: "presenca_executiva" },
  q20_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" }
};

const questionBlueprints = [
  ["q01", "Reunião sem foco", "Como a usuária reorganiza energia coletiva, decisão e critérios quando a conversa perde direção.", "standard", "Situação recorrente, mas menos reveladora de risco político ou exposição direta."],
  ["q02", "Interrupção", "Como recupera espaço, autoria e presença sem perder maturidade executiva.", "critical", "Revela ocupação de espaço, autoria e resposta sob exposição pública imediata."],
  ["q03", "Discordância com liderança", "Como sustenta divergência, critério político e segurança relacional.", "critical", "Mostra capacidade de sustentar posição quando há assimetria de poder."],
  ["q04", "Negociação salarial", "Como traduz entrega em valor, pedido e posição profissional.", "elevated", "Evidencia relação com valor, reconhecimento e pedido explícito."],
  ["q05", "Apropriação de ideia", "Como protege autoria, crédito e liderança sem escalar tensão desnecessária.", "critical", "Expõe padrões de autoria, visibilidade e proteção de contribuição estratégica."],
  ["q06", "Definicao de limites", "Como delimita capacidade, prioridade e combinados.", "critical", "Revela sustentacao de limite quando ha risco de sobrecarga ou desagrado."],
  ["q07", "Pressão", "Qual recurso de presença aparece primeiro em ambiente de urgência.", "elevated", "Mostra resposta inicial em tensão, mas com menor especificidade contextual."],
  ["q08", "Feedback injusto", "Como separa percepção, fato, imagem e resposta executiva.", "elevated", "Indica regulação, defesa de imagem e capacidade de resposta sem reatividade."],
  ["q09", "Apresentação sênior", "Como prepara mensagem, política, evidência e pedido de decisão.", "elevated", "Revela preparo de influência e leitura de audiência executiva."],
  ["q10", "Conversa carregada", "Como regula tensao, ambiguidade e necessidade de fechamento.", "critical", "Mostra padrao de regulacao emocional em conversa de alto custo relacional."],
  ["q11", "Comite divergente", "Como cria caminho entre interesses, critérios e responsabilidades.", "elevated", "Evidencia condução entre interesses e maturidade política."],
  ["q12", "Defesa de trabalho", "Como transforma entrega em reconhecimento, autoria e valor percebido.", "standard", "Importante para visibilidade, mas menos tensionada que situacoes de confronto direto."],
  ["q13", "Decisao dificil", "Como escolhe entre velocidade, consenso, impacto humano e risco.", "elevated", "Revela criterios de decisao em ambiguidade e trade-offs."],
  ["q14", "Posicionamento público", "Qual base de sustentação usa quando está visível.", "elevated", "Mostra sustentação de presença em exposição profissional."],
  ["q15", "Entrega critica atrasada", "Como conduz responsabilidade, urgencia, bloqueios e recuperacao.", "elevated", "Evidencia responsabilidade executiva sob risco de entrega."],
  ["q16", "Questionamento", "Como responde a objeção sem perder posição ou relação.", "elevated", "Revela resposta a contestação e capacidade de manter eixo."],
  ["q17", "Ambiente político", "O que observa primeiro quando poder, influência e narrativa estão em jogo.", "critical", "Mapeia leitura política, uma das variáveis mais sensíveis de presença executiva."],
  ["q18", "Pedido de apoio", "Como formula necessidade, impacto, contexto e expectativa.", "standard", "Relevante para comunicação, mas com menor exposição de conflito ou poder."],
  ["q19", "Subestimação", "Como reage quando precisa reposicionar percepção de valor.", "critical", "Revela resposta a desvalorização, visibilidade e reposicionamento de autoridade."],
  ["q20", "Próximo nível", "Qual capacidade a usuária reconhece como alavanca de evolução profissional.", "elevated", "Mostra direção de desenvolvimento percebida e tensão dominante de crescimento."]
] as const;

const traitOptionOrder: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];

export const executivePresenceMethodology: ExecutivePresenceMethodologyEntry[] = questionBlueprints.map(
  ([questionId, observedSituation, evaluatedBehavior, criticality, weightRationale]) => ({
    questionId,
    observedSituation,
    evaluatedBehavior,
    criticality,
    weight: executivePresenceCriticalityWeights[criticality],
    weightRationale,
    options: traitOptionOrder.map((traitKey, index) => {
      const optionId = `${questionId}_o${index + 1}`;
      return {
        optionId,
        traitKey,
        ...optionBlueprint[traitKey],
        ...overrides[optionId]
      };
    })
  })
);

export function getExecutivePresenceMethodologyEntry(questionId: string) {
  return executivePresenceMethodology.find((entry) => entry.questionId === questionId);
}

export function getExecutivePresenceMethodologyOption(questionId: string, optionId: string) {
  return getExecutivePresenceMethodologyEntry(questionId)?.options.find((option) => option.optionId === optionId);
}
