# MoveVocê — Questionário Definitivo v2
> Inspirado no NutriInteligente (foco brasileiro, dieta detalhada, linguagem direta)  
> + BetterMe (UX emocional, treino + saúde, desafios, comunidade)  
> Stack: React + TypeScript + Tailwind CSS + Framer Motion  
> Objetivo: máxima conversão + dados suficientes para gerar treino e dieta via IA

---

## 1. Filosofia do Questionário

### O diferencial MoveVocê vs concorrentes

| Aspecto | NutriInteligente | BetterMe | **MoveVocê** |
|---|---|---|---|
| Treino personalizado | ❌ | ✅ | ✅ |
| Dieta personalizada | ✅ | Parcial | ✅ |
| Alimentos brasileiros | ✅ | ❌ | ✅ |
| Porções em medidas caseiras | ✅ | ❌ | ✅ |
| UX emocional de conversão | Básica | Alta | **Máxima** |
| Idioma | PT-BR | Inglês | **PT-BR** |
| Plano completo (treino+dieta) | ❌ | ❌ | ✅ |
| Desafios mensais | ❌ | ✅ | ✅ |

### Princípios de UX aplicados (em ordem de impacto)

1. **Future Pacing** — usuário se imagina no resultado antes de pagar
2. **Commitment & Consistency** — cada resposta aprofunda o compromisso
3. **Sunk Cost** — 4 minutos investidos = dói sair sem o plano
4. **Social Proof** — números reais durante o fluxo, não só no final
5. **Curiosity Gap** — revelar parcialmente o plano antes do paywall
6. **Value Anchoring** — comparar com nutricionista (R$200–500/mês) antes do preço
7. **Efeito IKEA** — quanto mais configura, mais sente que é "dele"
8. **Micro-afirmações** — feedback positivo personalizado após cada resposta

---

## 2. Estrutura Geral

```
Total de perguntas: 22
Total de fases: 6
Duração estimada: ~4 minutos
Telas de transição: 5 (uma entre cada fase)
Tela de loading: 1 (entre fase 5 e CTA)
Tela de CTA: 1
```

### Mapa de fases

| Fase | Nome | Perguntas | Técnica principal | Progresso ao fim |
|---|---|---|---|---|
| 1 | Identidade | 1–3 | Future Pacing + Emotional Hook | 15% |
| 2 | Corpo | 4–8 | Progressive Disclosure + Cálculo ao vivo | 35% |
| 3 | Treino | 9–13 | Efeito IKEA + Customização | 55% |
| 4 | Alimentação | 14–19 | Value Anchoring + Identidade alimentar | 80% |
| 5 | Saúde & Estilo | 20–22 | Holismo + Diferencial vs concorrentes | 95% |
| CTA | Preview + Venda | — | Sunk Cost + Curiosity Gap | 100% |

---

## 3. Tipos de Componentes (TypeScript)

```ts
type QuestionType =
  | 'single_select'      // Cards clicáveis com ícone (avança automático ao selecionar)
  | 'multi_select'       // Checkboxes estilizados com botão "Próximo"
  | 'slider'             // Slider com label dinâmico e valor em destaque
  | 'number_input'       // Campo numérico com unidade e helper text
  | 'button_group'       // Botões compactos lado a lado
  | 'scale_rating'       // Escala de 1 a 5 com emoji e label

interface QuestionOption {
  value: string
  label: string
  icon?: string               // Emoji
  description?: string        // Subtexto opcional
  affirmation?: string        // Micro-afirmação exibida ao selecionar essa opção
}

interface Question {
  id: string
  phase: 1 | 2 | 3 | 4 | 5
  order: number
  type: QuestionType
  question: string
  subtext?: string
  options?: QuestionOption[]
  sliderConfig?: SliderConfig
  numberConfig?: NumberInputConfig
  required: boolean
  autoAdvance?: boolean       // true em single_select: avança sem clicar "Próximo"
  aiRelevance: string         // Nota interna — como impacta a geração da IA
  ctaEcho?: string            // Como essa resposta aparece na tela de CTA
}

interface PhaseTransition {
  headline: string            // Título grande e emocional
  subtext: string             // Texto de apoio
  highlight?: string          // Dado calculado em destaque (ex: "Seu IMC: 24.1")
  highlightLabel?: string     // Label do dado em destaque
  progressPercent: number
  socialProofSnippet?: string // Ex: "83% das pessoas com seu objetivo conseguiram resultados em 30 dias"
  duration: number            // ms antes de avançar automaticamente (0 = manual)
}

interface QuestionnaireAnswers {
  // Fase 1 — Identidade
  firstName: string
  mainGoal: string
  biggestMotivation: string

  // Fase 2 — Corpo
  biologicalSex: 'male' | 'female'
  age: number
  weight: number
  height: number
  bodyFeelingNow: string

  // Fase 3 — Treino
  fitnessLevel: string
  trainingLocation: string
  trainingDaysPerWeek: number
  sessionDuration: string
  injuries: string[]

  // Fase 4 — Alimentação
  dietaryRestrictions: string[]
  mealsPerDay: number
  cookingHabit: string
  hungerPattern: string
  waterIntake: string
  foodRelationship: string

  // Fase 5 — Saúde & Estilo
  sleepQuality: string
  stressLevel: string
  workStyle: string

  // Calculados
  imc?: number
  imcLabel?: string
  tmb?: number
  tdee?: number
}
```

---

