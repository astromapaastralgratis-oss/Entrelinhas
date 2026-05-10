import type { ExecutivePresenceQuestion } from "@/src/types/executivePresence";

export const executivePresenceQuestions: ExecutivePresenceQuestion[] = [
  {
    id: "q01",
    text: "Em uma reunião importante, quando a conversa começa a perder foco, você tende a:",
    options: [
      { id: "q01_o1", text: "Retomar o objetivo e propor uma decisão clara para o grupo.", traitKey: "direction" },
      { id: "q01_o2", text: "Reorganizar a conversa conectando as pessoas ao impacto da decisão.", traitKey: "influence" },
      { id: "q01_o3", text: "Acolher os pontos levantados e buscar um alinhamento sem tensionar o ambiente.", traitKey: "diplomacy" },
      { id: "q01_o4", text: "Pedir dados, critérios e próximos passos antes de avançar.", traitKey: "precision" }
    ]
  },
  {
    id: "q02",
    text: "Quando alguém interrompe sua fala, sua reação mais natural é:",
    options: [
      { id: "q02_o1", text: "Retomar a palavra com firmeza e concluir seu raciocínio.", traitKey: "direction" },
      { id: "q02_o2", text: "Usar uma frase elegante para recuperar atenção sem perder presença.", traitKey: "influence" },
      { id: "q02_o3", text: "Esperar uma brecha e voltar ao ponto preservando o clima.", traitKey: "diplomacy" },
      { id: "q02_o4", text: "Recolocar o argumento com mais estrutura para evitar ruído.", traitKey: "precision" }
    ]
  },
  {
    id: "q03",
    text: "Ao discordar de uma liderança, você se sente mais segura quando:",
    options: [
      { id: "q03_o1", text: "Sabe exatamente qual recomendação quer defender.", traitKey: "direction" },
      { id: "q03_o2", text: "Consegue mostrar como sua visão favorece o objetivo coletivo.", traitKey: "influence" },
      { id: "q03_o3", text: "Encontra uma forma respeitosa de apresentar a divergência.", traitKey: "diplomacy" },
      { id: "q03_o4", text: "Tem evidências suficientes para sustentar cada ponto.", traitKey: "precision" }
    ]
  },
  {
    id: "q04",
    text: "Diante de uma negociação salarial, seu primeiro movimento seria:",
    options: [
      { id: "q04_o1", text: "Definir o pedido e conduzir a conversa com objetividade.", traitKey: "direction" },
      { id: "q04_o2", text: "Construir uma narrativa de valor, impacto e evolução.", traitKey: "influence" },
      { id: "q04_o3", text: "Preparar uma abordagem cuidadosa para manter a relação positiva.", traitKey: "diplomacy" },
      { id: "q04_o4", text: "Reunir entregas, métricas e referências de mercado.", traitKey: "precision" }
    ]
  },
  {
    id: "q05",
    text: "Quando uma ideia sua é apropriada por outra pessoa, você tende a:",
    options: [
      { id: "q05_o1", text: "Reivindicar o crédito e propor assumir a frente do tema.", traitKey: "direction" },
      { id: "q05_o2", text: "Reposicionar sua autoria mostrando como a ideia evoluiu.", traitKey: "influence" },
      { id: "q05_o3", text: "Abrir uma conversa individual para evitar exposição desnecessária.", traitKey: "diplomacy" },
      { id: "q05_o4", text: "Recuperar registros, contexto e sequência dos fatos.", traitKey: "precision" }
    ]
  },
  {
    id: "q06",
    text: "Quando precisa estabelecer limites, você costuma priorizar:",
    options: [
      { id: "q06_o1", text: "Dizer o que é possível e o que não é, sem rodeios.", traitKey: "direction" },
      { id: "q06_o2", text: "Explicar o limite mostrando impacto em prioridades maiores.", traitKey: "influence" },
      { id: "q06_o3", text: "Preservar a relação enquanto renegocia expectativa e prazo.", traitKey: "diplomacy" },
      { id: "q06_o4", text: "Organizar escopo, capacidade e critérios de prioridade.", traitKey: "precision" }
    ]
  },
  {
    id: "q07",
    text: "Em situações de pressão, sua força mais visível costuma ser:",
    options: [
      { id: "q07_o1", text: "Tomar decisão e destravar o andamento.", traitKey: "direction" },
      { id: "q07_o2", text: "Mobilizar pessoas em torno de uma saída possível.", traitKey: "influence" },
      { id: "q07_o3", text: "Reduzir tensão e manter a conversa produtiva.", traitKey: "diplomacy" },
      { id: "q07_o4", text: "Separar fatos, hipóteses e riscos com clareza.", traitKey: "precision" }
    ]
  },
  {
    id: "q08",
    text: "Quando recebe um feedback injusto, você tende a buscar:",
    options: [
      { id: "q08_o1", text: "Uma resposta firme para corrigir a percepção.", traitKey: "direction" },
      { id: "q08_o2", text: "Uma forma de reposicionar sua imagem com maturidade.", traitKey: "influence" },
      { id: "q08_o3", text: "Uma conversa cuidadosa para entender a origem do ruído.", traitKey: "diplomacy" },
      { id: "q08_o4", text: "Exemplos concretos para transformar percepção em fato.", traitKey: "precision" }
    ]
  },
  {
    id: "q09",
    text: "Ao apresentar um projeto para pessoas seniores, você se prepara melhor quando:",
    options: [
      { id: "q09_o1", text: "Define a recomendação principal e o pedido de decisão.", traitKey: "direction" },
      { id: "q09_o2", text: "Cria uma mensagem que gere adesão rapidamente.", traitKey: "influence" },
      { id: "q09_o3", text: "Mapeia sensibilidades políticas e possíveis resistências.", traitKey: "diplomacy" },
      { id: "q09_o4", text: "Domina números, premissas e riscos antes da reunião.", traitKey: "precision" }
    ]
  },
  {
    id: "q10",
    text: "Quando uma conversa fica emocionalmente carregada, você costuma:",
    options: [
      { id: "q10_o1", text: "Cortar a ambiguidade e trazer a conversa para uma decisão.", traitKey: "direction" },
      { id: "q10_o2", text: "Reformular a mensagem para manter influência sem confronto.", traitKey: "influence" },
      { id: "q10_o3", text: "Baixar a temperatura e escutar antes de responder.", traitKey: "diplomacy" },
      { id: "q10_o4", text: "Voltar aos fatos para reduzir interpretações soltas.", traitKey: "precision" }
    ]
  },
  {
    id: "q11",
    text: "Em um comitê com opiniões divergentes, você se destaca quando:",
    options: [
      { id: "q11_o1", text: "Propõe uma rota e assume responsabilidade pelo encaminhamento.", traitKey: "direction" },
      { id: "q11_o2", text: "Conecta interesses diferentes em uma narrativa comum.", traitKey: "influence" },
      { id: "q11_o3", text: "Costura acordos possíveis entre pessoas com prioridades distintas.", traitKey: "diplomacy" },
      { id: "q11_o4", text: "Organiza critérios para comparar alternativas com justiça.", traitKey: "precision" }
    ]
  },
  {
    id: "q12",
    text: "Quando precisa defender seu trabalho, você prefere:",
    options: [
      { id: "q12_o1", text: "Apontar impacto, responsabilidade e decisão esperada.", traitKey: "direction" },
      { id: "q12_o2", text: "Mostrar valor de forma memorável e convincente.", traitKey: "influence" },
      { id: "q12_o3", text: "Reconhecer contribuições do grupo enquanto afirma sua parte.", traitKey: "diplomacy" },
      { id: "q12_o4", text: "Apresentar evidências, entregas e escopo com precisão.", traitKey: "precision" }
    ]
  },
  {
    id: "q13",
    text: "Quando há uma decisão difícil em aberto, seu instinto é:",
    options: [
      { id: "q13_o1", text: "Definir a opção mais forte e avançar.", traitKey: "direction" },
      { id: "q13_o2", text: "Criar consenso suficiente para a decisão ganhar tração.", traitKey: "influence" },
      { id: "q13_o3", text: "Ouvir impactos nas pessoas antes de fechar posição.", traitKey: "diplomacy" },
      { id: "q13_o4", text: "Comparar cenários, riscos e consequências.", traitKey: "precision" }
    ]
  },
  {
    id: "q14",
    text: "Quando precisa falar em público no trabalho, você se apoia mais em:",
    options: [
      { id: "q14_o1", text: "Clareza de mensagem e presença firme.", traitKey: "direction" },
      { id: "q14_o2", text: "Energia, conexão e capacidade de engajar.", traitKey: "influence" },
      { id: "q14_o3", text: "Leitura do ambiente e adaptação ao público.", traitKey: "diplomacy" },
      { id: "q14_o4", text: "Estrutura lógica e domínio do conteúdo.", traitKey: "precision" }
    ]
  },
  {
    id: "q15",
    text: "Se uma entrega crítica está atrasando, você tende a:",
    options: [
      { id: "q15_o1", text: "Cobrar definição de responsável, prazo e decisão.", traitKey: "direction" },
      { id: "q15_o2", text: "Reengajar as pessoas mostrando impacto e urgência.", traitKey: "influence" },
      { id: "q15_o3", text: "Entender bloqueios e renegociar combinados com cuidado.", traitKey: "diplomacy" },
      { id: "q15_o4", text: "Mapear dependências, riscos e plano de recuperação.", traitKey: "precision" }
    ]
  },
  {
    id: "q16",
    text: "Quando alguém questiona sua recomendação, você responde melhor quando:",
    options: [
      { id: "q16_o1", text: "Reafirma o ponto central e sustenta sua posição.", traitKey: "direction" },
      { id: "q16_o2", text: "Transforma a objeção em oportunidade de alinhamento.", traitKey: "influence" },
      { id: "q16_o3", text: "Reconhece a preocupação antes de defender sua visão.", traitKey: "diplomacy" },
      { id: "q16_o4", text: "Explica premissas e dados que levaram à conclusão.", traitKey: "precision" }
    ]
  },
  {
    id: "q17",
    text: "Em ambientes politicamente sensíveis, você naturalmente observa:",
    options: [
      { id: "q17_o1", text: "Quem decide e qual movimento precisa ser feito.", traitKey: "direction" },
      { id: "q17_o2", text: "Quem influencia a conversa mesmo sem autoridade formal.", traitKey: "influence" },
      { id: "q17_o3", text: "Quais relações, histórias e sensibilidades estão em jogo.", traitKey: "diplomacy" },
      { id: "q17_o4", text: "Quais fatos sustentam ou enfraquecem cada narrativa.", traitKey: "precision" }
    ]
  },
  {
    id: "q18",
    text: "Quando precisa pedir apoio, você costuma:",
    options: [
      { id: "q18_o1", text: "Ser direta sobre o que precisa e até quando.", traitKey: "direction" },
      { id: "q18_o2", text: "Mostrar por que o apoio faz diferença para o resultado.", traitKey: "influence" },
      { id: "q18_o3", text: "Considerar disponibilidade e contexto da outra pessoa.", traitKey: "diplomacy" },
      { id: "q18_o4", text: "Detalhar escopo, expectativa e critérios de qualidade.", traitKey: "precision" }
    ]
  },
  {
    id: "q19",
    text: "Quando percebe que está sendo subestimada, sua melhor resposta seria:",
    options: [
      { id: "q19_o1", text: "Ocupar espaço com firmeza e colocar sua contribuição na mesa.", traitKey: "direction" },
      { id: "q19_o2", text: "Reposicionar sua imagem por meio de presença e narrativa.", traitKey: "influence" },
      { id: "q19_o3", text: "Construir confiança gradualmente sem entrar em disputa aberta.", traitKey: "diplomacy" },
      { id: "q19_o4", text: "Demonstrar consistência com entregas, dados e preparo.", traitKey: "precision" }
    ]
  },
  {
    id: "q20",
    text: "No seu próximo nível de carreira, você mais quer fortalecer:",
    options: [
      { id: "q20_o1", text: "Capacidade de decidir, se posicionar e sustentar limites.", traitKey: "direction" },
      { id: "q20_o2", text: "Influência, visibilidade e capacidade de mobilizar pessoas.", traitKey: "influence" },
      { id: "q20_o3", text: "Leitura política, negociação e conversas de alta sensibilidade.", traitKey: "diplomacy" },
      { id: "q20_o4", text: "Pensamento estruturado, análise e recomendações mais sólidas.", traitKey: "precision" }
    ]
  }
];
