import { buildDeterministicExecutiveScript } from "@/src/lib/entrelinhas";

export const situationOptions = [
  "Reuniao importante",
  "Negociacao salarial",
  "Feedback dificil",
  "Fui interrompida",
  "Roubaram minha ideia",
  "Discordar do lider",
  "Definir limites",
  "Me posicionar em reuniao"
];

export const toneOptions = ["Diplomatico", "Firme", "Executivo"];

export type ExecutiveScriptInput = {
  situation: string;
  context: string;
  desiredOutcome: string;
  peopleInvolved: string;
  tone: string;
};

export type ProfileForm = {
  full_name: string;
  current_role: string;
  seniority: string;
  industry: string;
  main_challenge: string;
  career_goal: string;
  preferred_style: string;
};

export const quickScripts = [
  {
    title: "Retomar espaco em reuniao",
    situation: "Interrupcao em reuniao",
    diplomatic: "Quero concluir meu raciocinio para que a equipe tenha o contexto completo. Em seguida, eu adoraria ouvir seu ponto.",
    firm: "Vou terminar meu ponto antes de abrirmos para comentarios. Preciso de mais trinta segundos.",
    executive: "Para mantermos a qualidade da decisao, vou fechar a linha de raciocinio e depois conecto com a sua contribuicao."
  },
  {
    title: "Recuperar credito por contribuicao",
    situation: "Credito por contribuicao",
    diplomatic: "Fico feliz que a ideia esteja avancando. Quero recuperar o ponto inicial que eu trouxe e contribuir com os proximos passos.",
    firm: "Essa proposta foi a linha que apresentei anteriormente. Quero garantir que o credito e a execucao fiquem claros daqui para frente.",
    executive: "Como essa iniciativa nasceu da estrutura que compartilhei, proponho que eu lidere a organizacao e alinhe responsabilidades com o grupo."
  },
  {
    title: "Discordar com criterio",
    situation: "Discordancia com lideranca",
    diplomatic: "Entendo a direcao. Vejo um risco adicional: se seguirmos assim, podemos comprometer prazo ou adesao.",
    firm: "Tenho uma preocupacao objetiva com esse caminho. Antes de decidirmos, preciso colocar os impactos que estou vendo.",
    executive: "Minha recomendacao e ajustarmos a rota. O racional e risco, custo de reversao e efeito politico da decisao."
  },
  {
    title: "Pedir reconhecimento",
    situation: "Negociacao salarial",
    diplomatic: "Gostaria de conversar sobre minha evolucao de escopo, entregas recentes e uma revisao de remuneracao compativel.",
    firm: "Meu escopo cresceu, os resultados sustentam a conversa e quero alinhar um plano concreto de revisao salarial.",
    executive: "Quero tratar minha remuneracao como reflexo de impacto, escopo e retencao. Trago dados e uma proposta objetiva."
  },
  {
    title: "Estabelecer limites",
    situation: "Limites de disponibilidade",
    diplomatic: "Consigo apoiar, mas preciso alinhar prioridade e prazo para entregar com qualidade sem comprometer o que ja esta combinado.",
    firm: "Nao consigo absorver isso sem retirar outra entrega da fila. Vamos decidir o que sera rebaixado em prioridade.",
    executive: "Para proteger qualidade e previsibilidade, preciso de uma decisao de prioridade antes de assumir esse novo escopo."
  },
  {
    title: "Responder a um retorno injusto",
    situation: "Feedback dificil",
    diplomatic: "Obrigada por trazer. Quero entender exemplos concretos para separar percepcao, fato e acoes de melhoria.",
    firm: "Quero responder com seriedade, mas preciso de evidencias especificas. Sem exemplos, fica dificil transformar isso em acao justa.",
    executive: "Vamos qualificar esse retorno com fatos, impacto e expectativa. Assim conseguimos tratar a questao sem ruido ou julgamento amplo."
  }
];

export function buildFallbackExecutiveScript(input: ExecutiveScriptInput) {
  return buildDeterministicExecutiveScript(input);
}

export function parseExecutiveScriptSections(content: string) {
  const labels = [
    { source: "Leitura estrategica", title: "Direcionamento estrategico" },
    { source: "Risco da situacao", title: "Risco da situacao" },
    { source: "Melhor postura", title: "Melhor postura" },
    { source: "O que NAO dizer", title: "O que evitar" },
    { source: "Script pronto para usar", title: "Plano de acao" },
    { source: "Versao curta", title: "Versao objetiva" },
    { source: "Versao mais firme", title: "Versao mais firme" },
    { source: "Proximo passo recomendado", title: "Proximo movimento recomendado" }
  ];

  return labels.map((label, index) => {
    const normalized = normalizeContent(content);
    const current = `${index + 1}. ${label.source}`;
    const next = labels[index + 1] ? `${index + 2}. ${labels[index + 1].source}` : null;
    const start = normalized.indexOf(current);
    const end = next ? normalized.indexOf(next) : normalized.length;
    const body = start >= 0 ? normalized.slice(start + current.length, end >= 0 ? end : normalized.length).trim() : "";
    return { title: label.title, body: body || "Ainda nao gerado." };
  });
}

function normalizeContent(content: string) {
  return content
    .replace(/Leitura\s+estrat\S+gica/gi, "Leitura estrategica")
    .replace(/Risco\s+da\s+situa\S+o/gi, "Risco da situacao")
    .replace(/O\s+que\s+N\S+O\s+dizer/gi, "O que NAO dizer")
    .replace(/Vers\S+o\s+curta/gi, "Versao curta")
    .replace(/Vers\S+o\s+mais\s+firme/gi, "Versao mais firme")
    .replace(/Pr\S+ximo\s+passo\s+recomendado/gi, "Proximo passo recomendado")
    .replace(/Minha\s+leitura/gi, "Minha avaliacao")
    .replace(/A\s+leitura/gi, "A avaliacao");
}