## 4. Fase 1 — Identidade (Perguntas 1–3)

> **Objetivo UX:** criar vínculo pessoal e emocional imediatamente.  
> O usuário se sente visto como indivíduo, não como mais um cadastro.

---

### Pergunta 1 — Nome

```ts
{
  id: 'firstName',
  phase: 1,
  order: 1,
  type: 'number_input',        // reusar como text_input
  question: 'Antes de começar, qual é o seu nome?',
  subtext: 'Vamos personalizar tudo com o seu nome 😊',
  required: true,
  autoAdvance: false,
  numberConfig: {
    unit: '',
    min: 0,
    max: 0,
    placeholder: 'Digite seu nome...',
  },
  aiRelevance: 'Usado para personalizar o texto do plano e da tela de CTA',
  ctaEcho: 'Plano criado para {firstName}',
}
```

> **UX note:** Campo de texto simples, centralizado, com animação de digitação no placeholder.  
> Após digitar e avançar, todas as telas seguintes usam o nome: *"Ótimo, {nome}! Agora vamos ao seu corpo."*

---

### Pergunta 2 — Objetivo Principal

```ts
{
  id: 'mainGoal',
  phase: 1,
  order: 2,
  type: 'single_select',
  question: 'O que você mais quer alcançar?',
  subtext: 'Escolha o que mais te representa agora',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define o foco central do plano: protocolo calórico, tipo de treino e divisão semanal',
  ctaEcho: 'Plano focado em: {mainGoal_label}',
  options: [
    {
      value: 'lose_weight',
      label: 'Emagrecer',
      icon: '🔥',
      description: 'Reduzir gordura corporal',
      affirmation: 'Ótima escolha, {nome}! Já temos o protocolo certo para você.',
    },
    {
      value: 'gain_muscle',
      label: 'Ganhar massa',
      icon: '💪',
      description: 'Aumentar músculo e força',
      affirmation: 'Perfeito! Seu plano vai priorizar hipertrofia.',
    },
    {
      value: 'body_definition',
      label: 'Definir o corpo',
      icon: '✨',
      description: 'Reduzir gordura mantendo músculo',
      affirmation: 'Definição é treino + dieta na medida certa. Vamos lá!',
    },
    {
      value: 'more_health',
      label: 'Melhorar minha saúde',
      icon: '❤️',
      description: 'Mais disposição, mais qualidade de vida',
      affirmation: 'Saúde em dia muda tudo. Seu plano será equilibrado e sustentável.',
    },
    {
      value: 'more_energy',
      label: 'Ter mais disposição',
      icon: '⚡',
      description: 'Acabar com o cansaço do dia a dia',
      affirmation: 'Treino e alimentação certos são a melhor fonte de energia.',
    },
    {
      value: 'reduce_stress',
      label: 'Reduzir o estresse',
      icon: '🧘',
      description: 'Equilíbrio físico e mental',
      affirmation: 'Movimento e nutrição são os melhores ansiolíticos naturais.',
    },
  ],
}
```

---

### Pergunta 3 — Maior Motivação

```ts
{
  id: 'biggestMotivation',
  phase: 1,
  order: 3,
  type: 'single_select',
  question: 'O que mais te motiva a mudar agora?',
  subtext: 'Sua resposta vai moldar o tom do seu plano',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Contextualiza a linguagem motivacional usada no plano gerado',
  ctaEcho: 'Motivação identificada e incluída no plano',
  options: [
    { value: 'health',      label: 'Minha saúde preocupa',       icon: '🏥', affirmation: 'Cuidar da saúde é o melhor investimento. Vamos juntos.' },
    { value: 'appearance',  label: 'Quero me olhar no espelho e gostar', icon: '🪞', affirmation: 'Autoestima é poderosa. Seu plano vai te ajudar a chegar lá.' },
    { value: 'energy',      label: 'Estou sempre cansado(a)',     icon: '😴', affirmation: 'Dieta e treino certos mudam o nível de energia em semanas.' },
    { value: 'event',       label: 'Tenho um evento se aproximando', icon: '📅', affirmation: 'Prazo definido = foco total. Vamos otimizar seu plano para isso.' },
    { value: 'family',      label: 'Quero estar bem para minha família', icon: '👨‍👩‍👧', affirmation: 'O melhor presente para quem você ama é você saudável.' },
    { value: 'tired_of_trying', label: 'Já tentei de tudo e nada funcionou', icon: '😤', affirmation: 'Planos genéricos não funcionam. O seu será diferente, feito para você.' },
  ],
}
```

### Transição após Fase 1

```ts
{
  headline: 'Entendemos, {nome}.',
  subtext: 'Agora vamos conhecer o seu corpo para montar um plano que realmente funciona.',
  socialProofSnippet: '89% das pessoas que completam esse questionário veem resultados nas primeiras 3 semanas.',
  progressPercent: 15,
  duration: 0,  // manual — botão "Continuar"
}
```

---

## 5. Fase 2 — Corpo (Perguntas 4–8)

> **Objetivo UX:** coletar dados biométricos com leveza, exibir IMC calculado ao vivo para criar um "momento wow".

---

### Pergunta 4 — Sexo Biológico

```ts
{
  id: 'biologicalSex',
  phase: 2,
  order: 1,
  type: 'single_select',
  question: 'Qual é o seu sexo biológico, {nome}?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define fórmula de TMB, macros proteicos e protocolos de treino específicos',
  options: [
    { value: 'male',   label: 'Masculino', icon: '♂️', affirmation: 'Anotado.' },
    { value: 'female', label: 'Feminino',  icon: '♀️', affirmation: 'Anotado.' },
  ],
}
```

