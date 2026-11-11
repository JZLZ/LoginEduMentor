export interface SubmoduleQuestion {
  id: number
  title: string
  year: string
  difficulty: "Fácil" | "Média" | "Difícil"
  tri: number
  statement: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface SubmoduleItem {
  id: number
  number: number
  shortName: string
  fullName: string
  resumoBadge: string
  resumoText: string
  exemploTitle: string
  exemploBadge: string
  exemploText: string
  questions: SubmoduleQuestion[]
}

export interface ModuleFormula {
  title: string
  formula: string
  details: Array<{ label: string; value: string }>
}

export interface ModuleInfo {
  number: number
  tag: string
  name: string
  title: string
  resumoBadge: string
  resumoText: string
  exemploTitle: string
  exemploBadge: string
  exemploText: string
  formulas: ModuleFormula[]
  submodules: SubmoduleItem[]
}

export const FUNCOES_SUBMODULES: SubmoduleItem[] = [
  {
    id: 1,
    number: 1,
    shortName: "1. Introdução às Funções",
    fullName: "Funções do primeiro grau",
    resumoBadge: "Teoria & Fórmulas",
    resumoText:
      "Uma função do 1º grau tem a forma f(x) = ax + b, com a ≠ 0.\nO coeficiente 'a' define a inclinação; 'b' é o ponto onde a reta corta o eixo y.\nA raiz é x = -b/a (onde f(x) = 0).",
    exemploTitle: "EXEMPLO",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Se f(x) = 2x + 1, então f(3) = 2 · 3 + 1 = 7.\nA reta corta o eixo y em (0, 1) e é crescente (a > 0).",
    questions: [
      {
        id: 1,
        title: "ENEM - Corrida por Aplicativo",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 710,
        statement:
          "Um usuário contratou um serviço de transporte com tarifa fixa de R$ 4,50 mais R$ 2,20 por quilômetro percorrido. Ao final de um trajeto de 15 km, quanto o passageiro pagará?",
        options: ["R$ 33,00", "R$ 35,50", "R$ 37,50", "R$ 41,20", "R$ 42,50"],
        correctIndex: 2,
        explanation:
          "A lei da função é V(x) = 2,20x + 4,50. Para x = 15 km: V(15) = 2,20(15) + 4,50 = 33,00 + 4,50 = R$ 37,50.",
      },
      {
        id: 2,
        title: "ENEM - Forma Geral da Função do 1º Grau",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 690,
        statement: "Qual é a forma geral da função do 1º grau?",
        options: ["f(x) = ax + b", "f(x) = ax²", "f(x) = a / x", "f(x) = aˣ"],
        correctIndex: 0,
        explanation:
          'A forma geral é f(x) = ax + b: "a" é o coeficiente angular e "b" o linear.',
      },
      {
        id: 3,
        title: "ENEM - Ponto de Equilíbrio (Zero da Função)",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 745,
        statement:
          "Uma microempresa calcula seu lucro mensal através da função L(x) = 50x - 1200, onde x é a quantidade de unidades produzidas. Quantas peças precisam ser vendidas para não ter nem lucro nem prejuízo?",
        options: ["12 peças", "20 peças", "24 peças", "30 peças", "48 peças"],
        correctIndex: 2,
        explanation:
          "O ponto de equilíbrio ocorre no zero da função: L(x) = 0 => 50x - 1200 = 0 => 50x = 1200 => x = 24 peças.",
      },
      {
        id: 4,
        title: "ENEM - Depreciação Linear",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 725,
        statement:
          "Um equipamento industrial foi adquirido por R$ 60.000 e sofre depreciação linear constante de R$ 5.000 ao ano. Em quantos anos seu valor contábil atingirá R$ 20.000?",
        options: ["6 anos", "8 anos", "10 anos", "12 anos", "15 anos"],
        correctIndex: 1,
        explanation:
          "A função do valor é V(t) = 60000 - 5000t. Fazendo V(t) = 20000: 60000 - 5000t = 20000 => 5000t = 40000 => t = 8 anos.",
      },
      {
        id: 5,
        title: "ENEM - Comparação de Planos",
        year: "ENEM 2023",
        difficulty: "Média",
        tri: 760,
        statement:
          "O plano A cobra R$ 30 fixos mais R$ 0,50 por minuto. O plano B cobra R$ 10 fixos mais R$ 0,90 por minuto. A partir de quantos minutos de ligação o plano A passa a ser mais barato que o plano B?",
        options: ["40 minutos", "50 minutos", "60 minutos", "70 minutos", "80 minutos"],
        correctIndex: 1,
        explanation:
          "Igualando os custos: 30 + 0,50m = 10 + 0,90m => 20 = 0,40m => m = 50 minutos. Acima de 50 minutos, o plano A é mais econômico.",
      },
      {
        id: 6,
        title: "ENEM - Intercepto com o Eixo Vertical",
        year: "ENEM 2022",
        difficulty: "Fácil",
        tri: 660,
        statement:
          "Na função linear f(x) = -4x + 18, as coordenadas do ponto onde o gráfico corta o eixo das ordenadas (y) são:",
        options: ["(0, 18)", "(18, 0)", "(4,5; 0)", "(0, -4)", "(18, -4)"],
        correctIndex: 0,
        explanation:
          "O corte no eixo y ocorre quando x = 0: f(0) = -4(0) + 18 = 18. Logo, o ponto é (0, 18).",
      },
      {
        id: 7,
        title: "ENEM - Reservatório com Vazão Constante",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 680,
        statement:
          "Uma caixa-d'água com capacidade de 1.000 litros está cheia e começa a ser esvaziada por uma torneira com vazão uniforme de 25 litros por minuto. Qual o volume de água restante após 16 minutos?",
        options: ["400 L", "500 L", "600 L", "700 L", "750 L"],
        correctIndex: 2,
        explanation:
          "A lei de volume é V(t) = 1000 - 25t. Para t = 16: V(16) = 1000 - 25(16) = 1000 - 400 = 600 litros.",
      },
      {
        id: 8,
        title: "ENEM - Salário Fixo com Comissão Linear",
        year: "ENEM 2023",
        difficulty: "Difícil",
        tri: 790,
        statement:
          "Um consultor recebe remuneração composta por um fixo de R$ 2.400 mais 3,5% de comissão sobre o montante x de vendas intermediadas. Qual expressão algébrica representa o rendimento R(x) em reais?",
        options: [
          "R(x) = 2400 + 35x",
          "R(x) = 2400 + 3,5x",
          "R(x) = 2400 + 0,35x",
          "R(x) = 2400 + 0,035x",
          "R(x) = 2403,5x",
        ],
        correctIndex: 3,
        explanation:
          "A taxa percentual de 3,5% equivale a 3,5/100 = 0,035. Portanto, R(x) = 2400 + 0,035x.",
      },
    ],
  },
  {
    id: 2,
    number: 2,
    shortName: "2. Função do 1º Grau",
    fullName: "Funções do primeiro grau",
    resumoBadge: "Teoria & Fórmulas",
    resumoText:
      "Uma função do 1º grau tem a forma f(x) = ax + b, com a ≠ 0.\nO coeficiente 'a' define a inclinação; 'b' é o ponto onde a reta corta o eixo y.\nA raiz é x = -b/a (onde f(x) = 0).",
    exemploTitle: "EXEMPLO",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Se f(x) = 2x + 1, então f(3) = 2 · 3 + 1 = 7.\nA reta corta o eixo y em (0, 1) e é crescente (a > 0).",
    questions: [
      {
        id: 1,
        title: "ENEM - Alcance de Projétil",
        year: "ENEM 2022",
        difficulty: "Fácil",
        tri: 700,
        statement:
          "Um projétil é lançado e tem sua altura em metros dada por h(t) = -5t² + 40t, com t em segundos. Após quantos segundos do lançamento o projétil atinge o solo novamente?",
        options: ["4 s", "6 s", "8 s", "10 s", "12 s"],
        correctIndex: 2,
        explanation:
          "O projétil atinge o solo quando h(t) = 0 => -5t(t - 8) = 0 => t = 0 (partida) ou t = 8 s (impacto).",
      },
      {
        id: 2,
        title: "ENEM - Forma Geral da Função do 1º Grau",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 690,
        statement: "Qual é a forma geral da função do 1º grau?",
        options: ["f(x) = ax + b", "f(x) = ax²", "f(x) = a / x", "f(x) = aˣ"],
        correctIndex: 0,
        explanation:
          'A forma geral é f(x) = ax + b: "a" é o coeficiente angular e "b" o linear.',
      },
      {
        id: 3,
        title: "ENEM - Ponto de Interseção com Eixo Y",
        year: "ENEM 2020",
        difficulty: "Fácil",
        tri: 650,
        statement:
          "A parábola de equação f(x) = 3x² - 5x - 12 intercepta o eixo vertical no ponto de coordenadas:",
        options: ["(0, -12)", "(-12, 0)", "(0, 3)", "(3, -12)", "(0, -5)"],
        correctIndex: 0,
        explanation:
          "Substituindo x = 0 na equação: f(0) = 3(0)² - 5(0) - 12 = -12. Logo, o ponto é (0, -12).",
      },
      {
        id: 4,
        title: "ENEM - Soma e Produto das Raízes",
        year: "ENEM 2023",
        difficulty: "Média",
        tri: 730,
        statement:
          "Seja a função f(x) = 2x² - 12x + 10. A soma (S) e o produto (P) de suas raízes valem, respectivamente:",
        options: ["S = 6 e P = 5", "S = -6 e P = 5", "S = 12 e P = 10", "S = 6 e P = -5", "S = -12 e P = 10"],
        correctIndex: 0,
        explanation:
          "Pelas relações de Girard: Soma = -b/a = -(-12)/2 = 6; Produto = c/a = 10/2 = 5.",
      },
      {
        id: 5,
        title: "ENEM - Concavidade da Parábola",
        year: "ENEM 2022",
        difficulty: "Fácil",
        tri: 670,
        statement:
          "Se o coeficiente 'a' de uma função do 2º grau é negativo (a < 0), o gráfico correspondente:",
        options: [
          "É uma parábola com concavidade voltada para cima e ponto de mínimo",
          "É uma parábola com concavidade voltada para baixo e ponto de máximo",
          "É uma reta decrescente que não possui vértice",
          "É uma parábola sempre acima do eixo x",
          "Não possui raízes reais",
        ],
        correctIndex: 1,
        explanation:
          "Quando a < 0, a concavidade é voltada para baixo (formato de U invertido), possuindo um ponto de máximo no vértice.",
      },
      {
        id: 6,
        title: "ENEM - Modelagem de Receita Quadrática",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 750,
        statement:
          "O preço de venda de um item varia com a quantidade produzida x segundo P(x) = 100 - 2x. A receita total R(x) = x · P(x) é uma função quadrática dada por:",
        options: [
          "R(x) = 100x - 2x²",
          "R(x) = 100 - 2x²",
          "R(x) = -2x + 100",
          "R(x) = 2x² - 100x",
          "R(x) = 100x² - 2x",
        ],
        correctIndex: 0,
        explanation:
          "Multiplicando x por P(x): R(x) = x(100 - 2x) = 100x - 2x² = -2x² + 100x.",
      },
      {
        id: 7,
        title: "ENEM - Raízes Simétricas",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 740,
        statement:
          "Uma função f(x) = ax² + bx + c possui raízes simétricas x₁ = -3 e x₂ = 3. O valor do coeficiente b é:",
        options: ["0", "3", "-3", "6", "9"],
        correctIndex: 0,
        explanation:
          "A soma das raízes é -b/a. Como (-3) + 3 = 0, temos -b/a = 0 => b = 0.",
      },
      {
        id: 8,
        title: "ENEM - Variação do Sinal da Função",
        year: "ENEM 2023",
        difficulty: "Difícil",
        tri: 785,
        statement:
          "Para quais valores de x a função quadrática f(x) = -x² + 4x + 5 assume valores estritamente positivos (f(x) > 0)?",
        options: [
          "-1 < x < 5",
          "x < -1 ou x > 5",
          "-5 < x < 1",
          "x > 5",
          "x < -1",
        ],
        correctIndex: 0,
        explanation:
          "As raízes de -x² + 4x + 5 = 0 são x = -1 e x = 5. Como a = -1 < 0 (concavidade para baixo), a função é positiva entre as raízes: -1 < x < 5.",
      },
    ],
  },
  {
    id: 3,
    number: 3,
    shortName: "3. Vértice & Extremos",
    fullName: "Vértice da Parábola e Máximos/Mínimos",
    resumoBadge: "Otimização TRI",
    resumoText:
      "O vértice V(Xv, Yv) é o ponto onde a função quadrática atinge seu valor extremo. Xv = -b/(2a) indica o valor de x que produz o resultado ótimo (ponto de máximo se a < 0, ou ponto de mínimo se a > 0). Yv = -Δ/(4a) (ou f(Xv)) indica o valor extremo alcançado (altura máxima, lucro máximo, custo mínimo). A parábola é perfeitamente simétrica em relação à reta vertical x = Xv.",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "O lucro L de uma fábrica em função da quantidade vendida q é L(q) = -2q² + 80q - 300 (em milhares de reais). A quantidade ótima de produção é Xv = -80/(2 · (-2)) = 20 mil unidades. O lucro máximo alcançado é L(20) = -2(400) + 80(20) - 300 = R$ 500.000,00.",
    questions: [
      {
        id: 1,
        title: "ENEM - Altura Máxima de Foguete",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 710,
        statement:
          "A altura h(t) de um pequeno foguete em metros é descrita por h(t) = -5t² + 30t + 5, com t em segundos. A altura máxima atingida pelo foguete é de:",
        options: ["30 m", "45 m", "50 m", "55 m", "60 m"],
        correctIndex: 2,
        explanation:
          "O tempo do vértice é t_v = -30/(2 · (-5)) = 3 s. A altura máxima é h(3) = -5(9) + 30(3) + 5 = -45 + 90 + 5 = 50 metros.",
      },
      {
        id: 2,
        title: "ENEM - Lucro Máximo de Loja",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 750,
        statement:
          "O lucro mensal de uma gráfica é modelado por L(x) = -x² + 60x - 500, onde x é a quantidade de pacotes impressos. Qual quantidade x maximiza o lucro?",
        options: ["20 pacotes", "30 pacotes", "40 pacotes", "50 pacotes", "60 pacotes"],
        correctIndex: 1,
        explanation:
          "A quantidade que maximiza o lucro é a abscissa do vértice: Xv = -b/(2a) = -60/(2 · (-1)) = 30 pacotes.",
      },
      {
        id: 3,
        title: "ENEM - Área Máxima com Cerca",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 760,
        statement:
          "Um fazendeiro possui 80 metros de cerca para delimitar um pasto retangular encostado em um muro de pedra (usará cerca em apenas 3 lados). A área máxima que pode cercar é:",
        options: ["400 m²", "600 m²", "800 m²", "1.000 m²", "1.600 m²"],
        correctIndex: 2,
        explanation:
          "Se a largura for x, o comprimento será 80 - 2x. A área é A(x) = x(80 - 2x) = -2x² + 80x. O Xv = -80/(2 · (-2)) = 20 m. Área máxima = A(20) = 20(80 - 40) = 800 m².",
      },
      {
        id: 4,
        title: "ENEM - Custo Mínimo de Operação",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 740,
        statement:
          "O custo operacional diário de uma van de entregas é C(v) = 0,2v² - 16v + 400, onde v é a velocidade média em km/h. Para qual velocidade o custo diário é mínimo?",
        options: ["30 km/h", "35 km/h", "40 km/h", "45 km/h", "50 km/h"],
        correctIndex: 2,
        explanation:
          "Como a = 0,2 > 0, o custo é mínimo no vértice: v_v = -(-16)/(2 · 0,2) = 16 / 0,4 = 40 km/h.",
      },
      {
        id: 5,
        title: "ENEM - Eixo de Simetria da Parábola",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "Uma ponte em arco parabólico possui apoios no solo nos pontos x = 10 m e x = 50 m. A reta vertical que representa o eixo de simetria do arco é:",
        options: ["x = 25", "x = 30", "x = 35", "x = 40", "x = 60"],
        correctIndex: 1,
        explanation:
          "O eixo de simetria passa pelo ponto médio entre as raízes: Xv = (10 + 50) / 2 = 60 / 2 = 30 metros.",
      },
      {
        id: 6,
        title: "ENEM - Fórmula do Y do Vértice",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 735,
        statement:
          "Para a função f(x) = -2x² + 8x - 3, o valor máximo assumido por f(x) no conjunto dos reais é:",
        options: ["3", "5", "8", "10", "13"],
        correctIndex: 1,
        explanation:
          "Xv = -8 / (2 · (-2)) = 2. Calculando f(2): f(2) = -2(4) + 8(2) - 3 = -8 + 16 - 3 = 5.",
      },
      {
        id: 7,
        title: "ENEM - Otimização de Preço de Ingresso",
        year: "ENEM 2021",
        difficulty: "Difícil",
        tri: 795,
        statement:
          "Em um cinema, com o ingresso a R$ 20, 200 pessoas comparecem. A cada R$ 1 de aumento no ingresso, 5 pessoas deixam de ir. O preço do ingresso que gera a receita máxima é:",
        options: ["R$ 25", "R$ 30", "R$ 35", "R$ 40", "R$ 45"],
        correctIndex: 1,
        explanation:
          "Seja x o aumento em reais. Preço = (20 + x), público = (200 - 5x). Receita = (20 + x)(200 - 5x) = -5x² + 100x + 4000. Xv = -100 / (2 · (-5)) = 10 reais de aumento. Preço ótimo = 20 + 10 = R$ 30.",
      },
      {
        id: 8,
        title: "ENEM - Interpretação Gráfica do Vértice",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 720,
        statement:
          "Quando uma questão do ENEM pergunta 'qual é o valor máximo atingido pelo lucro', ela exige o cálculo de:",
        options: [
          "X do vértice (Xv)",
          "Y do vértice (Yv)",
          "Discriminante delta (Δ)",
          "Raiz positiva da equação",
          "Coeficiente linear c",
        ],
        correctIndex: 1,
        explanation:
          "Xv representa 'quando' ou 'qual quantidade' gera o máximo/mínimo; Yv representa o 'valor máximo ou mínimo atingido'.",
      },
    ],
  },
  {
    id: 4,
    number: 4,
    shortName: "4. Composta & Inversa",
    fullName: "Função Composta e Inversa",
    resumoBadge: "Operações & Bijeção",
    resumoText:
      "Na composição (f ∘ g)(x) = f(g(x)), aplica-se primeiro g(x) e depois f ao resultado. A função inversa f⁻¹(x) só existe se f for bijetora (injetora e sobrejetora). Para determinar algebricamente f⁻¹(x): troca-se y por f(x), isola-se a variável x em função de y, e por fim invertem-se os papéis de x e y. O gráfico de f⁻¹ é a reflexão simétrica de f em relação à bissetriz y = x.",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Para converter temperatura de Celsius para Fahrenheit: F(C) = 1,8C + 32. Para obter a inversa que calcula Celsius a partir de Fahrenheit: F - 32 = 1,8C => C(F) = (F - 32) / 1,8. Em 86°F: C(86) = (86 - 32)/1,8 = 54/1,8 = 30°C.",
    questions: [
      {
        id: 1,
        title: "ENEM - Composição Linear de Funções",
        year: "ENEM 2022",
        difficulty: "Fácil",
        tri: 700,
        statement:
          "Dadas as funções f(x) = 2x + 3 e g(x) = 4x - 1, o valor numérico de f(g(2)) é igual a:",
        options: ["11", "15", "17", "19", "21"],
        correctIndex: 2,
        explanation:
          "Primeiro calcula-se g(2) = 4(2) - 1 = 7. Em seguida, f(7) = 2(7) + 3 = 14 + 3 = 17.",
      },
      {
        id: 2,
        title: "ENEM - Inversa da Função Afim",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 710,
        statement:
          "A lei da função inversa de f(x) = 3x - 6 é dada por:",
        options: [
          "f⁻¹(x) = (x + 6) / 3",
          "f⁻¹(x) = (x - 6) / 3",
          "f⁻¹(x) = 3x + 6",
          "f⁻¹(x) = -3x + 6",
          "f⁻¹(x) = 1 / (3x - 6)",
        ],
        correctIndex: 0,
        explanation:
          "y = 3x - 6 => y + 6 = 3x => x = (y + 6) / 3. Permutando as variáveis: f⁻¹(x) = (x + 6) / 3.",
      },
      {
        id: 3,
        title: "ENEM - Condição para Existência de Inversa",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 740,
        statement:
          "Para que uma função real f: A → B admita função inversa f⁻¹: B → A, é indispensável que f seja:",
        options: ["Apenas injetora", "Apenas sobrejetora", "Bijetora", "Constante", "Estritamente decrescente"],
        correctIndex: 2,
        explanation:
          "Uma função só possui inversa quando cada elemento do contradomínio corresponde a um único elemento do domínio, ou seja, quando é bijetora (injetora e sobrejetora).",
      },
      {
        id: 4,
        title: "ENEM - Aplicação em Escalas Térmicas",
        year: "ENEM 2023",
        difficulty: "Média",
        tri: 730,
        statement:
          "A relação entre Kelvin (K) e Celsius (C) é K = C + 273. A função que expressa Celsius em função de Kelvin é:",
        options: ["C = K - 273", "C = K + 273", "C = 273 - K", "C = 273K", "C = K / 273"],
        correctIndex: 0,
        explanation:
          "Isolando C na equação K = C + 273 obtém-se diretamente C = K - 273.",
      },
      {
        id: 5,
        title: "ENEM - Expressão de Composta f(f(x))",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 750,
        statement:
          "Seja f(x) = 5x - 4. A expressão algébrica de f(f(x)) é:",
        options: ["25x - 24", "25x - 16", "10x - 8", "25x² - 16", "5x - 20"],
        correctIndex: 0,
        explanation:
          "f(f(x)) = 5(f(x)) - 4 = 5(5x - 4) - 4 = 25x - 20 - 4 = 25x - 24.",
      },
      {
        id: 6,
        title: "ENEM - Simetria do Gráfico da Inversa",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "Os gráficos de uma função bijetora f(x) e de sua inversa f⁻¹(x) são sempre simétricos em relação:",
        options: [
          "Ao eixo das abscissas (eixo x)",
          "Ao eixo das ordenadas (eixo y)",
          "À bissetriz dos quadrantes ímpares (reta y = x)",
          "À bissetriz dos quadrantes pares (reta y = -x)",
          "À origem (0, 0)",
        ],
        correctIndex: 2,
        explanation:
          "Por trocarem x por y, f e f⁻¹ possuem simetria axial perfeita em torno da bissetriz y = x.",
      },
      {
        id: 7,
        title: "ENEM - Desconto Sucessivo com Composição",
        year: "ENEM 2023",
        difficulty: "Média",
        tri: 760,
        statement:
          "Uma loja oferece um cupom de 10% de desconto (f(x) = 0,90x) e um abatimento fixo de R$ 50 no caixa (g(x) = x - 50). Se a ordem for aplicar primeiro o cupom e depois o abatimento, a função do valor pago é:",
        options: [
          "V(x) = 0,90x - 50",
          "V(x) = 0,90(x - 50)",
          "V(x) = x - 45",
          "V(x) = 0,90x - 45",
          "V(x) = 0,10x - 50",
        ],
        correctIndex: 0,
        explanation:
          "Aplicando f primeiro e depois g: g(f(x)) = f(x) - 50 = 0,90x - 50.",
      },
      {
        id: 8,
        title: "ENEM - Ponto Fixo da Inversa",
        year: "ENEM 2020",
        difficulty: "Difícil",
        tri: 780,
        statement:
          "Se uma função f(x) possui inversa f⁻¹(x) e sabe-se que f(4) = 7, então f⁻¹(7) vale obrigatoriamente:",
        options: ["-4", "4", "7", "1/4", "1/7"],
        correctIndex: 1,
        explanation:
          "Pela definição da inversa, se f(a) = b, então f⁻¹(b) = a. Como f(4) = 7, segue que f⁻¹(7) = 4.",
      },
    ],
  },
  {
    id: 5,
    number: 5,
    shortName: "5. Exponencial",
    fullName: "Função Exponencial & Crescimento",
    resumoBadge: "Crescimento & Decaimento",
    resumoText:
      "Uma função exponencial tem a lei f(x) = C · a^x (C ≠ 0, a > 0 e a ≠ 1). Se a > 1 a função é estritamente crescente (ex: juros compostos, proliferação celular); se 0 < a < 1 a função é estritamente decrescente (ex: desintegração radioativa, meia-vida). O gráfico nunca toca o eixo x (assíntota horizontal y = 0) e intercepta o eixo y no ponto (0, C).",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Um medicamento tem meia-vida de 4 horas no organismo. A quantidade residual após t horas é Q(t) = 100 · (0,5)^(t/4) mg. Após 12 horas: Q(12) = 100 · (0,5)³ = 100 · 0,125 = 12,5 mg no sangue.",
    questions: [
      {
        id: 1,
        title: "ENEM - Proliferação de Bactérias",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 710,
        statement:
          "Uma colônia com 200 bactérias dobra de tamanho a cada hora: N(t) = 200 · 2^t. Quantas bactérias existirão após 5 horas?",
        options: ["1.000", "3.200", "6.400", "12.800", "25.600"],
        correctIndex: 2,
        explanation:
          "N(5) = 200 · 2⁵ = 200 · 32 = 6.400 bactérias.",
      },
      {
        id: 2,
        title: "ENEM - Meia-Vida de Isótopo",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 740,
        statement:
          "Um elemento radioativo tem meia-vida de 8 dias. Se a amostra inicial continha 80 gramas, quanta massa restará após 24 dias?",
        options: ["5 g", "10 g", "20 g", "40 g", "60 g"],
        correctIndex: 1,
        explanation:
          "Em 24 dias ocorrem 24/8 = 3 meias-vidas. Massa final = 80 / (2³) = 80 / 8 = 10 gramas.",
      },
      {
        id: 3,
        title: "ENEM - Equação Exponencial Básica",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "O valor de x que satisfaz a equação 3^(2x - 1) = 81 é:",
        options: ["2", "2,5", "3", "3,5", "4"],
        correctIndex: 1,
        explanation:
          "81 = 3⁴. Logo, 3^(2x - 1) = 3⁴ => 2x - 1 = 4 => 2x = 5 => x = 2,5.",
      },
      {
        id: 4,
        title: "ENEM - Juros Compostos como Exponencial",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 735,
        statement:
          "Um capital de R$ 5.000 aplicado a juros compostos de 10% ao ano rende montante M(t) = 5000 · (1,1)^t. A base da exponencial (1,1) indica que o montante:",
        options: [
          "Cresce linearmente R$ 500 ao ano",
          "Multiplica-se por 1,1 a cada ano decorrido",
          "Dobra a cada 10 anos",
          "Diminui 10% a cada ciclo",
          "Permanece constante após o primeiro ano",
        ],
        correctIndex: 1,
        explanation:
          "Em funções exponenciais da forma M(t) = C · a^t, o fator 'a' representa a taxa multiplicativa fixa por período.",
      },
      {
        id: 5,
        title: "ENEM - Gráfico da Função Exponencial",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 680,
        statement:
          "O gráfico da função exponencial f(x) = (0,5)^x possui como característica essencial ser:",
        options: [
          "Estritamente decrescente e assintótico ao eixo x",
          "Estritamente crescente com raiz em x = 0",
          "Uma parábola com vértice no ponto (0, 1)",
          "Uma reta de inclinação negativa",
          "Um arco de circunferência",
        ],
        correctIndex: 0,
        explanation:
          "Como a base 0 < 0,5 < 1, a função decresce continuamente aproximando-se de y = 0 sem nunca tocar o eixo x.",
      },
      {
        id: 6,
        title: "ENEM - Depreciação Exponencial de Veículo",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 760,
        statement:
          "Um automóvel de R$ 100.000 desvaloriza 20% ao ano segundo V(t) = 100000 · (0,8)^t. Seu valor após 2 anos será:",
        options: ["R$ 60.000", "R$ 64.000", "R$ 70.000", "R$ 80.000", "R$ 84.000"],
        correctIndex: 1,
        explanation:
          "V(2) = 100000 · (0,8)² = 100000 · 0,64 = R$ 64.000.",
      },
      {
        id: 7,
        title: "ENEM - Comparação Linear vs Exponencial",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 750,
        statement:
          "A opção A rende R$ 1.000 a cada mês. A opção B dobra de valor a cada mês a partir de R$ 10. A longo prazo:",
        options: [
          "A opção A sempre superará B",
          "A opção B superará a opção A, pois crescimento exponencial ultrapassa o linear",
          "Ambas terão o mesmo rendimento após 12 meses",
          "A opção B nunca alcançará a opção A",
          "Depende da taxa de inflação",
        ],
        correctIndex: 1,
        explanation:
          "O crescimento exponencial tem taxa de aceleração multiplicativa, superando inevitavelmente qualquer crescimento linear a longo prazo.",
      },
      {
        id: 8,
        title: "ENEM - Tempo para Dobrar População",
        year: "ENEM 2020",
        difficulty: "Difícil",
        tri: 790,
        statement:
          "Dada a função P(t) = P₀ · 2^(t/5), com t em anos, o tempo necessário para que a população se torne 8 vezes a inicial é:",
        options: ["10 anos", "15 anos", "20 anos", "25 anos", "40 anos"],
        correctIndex: 1,
        explanation:
          "P(t) = 8P₀ => 2^(t/5) = 8 = 2³ => t/5 = 3 => t = 15 anos.",
      },
    ],
  },
  {
    id: 6,
    number: 6,
    shortName: "6. Logarítmica",
    fullName: "Função Logarítmica & Escalas",
    resumoBadge: "Inversa da Exponencial",
    resumoText:
      "A função logarítmica f(x) = log_a(x) (com x > 0, a > 0 e a ≠ 1) é a inversa da exponencial. Propriedades fundamentais: log(u · v) = log u + log v; log(u/v) = log u - log v; log(u^k) = k · log u. O gráfico cruza o eixo x no ponto (1, 0) e possui o eixo y como assíntota vertical. Muito explorada pelo ENEM em fenômenos com variações de ordens de grandeza (pH, decibéis sonoros, escala Richter).",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "A intensidade sonora em decibéis é β = 10 · log(I / 10⁻¹²). Se a intensidade I for multiplicada por 100, o novo nível sonoro aumentará em: Δβ = 10 · log(100) = 10 · 2 = +20 dB.",
    questions: [
      {
        id: 1,
        title: "ENEM - Cálculo do pH Químico",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 700,
        statement:
          "O pH de uma solução aquosa é dado por pH = -log[H⁺]. Se uma solução possui concentração hidrogeniônica [H⁺] = 10⁻⁵ mol/L, seu pH vale:",
        options: ["3", "4", "5", "7", "9"],
        correctIndex: 2,
        explanation:
          "pH = -log(10⁻⁵) = -(-5) · log(10) = 5.",
      },
      {
        id: 2,
        title: "ENEM - Propriedade do Produto do Logaritmo",
        year: "ENEM 2022",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "Sabendo que log 2 ≈ 0,30 e log 3 ≈ 0,48, o valor aproximado de log 6 é:",
        options: ["0,18", "0,60", "0,78", "0,96", "1,44"],
        correctIndex: 2,
        explanation:
          "Como 6 = 2 · 3, temos log 6 = log 2 + log 3 ≈ 0,30 + 0,48 = 0,78.",
      },
      {
        id: 3,
        title: "ENEM - Escala Richter de Terremotos",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 750,
        statement:
          "A magnitude de um terremoto na escala Richter é M = (2/3) · log(E / E₀). Ao comparar dois tremores em que a energia E de um foi 1.000 vezes a do outro, a diferença de magnitude foi de:",
        options: ["1,0 grau", "1,5 graus", "2,0 graus", "2,5 graus", "3,0 graus"],
        correctIndex: 2,
        explanation:
          "ΔM = (2/3) · log(1000) = (2/3) · 3 = 2,0 graus na escala.",
      },
      {
        id: 4,
        title: "ENEM - Logaritmo da Potência",
        year: "ENEM 2020",
        difficulty: "Fácil",
        tri: 680,
        statement:
          "Com log 2 ≈ 0,30, o valor de log 32 é calculado como:",
        options: ["0,60", "0,90", "1,20", "1,50", "1,80"],
        correctIndex: 3,
        explanation:
          "32 = 2⁵. Logo, log 32 = log(2⁵) = 5 · log 2 ≈ 5 · 0,30 = 1,50.",
      },
      {
        id: 5,
        title: "ENEM - Domínio da Função Logarítmica",
        year: "ENEM 2023",
        difficulty: "Média",
        tri: 730,
        statement:
          "O domínio real da função f(x) = log(3x - 12) é o conjunto de todos os números reais x tais que:",
        options: ["x > 0", "x > 4", "x ≥ 4", "x < 4", "x ≠ 4"],
        correctIndex: 1,
        explanation:
          "A condição de existência do logaritmando exige que seja estritamente positivo: 3x - 12 > 0 => 3x > 12 => x > 4.",
      },
      {
        id: 6,
        title: "ENEM - Mudança de Base de Logaritmos",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 760,
        statement:
          "Pela fórmula de mudança de base, log₂ 10 pode ser reescrito na base decimal como:",
        options: [
          "log 10 / log 2",
          "log 2 / log 10",
          "log(10 - 2)",
          "log(10 · 2)",
          "1 / log 2",
        ],
        correctIndex: 0,
        explanation:
          "Pela regra de mudança de base: log_b(a) = log_c(a) / log_c(b). Portanto, log₂ 10 = log 10 / log 2 = 1 / log 2.",
      },
      {
        id: 7,
        title: "ENEM - Nível de Intensidade Sonora",
        year: "ENEM 2021",
        difficulty: "Difícil",
        tri: 780,
        statement:
          "Se uma fonte sonora aumenta seu nível de 60 dB para 80 dB (aumento de 20 dB), a sua intensidade física I foi multiplicada por:",
        options: ["2 vezes", "10 vezes", "20 vezes", "100 vezes", "1.000 vezes"],
        correctIndex: 3,
        explanation:
          "ΔdB = 10 · log(I₂ / I₁) = 20 => log(I₂ / I₁) = 2 => I₂ / I₁ = 10² = 100 vezes.",
      },
      {
        id: 8,
        title: "ENEM - Tempo para Triplicar Investimento",
        year: "ENEM 2020",
        difficulty: "Difícil",
        tri: 795,
        statement:
          "Para resolver 1,05^t = 3, aplica-se logaritmo em ambos os lados, resultando em:",
        options: [
          "t = log 3 / log 1,05",
          "t = log 1,05 / log 3",
          "t = log(3 - 1,05)",
          "t = 3 / log 1,05",
          "t = log 3 - log 1,05",
        ],
        correctIndex: 0,
        explanation:
          "log(1,05^t) = log 3 => t · log 1,05 = log 3 => t = log 3 / log 1,05.",
      },
    ],
  },
  {
    id: 7,
    number: 7,
    shortName: "7. Trigonométricas",
    fullName: "Funções Trigonométricas (Seno & Cosseno)",
    resumoBadge: "Fenômenos Periódicos",
    resumoText:
      "As funções senoidais f(x) = a + b · sen(cx + d) ou f(x) = a + b · cos(cx + d) modelam oscilações periódicas na natureza. Parâmetros-chave: 'a' é o eixo médio vertical da oscilação; '|b|' é a amplitude da onda (valores máximo a + |b| e mínimo a - |b|); 'c' define a frequência angular e o período T = 2π / |c|; 'd' causa deslocamento horizontal de fase.",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "A temperatura em uma estufa ao longo do dia varia como T(t) = 22 + 6 · sen(πt/12), com t em horas a partir da meia-noite. O período é T = 2π / (π/12) = 24 horas. A temperatura máxima ocorre com sen = 1: 22 + 6 = 28°C; e a mínima ocorre com sen = -1: 22 - 6 = 16°C.",
    questions: [
      {
        id: 1,
        title: "ENEM - Período da Função Seno",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 700,
        statement:
          "O período da função periódica f(x) = sen(4x) é dado por:",
        options: ["π/4", "π/2", "π", "2π", "4π"],
        correctIndex: 1,
        explanation:
          "O período da função sen(cx) é T = 2π / c. Para c = 4: T = 2π / 4 = π/2.",
      },
      {
        id: 2,
        title: "ENEM - Altura Máxima da Maré",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 740,
        statement:
          "A altura da maré em um porto é modelada por h(t) = 5 + 3 · cos(πt / 6) metros. A altura máxima atingida pela maré é de:",
        options: ["5 m", "6 m", "8 m", "11 m", "14 m"],
        correctIndex: 2,
        explanation:
          "O valor máximo do cosseno é +1. Logo, h_max = 5 + 3(1) = 8 metros.",
      },
      {
        id: 3,
        title: "ENEM - Imagem da Função Cosseno",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "O conjunto imagem da função f(x) = 2 + 3 · cos(x) no conjunto dos números reais é:",
        options: ["[-1, 1]", "[2, 5]", "[-1, 5]", "[0, 5]", "[-3, 3]"],
        correctIndex: 2,
        explanation:
          "Como -1 ≤ cos(x) ≤ 1: valor mínimo = 2 + 3(-1) = -1; valor máximo = 2 + 3(1) = 5. Imagem = [-1, 5].",
      },
      {
        id: 4,
        title: "ENEM - Roda-Gigante e Movimento Circular",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 755,
        statement:
          "Uma cabine de roda-gigante tem altura dada por H(t) = 15 - 10 · cos(πt / 30) metros. Em quanto tempo a roda-gigante dá uma volta completa?",
        options: ["15 s", "30 s", "60 s", "90 s", "120 s"],
        correctIndex: 2,
        explanation:
          "O período T é dado por 2π / c = 2π / (π / 30) = 60 segundos.",
      },
      {
        id: 5,
        title: "ENEM - Ângulos Notáveis no Ciclo",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 670,
        statement:
          "O valor de sen(150°) no ciclo trigonométrico é equivalente a:",
        options: ["-1/2", "1/2", "√3/2", "-√3/2", "√2/2"],
        correctIndex: 1,
        explanation:
          "150° está no 2º quadrante (seno positivo). sen(150°) = sen(180° - 150°) = sen(30°) = 1/2.",
      },
      {
        id: 6,
        title: "ENEM - Amplitude da Onda Sonora",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 730,
        statement:
          "Na equação da onda acústica y(t) = 4 · sen(100πt), o número 4 representa:",
        options: [
          "O período da oscilação",
          "A amplitude máxima do sinal",
          "A frequência em hertz",
          "A fase inicial da onda",
          "A velocidade do som",
        ],
        correctIndex: 1,
        explanation:
          "O fator que multiplica a função trigonométrica define a amplitude da oscilação.",
      },
      {
        id: 7,
        title: "ENEM - Relação Fundamental da Trigonometria",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 750,
        statement:
          "Se para um ângulo agudo θ sabe-se que sen(θ) = 0,6, o valor de cos(θ) vale:",
        options: ["0,4", "0,5", "0,7", "0,8", "0,9"],
        correctIndex: 3,
        explanation:
          "sen²(θ) + cos²(θ) = 1 => 0,36 + cos²(θ) = 1 => cos²(θ) = 0,64 => cos(θ) = 0,8.",
      },
      {
        id: 8,
        title: "ENEM - Batimentos Cardíacos Periódicos",
        year: "ENEM 2020",
        difficulty: "Difícil",
        tri: 785,
        statement:
          "A pressão sanguínea é descrita por P(t) = 100 + 20 · sen(2,5πt). A pressão sistólica (máxima) e diastólica (mínima) são:",
        options: [
          "120 e 80",
          "140 e 90",
          "120 e 100",
          "100 e 80",
          "130 e 70",
        ],
        correctIndex: 0,
        explanation:
          "P_max = 100 + 20(1) = 120; P_min = 100 + 20(-1) = 80 (pressão 12 por 8).",
      },
    ],
  },
  {
    id: 8,
    number: 8,
    shortName: "8. Gráficos & ENEM",
    fullName: "Análise Gráfica & Problemas do ENEM",
    resumoBadge: "Competência 5 TRI",
    resumoText:
      "A competência 5 da matriz ENEM avalia a capacidade de construir e interpretar modelos gráficos e algébricos a partir de situações reais. Atenção aos pontos de inflexão, raízes no eixo horizontal, ponto de partida no eixo vertical, intervalos de taxa média crescente ou decrescente, e cálculo de áreas ou interseção entre curvas para tomada de decisão ótima.",
    exemploTitle: "Exemplo",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Dois reservatórios A e B iniciam com 500L e 200L. O reservatório A esvazia a 20 L/min: V_A(t) = 500 - 20t. O reservatório B enche a 30 L/min: V_B(t) = 200 + 30t. Terão o mesmo volume quando 500 - 20t = 200 + 30t => 50t = 300 => t = 6 minutos.",
    questions: [
      {
        id: 1,
        title: "ENEM - Interpretação de Gráfico de Nível",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 690,
        statement:
          "Um reservatório cilíndrico enche a vazão constante. O gráfico que melhor expressa a altura da água em função do tempo é:",
        options: [
          "Uma reta crescente com inclinação constante",
          "Uma parábola com concavidade voltada para cima",
          "Uma curva exponencial assintótica",
          "Uma reta horizontal",
          "Uma curva senoidal oscilante",
        ],
        correctIndex: 0,
        explanation:
          "Como a seção transversal do cilindro é constante e a vazão é uniforme, a altura cresce de modo puramente linear (reta com taxa constante).",
      },
      {
        id: 2,
        title: "ENEM - Interseção de Gráficos de Produção",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 730,
        statement:
          "Duas retas de custos C₁(x) = 20x + 800 e C₂(x) = 35x + 200 cruzam-se no gráfico. A coordenada x do ponto de interseção é:",
        options: ["20", "30", "40", "50", "60"],
        correctIndex: 2,
        explanation:
          "20x + 800 = 35x + 200 => 15x = 600 => x = 40.",
      },
      {
        id: 3,
        title: "ENEM - Taxa de Variação Média em Gráfico",
        year: "ENEM 2021",
        difficulty: "Fácil",
        tri: 700,
        statement:
          "Em um gráfico de velocidade por tempo, o veículo passou de 10 m/s para 30 m/s no intervalo de tempo de t = 2 s até t = 6 s. A aceleração média (taxa de variação) foi de:",
        options: ["2,5 m/s²", "5,0 m/s²", "7,5 m/s²", "10 m/s²", "20 m/s²"],
        correctIndex: 1,
        explanation:
          "Aceleração média = Δv / Δt = (30 - 10) / (6 - 2) = 20 / 4 = 5,0 m/s².",
      },
      {
        id: 4,
        title: "ENEM - Análise de Ponto de Máximo Relativo",
        year: "ENEM 2020",
        difficulty: "Média",
        tri: 740,
        statement:
          "Observando um gráfico de temperatura horária de uma cidade que atingiu o pico às 14h marcando 32°C, o ponto que representa esse máximo no plano cartesiano é:",
        options: ["(32, 14)", "(14, 32)", "(14, 0)", "(0, 32)", "(18, 14)"],
        correctIndex: 1,
        explanation:
          "O eixo horizontal (abscissa) indica o tempo (14h) e o eixo vertical (ordenada) a temperatura (32°C), resultando em (14, 32).",
      },
      {
        id: 5,
        title: "ENEM - Leitura de Gráfico com Platô (Constante)",
        year: "ENEM 2023",
        difficulty: "Fácil",
        tri: 680,
        statement:
          "Em um trecho de um gráfico onde uma função f(x) se mantém paralela ao eixo horizontal x, dizemos que a função é:",
        options: ["Estritamente crescente", "Estritamente decrescente", "Constante (taxa de variação nula)", "Inexistente", "Infinita"],
        correctIndex: 2,
        explanation:
          "Reta horizontal possui inclinação nula (a = 0), indicando que a grandeza não sofreu alteração no intervalo.",
      },
      {
        id: 6,
        title: "ENEM - Escolha de Fornecedor por Gráfico",
        year: "ENEM 2022",
        difficulty: "Média",
        tri: 760,
        statement:
          "Em um gráfico de custo total por peso transportado, a transportadora A cobra frete menor até 100 kg, e a B cobra menor acima de 100 kg. Para transportar 140 kg, a decisão econômica ótima é:",
        options: [
          "Contratar a transportadora A",
          "Contratar a transportadora B",
          "Tanto faz, ambas custam o mesmo",
          "Dividir o frete meio a meio",
          "Aguardar nova cotação",
        ],
        correctIndex: 1,
        explanation:
          "Como 140 kg está no intervalo acima de 100 kg, a curva de custo de B está abaixo da de A, sendo a opção mais vantajosa.",
      },
      {
        id: 7,
        title: "ENEM - Relação Inversa em Gráficos",
        year: "ENEM 2021",
        difficulty: "Média",
        tri: 750,
        statement:
          "O gráfico que representa grandezas inversamente proporcionais (como pressão e volume com temperatura constante, P · V = k) é uma:",
        options: ["Reta decrescente", "Parábola", "Hipérbole equilátera", "Circunferência", "Onda senoidal"],
        correctIndex: 2,
        explanation:
          "A curva da função y = k/x é uma hipérbole equilátera no 1º quadrante.",
      },
      {
        id: 8,
        title: "ENEM - Modelagem Completa de Problema TRI",
        year: "ENEM 2020",
        difficulty: "Difícil",
        tri: 800,
        statement:
          "Um reservatório cilíndrico A abastece um reservatório cônico B. O gráfico do nível da água em B com o tempo apresentará formato:",
        options: [
          "Linear perfeito",
          "Curvilíneo com taxa de elevação desacelerando à medida que o cone alarga",
          "Uma reta decrescente",
          "Horizontal",
          "Senoidal",
        ],
        correctIndex: 1,
        explanation:
          "À medida que o cone sobe, sua área transversal aumenta, fazendo com que o mesmo volume de água resulte em menores elevações de altura (curva côncava para baixo).",
      },
    ],
  },
]

// Helper to create basic submodules for other modules
function createDefaultSubmodules(modNumber: number, name: string): SubmoduleItem[] {
  return [
    {
      id: 1,
      number: 1,
      shortName: `1. ${name} Básico`,
      fullName: `${name} - Conceitos e Fundamentos`,
      resumoBadge: "Conceitos Fundamentais",
      resumoText: `Fundamentos essenciais de ${name} para o ENEM. Aborda conceitos básicos, definições formais, propriedades operatórias e técnicas rápidas de resolução de questões com alta coerência pedagógica TRI.`,
      exemploTitle: "Exemplo",
      exemploBadge: "Exemplo Real",
      exemploText: `Aplicação prática dos conceitos fundamentais de ${name} em situações cotidianas cobradas na prova do ENEM.`,
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `ENEM - Questão ${i + 1} de ${name}`,
        year: `ENEM ${2023 - (i % 4)}`,
        difficulty: i < 3 ? "Fácil" : i < 6 ? "Média" : "Difícil",
        tri: 650 + i * 20,
        statement: `Questão modelo do ENEM sobre ${name} abordando competências matemáticas essenciais para a prova.`,
        options: ["Alternativa A", "Alternativa B (Correta)", "Alternativa C", "Alternativa D", "Alternativa E"],
        correctIndex: 1,
        explanation: `Resolução comentada da questão de ${name}: aplicando os conceitos da teoria de forma direta.`,
      })),
    },
    {
      id: 2,
      number: 2,
      shortName: `2. ${name} Intermediário`,
      fullName: `${name} - Aplicações Práticas`,
      resumoBadge: "Aplicações & Fórmulas",
      resumoText: `Aprofundamento em ${name} com foco nas habilidades recorrentes da matriz de referência do ENEM.`,
      exemploTitle: "Exemplo",
      exemploBadge: "Exemplo Real",
      exemploText: `Exemplo detalhado de cálculo e interpretação para o tópico de ${name}.`,
      questions: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `ENEM - Questão ${i + 1} de ${name}`,
        year: `ENEM ${2023 - (i % 4)}`,
        difficulty: i < 3 ? "Fácil" : i < 6 ? "Média" : "Difícil",
        tri: 670 + i * 20,
        statement: `Questão intermediária do ENEM aplicando conceitos práticos de ${name}.`,
        options: ["Alternativa A", "Alternativa B (Correta)", "Alternativa C", "Alternativa D", "Alternativa E"],
        correctIndex: 1,
        explanation: `Passo a passo da resolução comentada para ${name}.`,
      })),
    },
  ]
}

