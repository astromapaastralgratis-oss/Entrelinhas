import type { ExecutivePresenceQuestion } from "@/src/types/executivePresence";

export const executivePresenceQuestions: ExecutivePresenceQuestion[] = [
  {
    id: "q01",
    format: "situational",
    text: "Quando uma conversa importante comeca a perder direcao, sua tendencia mais natural e:",
    options: [
      { id: "q01_o1", text: "Trazer a conversa para uma definicao objetiva, mesmo que ainda exista algum desconforto na sala.", traitKey: "direction" },
      { id: "q01_o2", text: "Reorganizar o sentido da conversa para que as pessoas enxerguem o impacto da decisao.", traitKey: "influence" },
      { id: "q01_o3", text: "Diminuir a tensao, escutar o que esta por tras das falas e reconstruir alinhamento.", traitKey: "diplomacy" },
      { id: "q01_o4", text: "Separar fatos, criterios e proximos passos antes de qualquer encaminhamento.", traitKey: "precision" }
    ]
  },
  {
    id: "q02",
    format: "situational",
    text: "Quando sua fala e interrompida em uma reuniao, o movimento que mais se aproxima do seu e:",
    options: [
      { id: "q02_o1", text: "Retomar a palavra e concluir o raciocinio sem pedir permissao demais.", traitKey: "direction" },
      { id: "q02_o2", text: "Usar uma frase curta, elegante e firme para recuperar atencao sem romper o clima.", traitKey: "influence" },
      { id: "q02_o3", text: "Esperar uma abertura mais segura para voltar ao ponto com menos exposicao.", traitKey: "diplomacy" },
      { id: "q02_o4", text: "Recolocar o argumento com mais estrutura para reduzir ruido e aumentar legitimidade.", traitKey: "precision" }
    ]
  },
  {
    id: "q03",
    format: "agreement",
    text: "Eu me sinto mais segura para discordar de uma lideranca quando:",
    options: [
      { id: "q03_o1", text: "Tenho clareza da posicao que quero sustentar e do limite que nao quero ceder.", traitKey: "direction" },
      { id: "q03_o2", text: "Consigo conectar minha divergencia ao resultado que o grupo quer proteger.", traitKey: "influence" },
      { id: "q03_o3", text: "Encontro um jeito respeitoso de discordar sem parecer que estou criando atrito.", traitKey: "diplomacy" },
      { id: "q03_o4", text: "Tenho evidencias suficientes para defender o ponto com consistencia.", traitKey: "precision" }
    ]
  },
  {
    id: "q04",
    format: "frequency",
    text: "Com que frequencia, ao falar sobre reconhecimento ou salario, voce percebe que sua preparacao vai primeiro para:",
    options: [
      { id: "q04_o1", text: "Definir o pedido com clareza e entrar na conversa sabendo qual resultado busca.", traitKey: "direction" },
      { id: "q04_o2", text: "Construir uma narrativa de valor que mostre evolucao, impacto e maturidade.", traitKey: "influence" },
      { id: "q04_o3", text: "Encontrar um tom cuidadoso para nao comprometer a relacao ou parecer inadequada.", traitKey: "diplomacy" },
      { id: "q04_o4", text: "Levantar entregas, numeros e referencias antes de se sentir pronta para pedir.", traitKey: "precision" }
    ]
  },
  {
    id: "q05",
    format: "situational",
    text: "Quando uma contribuicao sua aparece como se fosse de outra pessoa, voce tende a:",
    options: [
      { id: "q05_o1", text: "Recolocar sua autoria e assumir mais claramente a frente do tema.", traitKey: "direction" },
      { id: "q05_o2", text: "Reposicionar a historia da ideia mostrando como ela nasceu, evoluiu e gerou impacto.", traitKey: "influence" },
      { id: "q05_o3", text: "Escolher uma conversa mais reservada para proteger a relacao e reduzir exposicao.", traitKey: "diplomacy" },
      { id: "q05_o4", text: "Recuperar registros, contexto e sequencia dos fatos antes de agir.", traitKey: "precision" }
    ]
  },
  {
    id: "q06",
    format: "frequency",
    text: "Com que frequencia, quando precisa colocar um limite, sua energia se concentra em:",
    options: [
      { id: "q06_o1", text: "Dizer com simplicidade o que cabe, o que nao cabe e qual decisao precisa ser tomada.", traitKey: "direction" },
      { id: "q06_o2", text: "Mostrar que o limite protege prioridades maiores, nao apenas uma preferencia pessoal.", traitKey: "influence" },
      { id: "q06_o3", text: "Preservar a relacao enquanto renegocia expectativa, prazo ou disponibilidade.", traitKey: "diplomacy" },
      { id: "q06_o4", text: "Organizar escopo, capacidade e criterios para que o limite pareca inquestionavel.", traitKey: "precision" }
    ]
  },
  {
    id: "q07",
    format: "frequency",
    text: "Com que frequencia, em momentos de pressao, as pessoas parecem esperar de voce:",
    options: [
      { id: "q07_o1", text: "Uma decisao que destrave o assunto e reduza a indecisao do grupo.", traitKey: "direction" },
      { id: "q07_o2", text: "Uma forma de mobilizar energia e fazer as pessoas acreditarem na saida.", traitKey: "influence" },
      { id: "q07_o3", text: "Uma presenca que abaixe a temperatura e mantenha a conversa possivel.", traitKey: "diplomacy" },
      { id: "q07_o4", text: "Uma leitura fria dos fatos, riscos e hipoteses antes de qualquer movimento.", traitKey: "precision" }
    ]
  },
  {
    id: "q08",
    format: "frequency",
    text: "Com que frequencia, diante de um feedback que parece injusto, voce se percebe buscando primeiro:",
    options: [
      { id: "q08_o1", text: "Corrigir a percepcao com firmeza antes que ela se consolide.", traitKey: "direction" },
      { id: "q08_o2", text: "Reposicionar sua imagem com maturidade e mostrar outro enquadramento.", traitKey: "influence" },
      { id: "q08_o3", text: "Entender a origem do ruido para responder sem ampliar o conflito.", traitKey: "diplomacy" },
      { id: "q08_o4", text: "Pedir exemplos concretos para separar impressao de fato.", traitKey: "precision" }
    ]
  },
  {
    id: "q09",
    format: "situational",
    text: "Quando vai apresentar um projeto para pessoas seniores, sua preparacao costuma se apoiar mais em:",
    options: [
      { id: "q09_o1", text: "A recomendacao principal, o pedido de decisao e o que precisa acontecer depois.", traitKey: "direction" },
      { id: "q09_o2", text: "A mensagem que cria adesao rapida e faz o valor ficar evidente.", traitKey: "influence" },
      { id: "q09_o3", text: "As sensibilidades politicas, resistencias provaveis e relacoes envolvidas.", traitKey: "diplomacy" },
      { id: "q09_o4", text: "Numeros, premissas, riscos e perguntas dificeis que podem aparecer.", traitKey: "precision" }
    ]
  },
  {
    id: "q10",
    format: "situational",
    text: "Quando uma conversa fica carregada emocionalmente, seu corpo normalmente pede que voce:",
    options: [
      { id: "q10_o1", text: "Corte a ambiguidade e conduza a conversa para uma definicao.", traitKey: "direction" },
      { id: "q10_o2", text: "Reformule a mensagem para manter influencia sem entrar em confronto aberto.", traitKey: "influence" },
      { id: "q10_o3", text: "Escute mais um pouco para baixar a tensao antes de responder.", traitKey: "diplomacy" },
      { id: "q10_o4", text: "Volte aos fatos para impedir que interpretacoes soltas dominem a conversa.", traitKey: "precision" }
    ]
  },
  {
    id: "q11",
    format: "agreement",
    text: "Eu costumo ganhar mais espaco em conversas com opinioes divergentes quando:",
    options: [
      { id: "q11_o1", text: "Proponho uma rota e assumo responsabilidade pelo encaminhamento.", traitKey: "direction" },
      { id: "q11_o2", text: "Consigo conectar interesses diferentes em uma narrativa comum.", traitKey: "influence" },
      { id: "q11_o3", text: "Costuro acordos possiveis entre pessoas com prioridades distintas.", traitKey: "diplomacy" },
      { id: "q11_o4", text: "Organizo criterios para comparar alternativas de forma justa.", traitKey: "precision" }
    ]
  },
  {
    id: "q12",
    format: "frequency",
    text: "Com que frequencia, ao defender uma entrega sua, voce sente que precisa:",
    options: [
      { id: "q12_o1", text: "Apontar impacto, responsabilidade assumida e decisao esperada.", traitKey: "direction" },
      { id: "q12_o2", text: "Fazer o valor da entrega ficar memoravel para quem decide.", traitKey: "influence" },
      { id: "q12_o3", text: "Reconhecer contribuicoes do grupo enquanto afirma sua propria parte.", traitKey: "diplomacy" },
      { id: "q12_o4", text: "Apresentar evidencias, escopo e entregas com precisao para nao deixar margem.", traitKey: "precision" }
    ]
  },
  {
    id: "q13",
    format: "agreement",
    text: "Eu me sinto mais pronta para uma decisao dificil quando:",
    options: [
      { id: "q13_o1", text: "Consigo escolher a alternativa mais forte e sustentar o movimento.", traitKey: "direction" },
      { id: "q13_o2", text: "Existe consenso suficiente para a decisao ganhar tracao.", traitKey: "influence" },
      { id: "q13_o3", text: "Entendo o impacto nas pessoas antes de fechar posicao.", traitKey: "diplomacy" },
      { id: "q13_o4", text: "Comparei cenarios, riscos e consequencias com cuidado.", traitKey: "precision" }
    ]
  },
  {
    id: "q14",
    format: "frequency",
    text: "Com que frequencia, quando precisa se posicionar em publico, voce se apoia primeiro em:",
    options: [
      { id: "q14_o1", text: "Uma mensagem limpa e uma presenca que nao se desculpa por ocupar espaco.", traitKey: "direction" },
      { id: "q14_o2", text: "Energia, conexao e capacidade de fazer a sala acompanhar seu raciocinio.", traitKey: "influence" },
      { id: "q14_o3", text: "Percepcao do ambiente, timing e adaptacao ao publico.", traitKey: "diplomacy" },
      { id: "q14_o4", text: "Estrutura logica, dominio do conteudo e preparo para perguntas.", traitKey: "precision" }
    ]
  },
  {
    id: "q15",
    format: "situational",
    text: "Quando uma entrega critica esta atrasando e ha risco de desgaste, voce tende a:",
    options: [
      { id: "q15_o1", text: "Cobrar responsavel, prazo e decisao para evitar que o atraso vire normal.", traitKey: "direction" },
      { id: "q15_o2", text: "Reengajar as pessoas mostrando impacto, urgencia e sentido do movimento.", traitKey: "influence" },
      { id: "q15_o3", text: "Entender bloqueios e renegociar combinados sem expor demais ninguem.", traitKey: "diplomacy" },
      { id: "q15_o4", text: "Mapear dependencias, riscos e plano de recuperacao antes de escalar.", traitKey: "precision" }
    ]
  },
  {
    id: "q16",
    format: "agreement",
    text: "Eu respondo melhor a um questionamento sobre minha recomendacao quando:",
    options: [
      { id: "q16_o1", text: "Reafirmo o ponto central sem enfraquecer minha posicao.", traitKey: "direction" },
      { id: "q16_o2", text: "Transformo a objecao em uma oportunidade de alinhamento.", traitKey: "influence" },
      { id: "q16_o3", text: "Reconheco a preocupacao da outra pessoa antes de defender minha visao.", traitKey: "diplomacy" },
      { id: "q16_o4", text: "Explico premissas e dados que sustentam a conclusao.", traitKey: "precision" }
    ]
  },
  {
    id: "q17",
    format: "agreement",
    text: "Eu leio melhor ambientes politicamente sensiveis quando presto atencao em:",
    options: [
      { id: "q17_o1", text: "Quem decide, quem esta evitando decidir e qual movimento precisa ser feito.", traitKey: "direction" },
      { id: "q17_o2", text: "Quem influencia a conversa mesmo sem ter o cargo mais alto.", traitKey: "influence" },
      { id: "q17_o3", text: "Quais relacoes, historias e sensibilidades estao moldando o clima.", traitKey: "diplomacy" },
      { id: "q17_o4", text: "Quais fatos sustentam ou enfraquecem cada narrativa em circulacao.", traitKey: "precision" }
    ]
  },
  {
    id: "q18",
    format: "frequency",
    text: "Com que frequencia, ao pedir apoio, voce organiza o pedido a partir de:",
    options: [
      { id: "q18_o1", text: "O que precisa, de quem precisa e ate quando precisa.", traitKey: "direction" },
      { id: "q18_o2", text: "Por que esse apoio muda o resultado e aumenta o impacto coletivo.", traitKey: "influence" },
      { id: "q18_o3", text: "A disponibilidade, o momento e o contexto da outra pessoa.", traitKey: "diplomacy" },
      { id: "q18_o4", text: "Escopo, expectativa, criterio de qualidade e risco de desalinhamento.", traitKey: "precision" }
    ]
  },
  {
    id: "q19",
    format: "situational",
    text: "Quando percebe que esta sendo subestimada, sua resposta mais provavel e:",
    options: [
      { id: "q19_o1", text: "Ocupar mais espaco e colocar sua contribuicao na mesa com firmeza.", traitKey: "direction" },
      { id: "q19_o2", text: "Reposicionar sua imagem por meio de presenca, narrativa e consistencia publica.", traitKey: "influence" },
      { id: "q19_o3", text: "Construir confianca aos poucos sem transformar a situacao em disputa aberta.", traitKey: "diplomacy" },
      { id: "q19_o4", text: "Demonstrar preparo, entrega e consistencia ate que a percepcao mude.", traitKey: "precision" }
    ]
  },
  {
    id: "q20",
    format: "agreement",
    text: "Eu sinto que meu proximo nivel de carreira exige fortalecer principalmente:",
    options: [
      { id: "q20_o1", text: "Decisao, posicionamento e capacidade de sustentar limites.", traitKey: "direction" },
      { id: "q20_o2", text: "Influencia, visibilidade e capacidade de mobilizar pessoas.", traitKey: "influence" },
      { id: "q20_o3", text: "Criterio politico, negociacao e conversas de alta sensibilidade.", traitKey: "diplomacy" },
      { id: "q20_o4", text: "Pensamento estruturado, analise e recomendacoes mais solidas.", traitKey: "precision" }
    ]
  }
];