---

### Pergunta 5 — Idade

```ts
{
  id: 'age',
  phase: 2,
  order: 2,
  type: 'slider',
  question: 'Quantos anos você tem?',
  required: true,
  autoAdvance: false,
  aiRelevance: 'Impacta cálculo de TMB, volume de treino recomendado e intensidade por faixa etária',
  sliderConfig: { min: 16, max: 70, step: 1, unit: 'anos', defaultValue: 28 },
}
```

---

### Pergunta 6 — Peso

```ts
{
  id: 'weight',
  phase: 2,
  order: 3,
  type: 'number_input',
  question: 'Qual é o seu peso atual?',
  subtext: 'Seja honesto(a) — quanto mais preciso, melhor seu plano 😉',
  required: true,
  aiRelevance: 'Base do cálculo de IMC, TMB, TDEE e necessidade proteica diária (2g/kg para hipertrofia)',
  numberConfig: {
    unit: 'kg',
    min: 40,
    max: 250,
    placeholder: '70',
    helperText: 'Essa informação fica só entre a gente.',
  },
}
```

---

### Pergunta 7 — Altura

```ts
{
  id: 'height',
  phase: 2,
  order: 4,
  type: 'number_input',
  question: 'Qual é a sua altura?',
  required: true,
  aiRelevance: 'Completa cálculo de IMC e proporções corporais',
  numberConfig: {
    unit: 'cm',
    min: 140,
    max: 220,
    placeholder: '170',
  },
}
```

> **UX note:** após preencher altura, calcular e exibir o IMC em tempo real com cor e label:  
> `< 18.5` → azul → "Abaixo do peso"  
> `18.5–24.9` → verde → "Peso saudável"  
> `25–29.9` → amarelo → "Acima do peso ideal"  
> `≥ 30` → laranja → "Obesidade"  
> Exibir: *"Seu IMC é X.X — [label]. Vamos ajustar seu plano para esse perfil."*

---

### Pergunta 8 — Como Você Se Sente Com Seu Corpo Hoje

```ts
{
  id: 'bodyFeelingNow',
  phase: 2,
  order: 5,
  type: 'scale_rating',
  question: 'Como você se sente com seu corpo hoje?',
  subtext: 'Escala de 1 (muito insatisfeito) a 5 (muito satisfeito)',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define o tom emocional do plano — pessoas insatisfeitas precisam de mais reforço motivacional no conteúdo',
  ctaEcho: 'Seu plano vai te ajudar a chegar onde quer estar',
  options: [
    { value: '1', label: '😞', description: 'Muito insatisfeito(a)',  affirmation: 'Vamos mudar isso juntos. Você vai se surpreender.' },
    { value: '2', label: '😕', description: 'Insatisfeito(a)',        affirmation: 'Tudo certo. Esse plano é exatamente o que você precisa.' },
    { value: '3', label: '😐', description: 'Mais ou menos',          affirmation: 'Já está no caminho certo. Vamos acelerar isso.' },
    { value: '4', label: '🙂', description: 'Satisfeito(a)',          affirmation: 'Ótimo! Vamos otimizar ainda mais.' },
    { value: '5', label: '😄', description: 'Muito satisfeito(a)',    affirmation: 'Incrível! Vamos manter e evoluir.' },
  ],
}
```

### Transição após Fase 2

```ts
{
  headline: 'Perfil físico completo, {nome}!',
  subtext: 'Calculamos seu metabolismo basal e já sabemos quantas calorias seu corpo precisa. Agora vamos montar seu treino.',
  highlight: 'TMB: {tmb} kcal/dia',
  highlightLabel: 'Seu metabolismo basal calculado',
  progressPercent: 35,
  duration: 0,
}
```

---

## 6. Fase 3 — Treino (Perguntas 9–13)

> **Objetivo UX:** Efeito IKEA — o usuário configura o próprio treino e sente que é "dele".  
> Cada resposta vai aparecer nomeada no preview do plano.

---

### Pergunta 9 — Nível de Condicionamento

```ts
{
  id: 'fitnessLevel',
  phase: 3,
  order: 1,
  type: 'single_select',
  question: 'Como está seu condicionamento físico hoje?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define volume de séries, intensidade, complexidade dos exercícios e progressão de carga',
  options: [
    { value: 'sedentary',     label: 'Sedentário(a)',      icon: '🛋️', description: 'Praticamente não me exercito',       affirmation: 'Sem problema! Seu plano começa do zero, no ritmo certo.' },
    { value: 'beginner',      label: 'Iniciante',           icon: '🚶', description: 'Me exercito esporadicamente',        affirmation: 'Ótimo ponto de partida. Vamos construir sua base.' },
    { value: 'intermediate',  label: 'Intermediário(a)',    icon: '🏃', description: 'Treino com certa regularidade',     affirmation: 'Bom nível! Seu plano vai te levar para o próximo estágio.' },
    { value: 'advanced',      label: 'Avançado(a)',         icon: '🏋️', description: 'Treino com frequência e intensidade', affirmation: 'Excelente! Seu plano vai ser desafiador do jeito certo.' },
  ],
}
```

---

### Pergunta 10 — Local de Treino

