import type { ExecutivePresenceQuestion } from "@/src/types/executivePresence";

export const executivePresenceQuestions: ExecutivePresenceQuestion[] = [
  {
    id: "q01",
    format: "situational",
    text: "Quando uma conversa importante começa a perder direção, sua tendência mais natural é:",
    options: [
      { id: "q01_o1", text: "Trazer a conversa para uma definição objetiva, mesmo que ainda exista algum desconforto na sala.", traitKey: "direction" },
      { id: "q01_o2", text: "Reorganizar o sentido da conversa para que as pessoas enxerguem o impacto da decisão.", traitKey: "influence" },
      { id: "q01_o3", text: "Diminuir a tensão, escutar o que está por trás das falas e reconstruir alinhamento.", traitKey: "diplomacy" },
      { id: "q01_o4", text: "Separar fatos, critérios e próximos passos antes de qualquer encaminhamento.", traitKey: "precision" }
    ]
  },
  {
    id: "q02",
    format: "situational",
    text: "Quando sua fala é interrompida em uma reunião, o movimento que mais se aproxima do seu é:",
    options: [
      { id: "q02_o1", text: "Retomar a palavra e concluir o raciocínio sem pedir permissão demais.", traitKey: "direction" },
      { id: "q02_o2", text: "Usar uma frase curta, elegante e firme para recuperar atenção sem romper o clima.", traitKey: "influence" },
      { id: "q02_o3", text: "Esperar uma abertura mais segura para voltar ao ponto com menos exposição.", traitKey: "diplomacy" },
      { id: "q02_o4", text: "Recolocar o argumento com mais estrutura para reduzir ruído e aumentar legitimidade.", traitKey: "precision" }
    ]
  },
  {
    id: "q03",
    format: "agreement",
    text: "Eu me sinto mais segura para discordar de uma liderança quando:",
    options: [
      { id: "q03_o1", text: "Tenho clareza da posição que quero sustentar e do limite que não quero ceder.", traitKey: "direction" },
      { id: "q03_o2", text: "Consigo conectar minha divergência ao resultado que o grupo quer proteger.", traitKey: "influence" },
      { id: "q03_o3", text: "Encontro um jeito respeitoso de discordar sem parecer que estou criando atrito.", traitKey: "diplomacy" },
      { id: "q03_o4", text: "Tenho evidências suficientes para defender o ponto com consistência.", traitKey: "precision" }
    ]
  },
  {
    id: "q04",
    format: "frequency",
    text: "Com que frequência, ao falar sobre reconhecimento ou salário, você percebe que sua preparação vai primeiro para:",
    options: [
      { id: "q04_o1", text: "Definir o pedido com clareza e entrar na conversa sabendo qual resultado busca.", traitKey: "direction" },
      { id: "q04_o2", text: "Construir uma narrativa de valor que mostre evolução, impacto e maturidade.", traitKey: "influence" },
      { id: "q04_o3", text: "Encontrar um tom cuidadoso para não comprometer a relação ou parecer inadequada.", traitKey: "diplomacy" },
      { id: "q04_o4", text: "Levantar entregas, números e referências antes de se sentir pronta para pedir.", traitKey: "precision" }
    ]
  },
  {
    id: "q05",
    format: "situational",
    text: "Quando uma contribuição sua aparece como se fosse de outra pessoa, você tende a:",
    options: [
      { id: "q05_o1", text: "Recolocar sua autoria e assumir mais claramente a frente do tema.", traitKey: "direction" },
      { id: "q05_o2", text: "Reposicionar a história da ideia mostrando como ela nasceu, evoluiu e gerou impacto.", traitKey: "influence" },
      { id: "q05_o3", text: "Escolher uma conversa mais reservada para proteger a relação e reduzir exposição.", traitKey: "diplomacy" },
      { id: "q05_o4", text: "Recuperar registros, contexto e sequência dos fatos antes de agir.", traitKey: "precision" }
    ]
  },
  {
    id: "q06",
    format: "frequency",
    text: "Com que frequência, quando precisa colocar um limite, sua energia se concentra em:",
    options: [
      { id: "q06_o1", text: "Dizer com simplicidade o que cabe, o que não cabe e qual decisão precisa ser tomada.", traitKey: "direction" },
      { id: "q06_o2", text: "Mostrar que o limite protege prioridades maiores, não apenas uma preferência pessoal.", traitKey: "influence" },
      { id: "q06_o3", text: "Preservar a relação enquanto renegocia expectativa, prazo ou disponibilidade.", traitKey: "diplomacy" },
      { id: "q06_o4", text: "Organizar escopo, capacidade e critérios para que o limite pareça inquestionável.", traitKey: "precision" }
    ]
  },
  {
    id: "q07",
    format: "frequency",
    text: "Com que frequência, em momentos de pressão, as pessoas parecem esperar de você:",
    options: [
      { id: "q07_o1", text: "Uma decisão que destrave o assunto e reduza a indecisão do grupo.", traitKey: "direction" },
      { id: "q07_o2", text: "Uma forma de mobilizar energia e fazer as pessoas acreditarem na saída.", traitKey: "influence" },
      { id: "q07_o3", text: "Uma presença que abaixe a temperatura e mantenha a conversa possível.", traitKey: "diplomacy" },
      { id: "q07_o4", text: "Uma leitura fria dos fatos, riscos e hipóteses antes de qualquer movimento.", traitKey: "precision" }
    ]
  },
  {
    id: "q08",
    format: "frequency",
    text: "Com que frequência, diante de um feedback que parece injusto, você se percebe buscando primeiro:",
    options: [
      { id: "q08_o1", text: "Corrigir a percepção com firmeza antes que ela se consolide.", traitKey: "direction" },
      { id: "q08_o2", text: "Reposicionar sua imagem com maturidade e mostrar outro enquadramento.", traitKey: "influence" },
      { id: "q08_o3", text: "Entender a origem do ruído para responder sem ampliar o conflito.", traitKey: "diplomacy" },
      { id: "q08_o4", text: "Pedir exemplos concretos para separar impressão de fato.", traitKey: "precision" }
    ]
  },
  {
    id: "q09",
    format: "situational",
    text: "Quando vai apresentar um projeto para pessoas seniores, sua preparação costuma se apoiar mais em:",
    options: [
      { id: "q09_o1", text: "A recomendação principal, o pedido de decisão e o que precisa acontecer depois.", traitKey: "direction" },
      { id: "q09_o2", text: "A mensagem que cria adesão rápida e faz o valor ficar evidente.", traitKey: "influence" },
      { id: "q09_o3", text: "As sensibilidades políticas, resistências prováveis e relações envolvidas.", traitKey: "diplomacy" },
      { id: "q09_o4", text: "Números, premissas, riscos e perguntas difíceis que podem aparecer.", traitKey: "precision" }
    ]
  },
  {
    id: "q10",
    format: "situational",
    text: "Quando uma conversa fica carregada emocionalmente, seu corpo normalmente pede que você:",
    options: [
      { id: "q10_o1", text: "Corte a ambiguidade e conduza a conversa para uma definição.", traitKey: "direction" },
      { id: "q10_o2", text: "Reformule a mensagem para manter influência sem entrar em confronto aberto.", traitKey: "influence" },
      { id: "q10_o3", text: "Escute mais um pouco para baixar a tensão antes de responder.", traitKey: "diplomacy" },
      { id: "q10_o4", text: "Volte aos fatos para impedir que interpretações soltas dominem a conversa.", traitKey: "precision" }
    ]
  },
  {
    id: "q11",
    format: "agreement",
    text: "Eu costumo ganhar mais espaço em conversas com opiniões divergentes quando:",
    options: [
      { id: "q11_o1", text: "Proponho uma rota e assumo responsabilidade pelo encaminhamento.", traitKey: "direction" },
      { id: "q11_o2", text: "Consigo conectar interesses diferentes em uma narrativa comum.", traitKey: "influence" },
      { id: "q11_o3", text: "Costuro acordos possíveis entre pessoas com prioridades distintas.", traitKey: "diplomacy" },
      { id: "q11_o4", text: "Organizo critérios para comparar alternativas de forma justa.", traitKey: "precision" }
    ]
  },
  {
    id: "q12",
    format: "frequency",
    text: "Com que frequência, ao defender uma entrega sua, você sente que precisa:",
    options: [
      { id: "q12_o1", text: "Apontar impacto, responsabilidade assumida e decisão esperada.", traitKey: "direction" },
      { id: "q12_o2", text: "Fazer o valor da entrega ficar memorável para quem decide.", traitKey: "influence" },
      { id: "q12_o3", text: "Reconhecer contribuições do grupo enquanto afirma sua própria parte.", traitKey: "diplomacy" },
      { id: "q12_o4", text: "Apresentar evidências, escopo e entregas com precisão para não deixar margem.", traitKey: "precision" }
    ]
  },
  {
    id: "q13",
    format: "agreement",
    text: "Eu me sinto mais pronta para uma decisão difícil quando:",
    options: [
      { id: "q13_o1", text: "Consigo escolher a alternativa mais forte e sustentar o movimento.", traitKey: "direction" },
      { id: "q13_o2", text: "Existe consenso suficiente para a decisão ganhar tração.", traitKey: "influence" },
      { id: "q13_o3", text: "Entendo o impacto nas pessoas antes de fechar posição.", traitKey: "diplomacy" },
      { id: "q13_o4", text: "Comparei cenários, riscos e consequências com cuidado.", traitKey: "precision" }
    ]
  },
  {
    id: "q14",
    format: "frequency",
    text: "Com que frequência, quando precisa se posicionar em público, você se apoia primeiro em:",
    options: [
      { id: "q14_o1", text: "Uma mensagem limpa e uma presença que não se desculpa por ocupar espaço.", traitKey: "direction" },
      { id: "q14_o2", text: "Energia, conexão e capacidade de fazer a sala acompanhar seu raciocínio.", traitKey: "influence" },
      { id: "q14_o3", text: "Percepção do ambiente, timing e adaptação ao público.", traitKey: "diplomacy" },
      { id: "q14_o4", text: "Estrutura lógica, domínio do conteúdo e preparo para perguntas.", traitKey: "precision" }
    ]
  },
  {
    id: "q15",
    format: "situational",
    text: "Quando uma entrega crítica está atrasando e há risco de desgaste, você tende a:",
    options: [
      { id: "q15_o1", text: "Cobrar responsável, prazo e decisão para evitar que o atraso vire normal.", traitKey: "direction" },
      { id: "q15_o2", text: "Reengajar as pessoas mostrando impacto, urgência e sentido do movimento.", traitKey: "influence" },
      { id: "q15_o3", text: "Entender bloqueios e renegociar combinados sem expor demais ninguém.", traitKey: "diplomacy" },
      { id: "q15_o4", text: "Mapear dependências, riscos e plano de recuperação antes de escalar.", traitKey: "precision" }
    ]
  },
  {
    id: "q16",
    format: "agreement",
    text: "Eu respondo melhor a um questionamento sobre minha recomendação quando:",
    options: [
      { id: "q16_o1", text: "Reafirmo o ponto central sem enfraquecer minha posição.", traitKey: "direction" },
      { id: "q16_o2", text: "Transformo a objeção em uma oportunidade de alinhamento.", traitKey: "influence" },
      { id: "q16_o3", text: "Reconheço a preocupação da outra pessoa antes de defender minha visão.", traitKey: "diplomacy" },
      { id: "q16_o4", text: "Explico premissas e dados que sustentam a conclusão.", traitKey: "precision" }
    ]
  },
  {
    id: "q17",
    format: "agreement",
    text: "Eu leio melhor ambientes politicamente sensíveis quando presto atenção em:",
    options: [
      { id: "q17_o1", text: "Quem decide, quem está evitando decidir e qual movimento precisa ser feito.", traitKey: "direction" },
      { id: "q17_o2", text: "Quem influência a conversa mesmo sem ter o cargo mais alto.", traitKey: "influence" },
      { id: "q17_o3", text: "Quais relações, histórias e sensibilidades estão moldando o clima.", traitKey: "diplomacy" },
      { id: "q17_o4", text: "Quais fatos sustentam ou enfraquecem cada narrativa em circulação.", traitKey: "precision" }
    ]
  },
  {
    id: "q18",
    format: "frequency",
    text: "Com que frequência, ao pedir apoio, você organiza o pedido a partir de:",
    options: [
      { id: "q18_o1", text: "O que precisa, de quem precisa e até quando precisa.", traitKey: "direction" },
      { id: "q18_o2", text: "Por que esse apoio muda o resultado e aumenta o impacto coletivo.", traitKey: "influence" },
      { id: "q18_o3", text: "A disponibilidade, o momento e o contexto da outra pessoa.", traitKey: "diplomacy" },
      { id: "q18_o4", text: "Escopo, expectativa, critério de qualidade e risco de desalinhamento.", traitKey: "precision" }
    ]
  },
  {
    id: "q19",
    format: "situational",
    text: "Quando percebe que está sendo subestimada, sua resposta mais provável é:",
    options: [
      { id: "q19_o1", text: "Ocupar mais espaço e colocar sua contribuição na mesa com firmeza.", traitKey: "direction" },
      { id: "q19_o2", text: "Reposicionar sua imagem por meio de presença, narrativa e consistência pública.", traitKey: "influence" },
      { id: "q19_o3", text: "Construir confiança aos poucos sem transformar a situação em disputa aberta.", traitKey: "diplomacy" },
      { id: "q19_o4", text: "Demonstrar preparo, entrega e consistência até que a percepção mude.", traitKey: "precision" }
    ]
  },
  {
    id: "q20",
    format: "agreement",
    text: "Eu sinto que meu próximo nível de carreira exige fortalecer principalmente:",
    options: [
      { id: "q20_o1", text: "Decisão, posicionamento e capacidade de sustentar limites.", traitKey: "direction" },
      { id: "q20_o2", text: "Influência, visibilidade e capacidade de mobilizar pessoas.", traitKey: "influence" },
      { id: "q20_o3", text: "Critério político, negociação e conversas de alta sensibilidade.", traitKey: "diplomacy" },
      { id: "q20_o4", text: "Pensamento estruturado, análise e recomendações mais sólidas.", traitKey: "precision" }
    ]
  }
];