export const MODULES_DATA: Record<string, ModuleInfo> = {
  "modulo-1": {
    number: 1,
    tag: "Módulo 1: Fundamentos",
    name: "Fundamentos",
    title: "Fundamentos da Matemática & Aritmética",
    resumoBadge: "Aritmética & Razão",
    resumoText:
      "A base da matemática para o ENEM engloba operações fundamentais, frações, porcentagem, razão e proporção, regra de três simples e composta, além de potenciação. Dominar esses conceitos garante alta pontuação TRI em questões fáceis e médias.",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Um produto que custava R$ 120,00 teve um aumento de 15%. O novo valor será calculado aplicando o fator multiplicador: 120 × 1,15 = R$ 138,00.",
    formulas: [
      {
        title: "Regra de Três Simples",
        formula: "a / b = c / d",
        details: [
          { label: "Grandezas Diretas:", value: "aumentam na mesma proporção" },
          { label: "Grandezas Inversas:", value: "uma dobra, a outra divide por 2" },
        ],
      },
      {
        title: "Fatores de Aumento & Desconto",
        formula: "V_final = V_inicial × (1 ± i)",
        details: [
          { label: "+ i:", value: "fator de acréscimo (ex: +20% -> × 1,20)" },
          { label: "- i:", value: "fator de desconto (ex: -15% -> × 0,85)" },
        ],
      },
    ],
    submodules: createDefaultSubmodules(1, "Fundamentos"),
  },
  "modulo-2": {
    number: 2,
    tag: "Módulo 2: Funções",
    name: "Funções",
    title: "Funções Polinomiais de 1º e 2º Grau",
    resumoBadge: "Teoria & Fórmulas",
    resumoText:
      "Uma função do 1º grau (afim) é da forma f(x) = ax + b com a ≠ 0. O coeficiente 'a' determina a taxa de variação (inclinação da reta) e 'b' é o ponto onde a reta corta o eixo y (termo independente).",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Se um plano de internet cobra R$ 30 fixos mais R$ 2 por giga adicional, a função é f(x) = 2x + 30. Para 15 gigas adicionais: f(15) = 2(15) + 30 = R$ 60.",
    formulas: [
      {
        title: "Forma Geral",
        formula: "f(x) = ax + b",
        details: [
          { label: "a:", value: "taxa de variação (coef. angular)" },
          { label: "b:", value: "valor inicial (coef. linear)" },
        ],
      },
      {
        title: "Zero da Função",
        formula: "x = -b / a",
        details: [
          { label: "Ponto onde:", value: "f(x) = 0" },
          { label: "Corte no eixo x:", value: "(-b/a, 0)" },
        ],
      },
    ],
    submodules: FUNCOES_SUBMODULES,
  },
  "modulo-3": {
    number: 3,
    tag: "Módulo 3: Estatística",
    name: "Estatística",
    title: "Estatística & Análise de Dados",
    resumoBadge: "Medidas Centrais & Dispersão",
    resumoText:
      "A Estatística no ENEM avalia a capacidade de interpretação de tabelas e gráficos, além do cálculo de medidas de tendência central (Média, Mediana e Moda) e dispersão (Variância e Desvio Padrão para medir regularidade).",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Em um conjunto de notas 6, 7, 7, 8, 10: a média é (6+7+7+8+10)/5 = 7,6; a moda é 7 (nota mais frequente); e a mediana é 7 (valor central ordenado).",
    formulas: [
      {
        title: "Média Ponderada",
        formula: "x̄ = Σ(x_i · p_i) / Σp_i",
        details: [
          { label: "x_i:", value: "valores observados" },
          { label: "p_i:", value: "pesos de cada observação" },
        ],
      },
      {
        title: "Mediana & Desvio Padrão",
        formula: "σ = √(Σ(x_i - x̄)² / n)",
        details: [
          { label: "Mediana:", value: "termo central após ordenar o rol" },
          { label: "Menor desvio σ:", value: "indica maior regularidade/consistência" },
        ],
      },
    ],
    submodules: createDefaultSubmodules(3, "Estatística"),
  },
  "modulo-4": {
    number: 4,
    tag: "Módulo 4: Geometria",
    name: "Geometria",
    title: "Geometria Plana & Espacial",
    resumoBadge: "Áreas, Perímetros & Volumes",
    resumoText:
      "Geometria é um dos conteúdos mais recorrentes no ENEM. Abrange cálculo de áreas de triângulos, quadriláteros e círculos, teorema de Pitágoras, semelhança de triângulos e volumes de prismas, cilindros, cones e esferas.",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Uma lata cilíndrica com raio da base r = 4 cm e altura h = 10 cm possui volume V = π · r² · h = π · 16 · 10 = 160π cm³ ≈ 502,6 cm³.",
    formulas: [
      {
        title: "Área do Círculo & Triângulo",
        formula: "A = π · r²  |  A = (b · h) / 2",
        details: [
          { label: "Comprimento círculo:", value: "C = 2 · π · r" },
          { label: "Pitágoras:", value: "a² = b² + c² (hipotenusa ao quadrado)" },
        ],
      },
      {
        title: "Volume de Prismas & Cilindros",
        formula: "V = A_base · h",
        details: [
          { label: "Cilindro:", value: "V = π · r² · h" },
          { label: "Pirâmide / Cone:", value: "V = (A_base · h) / 3" },
        ],
      },
    ],
    submodules: createDefaultSubmodules(4, "Geometria"),
  },
  "modulo-5": {
    number: 5,
    tag: "Módulo 5: Trigonometria & Álgebra",
    name: "Trigonometria & Álgebra",
    title: "Trigonometria no Triângulo & Ciclo",
    resumoBadge: "Razões Trigonométricas & Ondas",
    resumoText:
      "A Trigonometria estuda as relações métricas no triângulo retângulo (seno, cosseno, tangente), lei dos senos e cossenos para triângulos quaisquer, e o comportamento periódico das funções seno e cosseno no ciclo trigonométrico.",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Um observador a 20 m de um prédio o avista sob um ângulo de 30°. A altura h do prédio é dada por tg(30°) = h / 20 => h = 20 · (√3/3) ≈ 11,55 m.",
    formulas: [
      {
        title: "Relação Fundamental",
        formula: "sen²(θ) + cos²(θ) = 1",
        details: [
          { label: "tg(θ):", value: "sen(θ) / cos(θ)" },
          { label: "Triângulo ret.:", value: "sen = cat. op / hip | cos = cat. adj / hip" },
        ],
      },
      {
        title: "Lei dos Cossenos & Senos",
        formula: "a² = b² + c² - 2bc·cos(Â)",
        details: [
          { label: "Lei dos Senos:", value: "a/sen(Â) = b/sen(B̂) = 2R" },
          { label: "Ângulos notáveis:", value: "sen(30°)=1/2, sen(45°)=√2/2, sen(60°)=√3/2" },
        ],
      },
    ],
    submodules: createDefaultSubmodules(5, "Trigonometria"),
  },
  "modulo-6": {
    number: 6,
    tag: "Módulo 6: Probabilidade & Combinatória",
    name: "Probabilidade & Combinatória",
    title: "Probabilidade & Análise Combinatória",
    resumoBadge: "Contagem, Permutação & Chances",
    resumoText:
      "A Análise Combinatória e a Probabilidade avaliam os princípios fundamentais de contagem (multiplicativo e aditivo), agrupamentos (combinações e permutações) e cálculo de probabilidades simples, condicionais e de eventos independentes.",
    exemploTitle: "Exemplo Prático",
    exemploBadge: "Exemplo Real",
    exemploText:
      "Em uma urna com 3 bolas azuis e 2 vermelhas, a probabilidade de sortear aleatoriamente uma bola azul é P = 3 / (3 + 2) = 3/5 = 60%.",
    formulas: [
      {
        title: "Combinação Simples",
        formula: "C(n, p) = n! / (p!(n - p)!)",
        details: [
          { label: "Critério:", value: "A ordem dos elementos NÃO altera o grupo" },
          { label: "Permutação simples:", value: "P_n = n!" },
        ],
      },
      {
        title: "Probabilidade Clássica",
        formula: "P(E) = n(E) / n(Ω)",
        details: [
          { label: "n(E):", value: "número de casos favoráveis" },
          { label: "n(Ω):", value: "espaço amostral total de casos possíveis" },
        ],
      },
    ],
    submodules: createDefaultSubmodules(6, "Probabilidade"),
  },
}