```ts
{
  id: 'trainingLocation',
  phase: 3,
  order: 2,
  type: 'single_select',
  question: 'Onde você vai treinar?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define todos os exercícios do plano: com ou sem equipamentos, variações e substituições',
  ctaEcho: 'Treino montado para: {trainingLocation_label}',
  options: [
    { value: 'gym',     label: 'Academia',        icon: '🏋️', description: 'Acesso a todos os equipamentos',    affirmation: 'Academia completa = plano completo. Vamos usar tudo.' },
    { value: 'home',    label: 'Em casa',          icon: '🏠', description: 'Treino com o que tenho',            affirmation: 'Casa pode ser academia. Seu plano vai provar isso.' },
    { value: 'outdoor', label: 'Ao ar livre',      icon: '🌳', description: 'Parque, rua ou área aberta',        affirmation: 'Treino funcional ao ar livre é poderoso. Ótima escolha.' },
    { value: 'hybrid',  label: 'Academia + casa',  icon: '🔄', description: 'Combino os dois dependendo do dia', affirmation: 'Híbrido é o mais completo. Seu plano vai incluir ambos.' },
  ],
}
```

---

### Pergunta 11 — Dias de Treino por Semana

```ts
{
  id: 'trainingDaysPerWeek',
  phase: 3,
  order: 3,
  type: 'button_group',
  question: 'Quantos dias por semana você consegue treinar?',
  subtext: 'Seja realista — consistência bate intensidade',
  required: true,
  autoAdvance: false,
  aiRelevance: '2–3 dias = fullbody; 4 dias = upper/lower; 5–6 dias = ABC ou ABCDE push/pull/legs',
  ctaEcho: '{trainingDaysPerWeek} treinos por semana',
  options: [
    { value: '2', label: '2x',  affirmation: 'Fullbody 2x já dá resultado. Vamos aproveitar cada treino.' },
    { value: '3', label: '3x',  affirmation: '3x por semana é o padrão ouro para iniciantes e intermediários.' },
    { value: '4', label: '4x',  affirmation: '4x é ótimo para dividir bem os grupos musculares.' },
    { value: '5', label: '5x',  affirmation: '5x é para quem quer acelerar. Vamos estruturar bem o descanso.' },
    { value: '6', label: '6x',  affirmation: '6x exige planejamento inteligente de recuperação. Feito.' },
  ],
}
```

---

### Pergunta 12 — Duração da Sessão

```ts
{
  id: 'sessionDuration',
  phase: 3,
  order: 4,
  type: 'single_select',
  question: 'Quanto tempo você tem por sessão?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Determina número de exercícios, séries totais e tempo de descanso entre séries',
  options: [
    { value: 'up_to_30',  label: 'Até 30 min',     icon: '⚡', description: 'Sessões curtas e intensas',     affirmation: '30 minutos focados fazem mais do que 1 hora sem foco.' },
    { value: '30_to_45',  label: '30 a 45 min',     icon: '🎯', description: 'Tempo ideal para a maioria',   affirmation: 'Perfeito. Esse tempo é o sweet spot de eficiência.' },
    { value: '45_to_60',  label: '45 a 60 min',     icon: '💪', description: 'Sessão completa e estruturada', affirmation: 'Excelente. Dá para trabalhar tudo com qualidade.' },
    { value: 'over_60',   label: 'Mais de 1 hora',  icon: '🏆', description: 'Treino longo e dedicado',       affirmation: 'Volume alto = resultados expressivos. Vamos estruturar bem.' },
  ],
}
```

---

### Pergunta 13 — Lesões ou Restrições

```ts
{
  id: 'injuries',
  phase: 3,
  order: 5,
  type: 'multi_select',
  question: 'Você tem alguma lesão ou limitação física?',
  subtext: 'Isso é importante para evitar exercícios contraindicados 🩺',
  required: true,
  autoAdvance: false,
  aiRelevance: 'Filtra exercícios contraindicados e gera alternativas seguras para cada limitação',
  options: [
    { value: 'none',      label: 'Nenhuma limitação',   icon: '✅' },
    { value: 'spine',     label: 'Coluna / lombar',      icon: '🦴' },
    { value: 'knee',      label: 'Joelho',               icon: '🦵' },
    { value: 'shoulder',  label: 'Ombro',                icon: '💪' },
    { value: 'hip',       label: 'Quadril',              icon: '🦿' },
    { value: 'wrist',     label: 'Punho / mão',          icon: '🖐️' },
    { value: 'other',     label: 'Outra limitação',      icon: '⚠️' },
  ],
}
```

### Transição após Fase 3

```ts
{
  headline: 'Treino estruturado, {nome}!',
  subtext: 'Já temos a divisão do seu treino semanal. Agora falta a parte que a maioria ignora: a alimentação.',
  socialProofSnippet: 'Treino sem dieta entrega 40% do resultado. Treino com dieta entrega 100%.',
  progressPercent: 55,
  duration: 0,
}
```

---

## 7. Fase 4 — Alimentação (Perguntas 14–19)

> **Objetivo UX:** Value Anchoring — cada pergunta de alimentação reforça que  
> o plano vai resolver exatamente o problema alimentar do usuário.  
> Diferencial chave vs NutriInteligente: incluir **medidas caseiras brasileiras**.

---

### Pergunta 14 — Restrições Alimentares

```ts
{
  id: 'dietaryRestrictions',
  phase: 4,
  order: 1,
  type: 'multi_select',
  question: 'Você tem alguma restrição ou preferência alimentar?',
  subtext: 'Seu plano vai respeitar cada uma delas 💚',
  required: true,
  autoAdvance: false,
  aiRelevance: 'Filtra alimentos e refeições geradas — remove categorias inteiras conforme restrição',
  ctaEcho: 'Dieta adaptada às suas restrições',
  options: [
    { value: 'none',              label: 'Nenhuma',             icon: '✅', description: 'Como de tudo normalmente' },
    { value: 'vegetarian',        label: 'Vegetariano(a)',       icon: '🥦', description: 'Sem carnes' },
    { value: 'vegan',             label: 'Vegano(a)',            icon: '🌱', description: 'Sem produtos animais' },
    { value: 'gluten_free',       label: 'Sem glúten',          icon: '🌾', description: 'Intolerância ao glúten/doença celíaca' },
    { value: 'lactose_free',      label: 'Sem lactose',         icon: '🥛', description: 'Intolerância à lactose' },
    { value: 'low_carb',          label: 'Low carb',            icon: '🥩', description: 'Prefiro reduzir carboidratos' },
    { value: 'no_pork',           label: 'Sem carne de porco',  icon: '🐷', description: 'Religião ou preferência' },
    { value: 'food_allergy',      label: 'Alergia alimentar',   icon: '⚠️', description: 'Amendoim, frutos do mar etc.' },
  ],
}
```

---

### Pergunta 15 — Número de Refeições

```ts
{
  id: 'mealsPerDay',
  phase: 4,
  order: 2,
  type: 'button_group',
  question: 'Quantas refeições você consegue fazer por dia?',
  subtext: 'Incluindo lanches — seja realista com sua rotina',
  required: true,
  autoAdvance: false,
  aiRelevance: 'Define a distribuição de macros e calorias ao longo do dia',
  options: [
    { value: '2', label: '2 refeições', affirmation: 'Jejum intermitente? Seu plano vai se adaptar a isso.' },
    { value: '3', label: '3 refeições', affirmation: 'Café, almoço e jantar. Clássico e eficiente.' },
    { value: '4', label: '4 refeições', affirmation: '4 refeições é ótimo para manter o metabolismo ativo.' },
    { value: '5', label: '5+ refeições', affirmation: 'Frequência alta = metabolismo acelerado. Ótimo!' },
  ],
}
```

---

### Pergunta 16 — Hábito de Cozinhar

```ts
{
  id: 'cookingHabit',
  phase: 4,
  order: 3,
  type: 'single_select',
  question: 'Você costuma cozinhar em casa?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define complexidade das receitas: quem não cozinha recebe prep simples, marmita e opções rápidas',
  ctaEcho: 'Receitas adaptadas à sua rotina',
  options: [
    { value: 'cooks_a_lot',   label: 'Sim, cozinho bastante', icon: '👨‍🍳', description: 'Tenho tempo e gosto de cozinhar',   affirmation: 'Incrível! Seu plano vai ter receitas mais completas e saborosas.' },
    { value: 'cooks_simple',  label: 'Só coisas simples',     icon: '🍳', description: 'Prefiro receitas rápidas e fáceis',  affirmation: 'Sem problema. Seu plano vai ter no máximo 15 minutos de preparo.' },
    { value: 'rarely_cooks',  label: 'Quase não cozinho',     icon: '🥡', description: 'Preciso de opções prontas ou rápidas', affirmation: 'Entendido. Seu plano vai priorizar marmitas e opções de mercado.' },
  ],
}
```

---

### Pergunta 17 — Padrão de Fome

```ts
{
  id: 'hungerPattern',
  phase: 4,
  order: 4,
  type: 'single_select',
  question: 'Como é sua fome durante o dia?',
  subtext: 'Essa informação ajuda a distribuir suas calorias no horário certo',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define a distribuição calórica — quem tem fome à noite recebe refeição noturna maior',
  options: [
    { value: 'morning_hunger',   label: 'Acordo com fome',           icon: '☀️', description: 'Café da manhã é minha refeição mais importante' },
    { value: 'afternoon_hunger', label: 'Fome forte à tarde',        icon: '⏰', description: 'Fico com mais fome entre almoço e jantar' },
    { value: 'night_hunger',     label: 'Fome maior à noite',        icon: '🌙', description: 'À noite é quando mais quero comer' },
    { value: 'irregular',        label: 'Fome irregular',            icon: '🎲', description: 'Não tenho horário certo, varia muito' },
    { value: 'never_hungry',     label: 'Raramente sinto fome',      icon: '😶', description: 'Preciso me lembrar de comer' },
  ],
}
```

---

### Pergunta 18 — Consumo de Água

```ts
{
  id: 'waterIntake',
  phase: 4,
  order: 5,
  type: 'single_select',
  question: 'Quanto de água você costuma beber por dia?',
  subtext: 'Hidratação afeta diretamente seu desempenho e metabolismo',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Gera recomendação personalizada de hidratação diária no plano (meta em ml baseada no peso)',
  options: [
    { value: 'very_little',  label: 'Muito pouco',      icon: '😬', description: 'Quase não bebo água',        affirmation: 'Seu plano vai incluir uma meta de hidratação fácil de seguir.' },
    { value: 'little',       label: 'Menos de 1 litro', icon: '🥤', description: 'Bebo mas sei que é pouco',   affirmation: 'Vamos aumentar isso gradualmente. Faz diferença enorme.' },
    { value: 'moderate',     label: '1 a 2 litros',     icon: '💧', description: 'Bebo razoavelmente bem',     affirmation: 'Bom! Seu plano vai sugerir a meta ideal para seu peso.' },
    { value: 'good',         label: 'Mais de 2 litros', icon: '🌊', description: 'Me preocupo com hidratação', affirmation: 'Excelente hábito! Isso vai potencializar seus resultados.' },
  ],
}
```

---

### Pergunta 19 — Relação com a Alimentação

```ts
{
  id: 'foodRelationship',
  phase: 4,
  order: 6,
  type: 'single_select',
  question: 'Como você descreveria sua relação com a alimentação hoje?',
  subtext: 'Seja honesto(a) — isso nos ajuda a montar um plano realista que você vai conseguir seguir',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define o grau de rigidez da dieta gerada e o tom dos textos motivacionais do plano',
  ctaEcho: 'Plano alimentar realista para o seu perfil',
  options: [
    { value: 'eats_well_unorganized', label: 'Como bem, mas sem organização',        icon: '📋', affirmation: 'Organizar já é 80% do trabalho. Vamos facilitar isso.' },
    { value: 'eats_poorly',           label: 'Sei que me alimento mal',              icon: '😬', affirmation: 'Honestidade é o primeiro passo. Seu plano vai mudar isso com calma.' },
    { value: 'tried_diets_failed',    label: 'Já tentei dietas e não consegui seguir', icon: '😤', affirmation: 'Dietas rígidas falham. O seu vai ser flexível e real.' },
    { value: 'emotional_eating',      label: 'Como por ansiedade ou estresse',       icon: '😰', affirmation: 'Comer emocional é muito comum. Seu plano vai incluir estratégias para isso.' },
    { value: 'eats_well_optimize',    label: 'Me alimento bem, quero otimizar',      icon: '🎯', affirmation: 'Ótimo ponto de partida! Vamos afinar os detalhes.' },
  ],
}
```

### Transição após Fase 4

```ts
{
  headline: 'Dieta desenhada, {nome}!',
  subtext: 'Calculamos sua necessidade calórica diária e os macros ideais para o seu objetivo. Só mais 3 perguntinhas.',
  highlight: 'Meta calórica: ~{tdee_adjusted} kcal/dia',
  highlightLabel: 'Calculado com base no seu perfil',
  progressPercent: 80,
  duration: 0,
}
```

---

## 8. Fase 5 — Saúde & Estilo de Vida (Perguntas 20–22)

> **Objetivo UX:** holismo e diferenciação.  
> Mostrar que o MoveVocê vai além de treino e dieta — cuida da pessoa inteira.  
> Esse é o diferencial que o NutriInteligente não tem.

---

### Pergunta 20 — Qualidade do Sono

```ts
{
  id: 'sleepQuality',
  phase: 5,
  order: 1,
  type: 'single_select',
  question: 'Como você está dormindo?',
  subtext: 'O sono é onde os músculos crescem e a gordura é queimada 🌙',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Impacta volume de treino, recomendações de recuperação e sugestões de hábitos noturnos',
  options: [
    { value: 'sleeps_well',      label: 'Durmo muito bem',      icon: '😴', description: '7h+ por noite, acordo disposto(a)',  affirmation: 'Ótimo! Sono bom é metade do resultado.' },
    { value: 'sleeps_ok',        label: 'Durmo razoavelmente',  icon: '🙂', description: 'Dá pra descansar, mas não é ótimo',  affirmation: 'Seu plano vai incluir dicas para melhorar isso.' },
    { value: 'sleeps_poorly',    label: 'Durmo mal',            icon: '😵', description: 'Acordo cansado(a) com frequência',   affirmation: 'Sono ruim sabota qualquer dieta. Seu plano vai endereçar isso.' },
    { value: 'irregular_sleep',  label: 'Sono muito irregular', icon: '🎲', description: 'Varia muito de dia para dia',         affirmation: 'Entendido. Vamos incluir estratégias de rotina noturna.' },
  ],
}
```

---

### Pergunta 21 — Nível de Estresse

```ts
{
  id: 'stressLevel',
  phase: 5,
  order: 2,
  type: 'scale_rating',
  question: 'Como está seu nível de estresse no dia a dia?',
  subtext: 'Estresse elevado dificulta a perda de gordura — precisamos saber',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Estresse alto = cortisol elevado = retenção de gordura. Ajusta o protocolo de treino e inclui técnicas de gestão',
  options: [
    { value: '1', label: '😌', description: 'Muito tranquilo(a)',    affirmation: 'Maravilhoso! Ambiente ideal para resultados.' },
    { value: '2', label: '🙂', description: 'Bem tranquilo(a)',      affirmation: 'Ótimo nível. Fácil de equilibrar com treino.' },
    { value: '3', label: '😐', description: 'Estresse moderado',    affirmation: 'Treino vai ajudar a controlar isso também.' },
    { value: '4', label: '😟', description: 'Bastante estressado(a)', affirmation: 'Seu plano vai incluir técnicas de recuperação ativa.' },
    { value: '5', label: '😤', description: 'Muito estressado(a)',   affirmation: 'Entendido. Vamos adaptar o volume de treino para isso.' },
  ],
}
```

---

### Pergunta 22 — Rotina de Trabalho

```ts
{
  id: 'workStyle',
  phase: 5,
  order: 3,
  type: 'single_select',
  question: 'Como é sua rotina de trabalho?',
  required: true,
  autoAdvance: true,
  aiRelevance: 'Define o fator de atividade (AF) para cálculo do TDEE — fundamental para calibrar as calorias da dieta',
  options: [
    { value: 'sedentary_work',  label: 'Sentado a maior parte do dia', icon: '💻', description: 'Escritório, home office, estudo' },
    { value: 'light_active',    label: 'Em pé ou caminhando',          icon: '🚶', description: 'Comércio, atendimento, educação' },
    { value: 'very_active',     label: 'Trabalho físico pesado',       icon: '⚒️', description: 'Construção, logística, indústria' },
    { value: 'variable',        label: 'Varia muito',                  icon: '🔄', description: 'Nem sempre é igual' },
  ],
}
```

### Transição após Fase 5 → Loading de geração

```ts
{
  headline: 'Perfeito, {nome}! 🎉',
  subtext: 'Temos tudo que precisamos. Estamos montando o seu plano agora...',
  progressPercent: 95,
  duration: 0,  // avança para loading screen
}
```

---

## 9. Tela de Loading (Entre Fase 5 e CTA)

> Duração total: 4–5 segundos  
> Bullets aparecem em sequência com delay de 650ms cada  
> Barra de progresso de 95% → 100% animada

```ts
const loadingBullets = [
  { text: 'Calculando seu gasto calórico total (TDEE)...',    delay: 0 },
  { text: 'Montando a divisão de treino semanal...',           delay: 650 },
  { text: 'Selecionando exercícios para o seu nível...',       delay: 1300 },
  { text: 'Adaptando refeições às suas restrições...',         delay: 1950 },
  { text: 'Calculando porções em medidas caseiras...',         delay: 2600 },
  { text: 'Gerando sua lista de compras semanal...',           delay: 3250 },
  { text: 'Finalizando seu plano MoveVocê... ✅',              delay: 3900 },
]
```

> **UX note:** bullets em verde com checkmark ao aparecer.  
> Mostrar avatar/inicial do usuário no topo: *"Criando o plano de {nome}..."*

---

## 10. Tela de CTA — Preview + Paywall

> Estrutura visual (top → bottom):

```
┌─────────────────────────────────────────────────────┐
│  CABEÇALHO PERSONALIZADO                            │
│  "Pronto, {nome}! Seu plano MoveVocê está aqui 🎉" │
│  "Montamos tudo com base nas suas respostas"        │
├─────────────────────────────────────────────────────┤
│  RESUMO PERSONALIZADO (cards)                       │
│  🎯 Objetivo: {mainGoal_label}                      │
│  🏋️ Treino: {trainingDaysPerWeek}x / semana na {local} │
│  🍽️ Dieta: {tdee_adjusted} kcal/dia                │
│  📊 IMC: {imc} — {imcLabel}                        │
├─────────────────────────────────────────────────────┤
│  RESULTADO ESTIMADO                                 │
│  "Seguindo seu plano por 30 dias, você pode:"       │
│  → Perder até X kg de gordura (se objetivo = emagrecer) │
│  → Ganhar X kg de massa magra (se objetivo = hipertrofia) │
│  Disclaimer: "Resultados individuais podem variar"  │
├─────────────────────────────────────────────────────┤
│  PREVIEW BLOQUEADO                                  │
│  Semana 1 do treino — blur + ícone de cadeado       │
│  Cardápio do Dia 1 — blur + ícone de cadeado        │
│  Label: "Desbloqueie seu plano completo abaixo ↓"   │
├─────────────────────────────────────────────────────┤
│  O QUE ESTÁ INCLUÍDO                                │
│  ✅ Plano de treino mensal (4 semanas)              │
│  ✅ Plano de dieta diário com porções detalhadas    │
│  ✅ Medidas caseiras (colher, xícara, unidade)      │
│  ✅ Lista de compras semanal                        │
│  ✅ Alimentos brasileiros e acessíveis              │
│  ✅ PDF para download                               │
│  ✅ Acesso à área de membros                        │
│  ✅ Atualizações mensais                            │
├─────────────────────────────────────────────────────┤
│  COMPARATIVO DE VALOR                               │
│  Nutricionista particular: R$ 200–500/mês           │
│  Personal trainer: R$ 150–400/mês                  │
│  MoveVocê: uma fração disso, personalizado para você │
├─────────────────────────────────────────────────────┤
│  PROVA SOCIAL                                       │
│  "Mais de 10.000 planos gerados"                    │
│  ⭐⭐⭐⭐⭐ 3 depoimentos curtos (nome + texto 1 linha) │
├─────────────────────────────────────────────────────┤
│  CTA PRINCIPAL                                      │
│  [De R$ 79,90] por R$ 39,90                        │
│  Botão: "Quero meu plano completo agora →"          │
│  Escassez: "Seu plano fica salvo por 24 horas"      │
│  Garantia: "7 dias. Não gostou? Devolvemos tudo."   │
│  Segurança: 🔒 SSL • Pix • Cartão • Boleto          │
└─────────────────────────────────────────────────────┘
```

---

## 11. Cálculos Automáticos

```ts
// IMC
function calcIMC(weight: number, height: number): number {
  return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1))
}

function getIMCLabel(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Abaixo do peso',  color: '#3B82F6' }
  if (imc < 25)   return { label: 'Peso saudável',   color: '#22C55E' }
  if (imc < 30)   return { label: 'Acima do peso',   color: '#EAB308' }
  return                  { label: 'Obesidade',       color: '#F97316' }
}

// TMB — Harris-Benedict revisada (Mifflin-St Jeor — mais precisa)
function calcTMB(sex: 'male'|'female', weight: number, height: number, age: number): number {
  if (sex === 'male')   return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
}

// Fator de atividade (AF) pelo trabalho
const activityFactor: Record<string, number> = {
  sedentary_work: 1.2,
  light_active:   1.375,
  very_active:    1.725,
  variable:       1.55,
}

// TDEE base
function calcTDEE(tmb: number, workStyle: string): number {
  return Math.round(tmb * (activityFactor[workStyle] ?? 1.375))
}

// TDEE ajustado pelo objetivo
function adjustTDEEByGoal(tdee: number, goal: string): number {
  const adjustments: Record<string, number> = {
    lose_weight:     -500,   // déficit de 500 kcal
    body_definition: -250,   // déficit leve
    gain_muscle:     +300,   // superávit de 300 kcal
    more_health:      0,
    more_energy:      0,
    reduce_stress:    0,
  }
  return tdee + (adjustments[goal] ?? 0)
}

// Macros (proporção padrão por objetivo)
function calcMacros(
  tdee: number,
  goal: string,
  weight: number
): { protein: number; carbs: number; fat: number } {
  // Proteína: 2g/kg para hipertrofia, 1.8g/kg para emagrecimento, 1.6g/kg para manutenção
  const proteinMultiplier: Record<string, number> = {
    gain_muscle: 2.0, body_definition: 1.8,
    lose_weight: 1.8, more_health: 1.6,
    more_energy: 1.6, reduce_stress: 1.6,
  }
  const proteinG  = Math.round(weight * (proteinMultiplier[goal] ?? 1.6))
  const proteinKcal = proteinG * 4
  const fatKcal   = Math.round(tdee * 0.25)
  const carbsKcal = tdee - proteinKcal - fatKcal
  return {
    protein: proteinG,
    carbs:   Math.round(carbsKcal / 4),
    fat:     Math.round(fatKcal / 9),
  }
}
```

---

## 12. Progresso da Barra (Psicológico)

```ts
// Avança mais rápido no início — reduz abandono nas primeiras perguntas
const progressMap: Record<string, number> = {
  // Fase 1
  'firstName':           5,
  'mainGoal':           10,
  'biggestMotivation':  15,
  // Fase 2
  'biologicalSex':      19,
  'age':                23,
  'weight':             27,
  'height':             31,
  'bodyFeelingNow':     35,
  // Fase 3
  'fitnessLevel':       40,
  'trainingLocation':   44,
  'trainingDaysPerWeek':48,
  'sessionDuration':    52,
  'injuries':           55,
  // Fase 4
  'dietaryRestrictions':61,
  'mealsPerDay':        65,
  'cookingHabit':       69,
  'hungerPattern':      72,
  'waterIntake':        76,
  'foodRelationship':   80,
  // Fase 5
  'sleepQuality':       86,
  'stressLevel':        91,
  'workStyle':          95,
  // Loading → CTA
  'loading':           100,
}
```

---

## 13. Micro-afirmações Globais (fallback)

> Usadas quando a opção selecionada não tem `affirmation` definido

```ts
const globalAffirmations = [
  'Anotado! Seu plano vai considerar isso.',
  'Perfeito. Cada detalhe conta.',
  'Ótima informação. Seu plano está tomando forma.',
  'Entendido. Isso vai fazer diferença no seu resultado.',
  'Registrado. Estamos cada vez mais perto do seu plano ideal.',
]
```

---

## 14. Persistência e Estado

```ts
// Salvar progresso em localStorage a cada resposta
// Chave: 'movevoce_quiz_state'
// Expiração: 24 horas (timestamp salvo junto)

interface PersistedState {
  answers: Partial<QuestionnaireAnswers>
  currentPhase: number
  currentQuestionId: string
  savedAt: string   // ISO timestamp
}

// Ao carregar a página: verificar se existe estado salvo
// Se existir e tiver menos de 24h: oferecer continuar de onde parou
// Banner: "Você tem um plano em andamento. Continuar de onde parou?"
// Botões: "Continuar" | "Começar do zero"
```

---

## 15. Observações para o Antigravity

1. **Não integrar Claude API nem pagamento** — escopo desta etapa é apenas o questionário
2. **`autoAdvance: true`** em `single_select` significa avançar automaticamente após selecionar, sem botão "Próximo"
3. **Micro-afirmação** aparece na parte inferior da tela por 800ms antes de avançar
4. **IMC em tempo real** deve ser calculado e exibido abaixo dos campos de peso e altura simultaneamente
5. **Nome do usuário** deve ser injetado em todas as perguntas seguintes via interpolação `{nome}`
6. **`scale_rating`** renderiza como 5 cards grandes com emoji centralizado e label abaixo
7. **Animação de entrada** de cada pergunta: `opacity 0→1 + translateY 20px→0` em 300ms com `ease-out`
8. **Animação de saída**: `opacity 1→0 + translateY 0→-20px` em 200ms
9. **Exportar `QuestionnaireAnswers` como tipo público** — será consumido pelo back-end de geração da IA
10. **Mobile first** — questionário deve ser 100% funcional e bonito em telas de 375px de largura
11. **Fonte**: usar a mesma identidade visual MoveVocê (laranja `#FF6B00` como cor primária, verde `#1B6B4A` como cor de sucesso/confirmação)
