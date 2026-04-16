import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useQuestionnaire, calcIMC, getIMCLabel, progressMap } from '../context/QuestionnaireContext'
import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ScreenId =
  | 'firstName' | 'mainGoal' | 'biggestMotivation'
  | 'transition_1'
  | 'biologicalSex' | 'age' | 'weight' | 'height' | 'bodyFeelingNow'
  | 'transition_2'
  | 'fitnessLevel' | 'trainingLocation' | 'trainingDaysPerWeek' | 'sessionDuration' | 'injuries'
  | 'transition_3'
  | 'dietaryRestrictions' | 'mealsPerDay' | 'cookingHabit' | 'hungerPattern' | 'waterIntake' | 'foodRelationship'
  | 'transition_4'
  | 'sleepQuality' | 'stressLevel' | 'workStyle'
  | 'transition_5'
  | 'choosePlan' | 'planLoading' | 'createAccount'
  | 'loading'

interface Option {
  value: string
  label: string
  icon?: string
  description?: string
  affirmation?: string
}

interface PlanData {
  id: string
  nome: string
  slug: string
  destaque: boolean
  foco: string
  preco_mensal: number
  preco_anual_mensal: number
  cobranca_anual_total: number
  economia_anual: number
  garantia_dias: number
  features: { category: string; feature: string; included: boolean }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const FLOW: ScreenId[] = [
  'firstName', 'mainGoal', 'biggestMotivation',
  'transition_1',
  'biologicalSex', 'age', 'weight', 'height', 'bodyFeelingNow',
  'transition_2',
  'fitnessLevel', 'trainingLocation', 'trainingDaysPerWeek', 'sessionDuration', 'injuries',
  'transition_3',
  'dietaryRestrictions', 'mealsPerDay', 'cookingHabit', 'hungerPattern', 'waterIntake', 'foodRelationship',
  'transition_4',
  'sleepQuality', 'stressLevel', 'workStyle',
  'transition_5',
  'choosePlan', 'planLoading', 'createAccount',
  'loading',
]

const PLAN_LOADING_BULLETS = [
  'Analisando seu perfil completo...',
  'Selecionando os recursos ideais para você...',
  'Preparando seu plano personalizado...',
  'Quase lá... ✅',
]

const LOADING_BULLETS = [
  'Calculando seu gasto calórico total (TDEE)...',
  'Montando a divisão de treino semanal...',
  'Selecionando exercícios para o seu nível...',
  'Adaptando refeições às suas restrições...',
  'Calculando porções em medidas caseiras...',
  'Gerando sua lista de compras semanal...',
  'Finalizando seu plano MoveVocê... ✅',
]

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Emagrecer', gain_muscle: 'Ganhar massa', body_definition: 'Definir o corpo',
  more_health: 'Melhorar minha saúde', more_energy: 'Ter mais disposição', reduce_stress: 'Reduzir o estresse',
}

const LOCATION_LABELS: Record<string, string> = {
  gym: 'Academia', home: 'Em casa', outdoor: 'Ao ar livre', hybrid: 'Academia + casa',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function interpolate(text: string, name: string) {
  return text.replace(/\{nome\}/g, name || 'você')
}

const AFFIRMATION_FALLBACKS = [
  'Anotado! Seu plano vai considerar isso.',
  'Perfeito. Cada detalhe conta.',
  'Ótima informação. Seu plano está tomando forma.',
  'Entendido. Isso vai fazer diferença no seu resultado.',
  'Registrado. Estamos cada vez mais perto do seu plano ideal.',
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function OptionCard({
  opt, isSelected, onClick, multiSelect = false,
}: { opt: Option; isSelected: boolean; onClick: () => void; multiSelect?: boolean }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 rounded-xl transition-all text-left"
      style={{
        backgroundColor: isSelected ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)',
        border: isSelected ? '1.5px solid #EF3340' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {opt.icon && (
          <span className="text-2xl select-none shrink-0">{opt.icon}</span>
        )}
        <div className="min-w-0">
          <span className="font-semibold block" style={{ color: 'var(--color-on-surface)' }}>{opt.label}</span>
          {opt.description && (
            <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{opt.description}</span>
          )}
        </div>
      </div>
      <div
        className="w-6 h-6 flex items-center justify-center shrink-0 transition-all"
        style={{
          borderRadius: multiSelect ? '4px' : '50%',
          border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
          backgroundColor: isSelected ? '#EF3340' : 'transparent',
        }}
      >
        {isSelected && <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>check</span>}
      </div>
    </motion.button>
  )
}

function ScaleCard({ opt, isSelected, onClick }: { opt: Option; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-2 py-5 px-2 rounded-xl transition-all"
      style={{
        border: isSelected ? '1.5px solid #EF3340' : '1px solid rgba(255,255,255,0.06)',
        backgroundColor: isSelected ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)',
      }}
    >
      <span className="text-3xl">{opt.label}</span>
      <span className="text-[10px] text-center" style={{ color: 'var(--color-on-surface-variant)' }}>{opt.description}</span>
    </motion.button>
  )
}

function ButtonGroupCard({ opt, isSelected, onClick }: { opt: Option; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="flex-1 py-4 px-3 rounded-xl font-bold text-sm transition-all"
      style={{
        border: isSelected ? '1.5px solid #EF3340' : '1px solid rgba(255,255,255,0.06)',
        backgroundColor: isSelected ? '#EF3340' : 'var(--color-surface-container-low)',
        color: isSelected ? '#fff' : 'var(--color-on-surface)',
      }}
    >
      {opt.label}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Form component
// ─────────────────────────────────────────────────────────────────────────────

export default function Form() {
  const navigate = useNavigate()
  const { answers, setAnswer, computeMetrics } = useQuestionnaire()

  const [screenIndex, setScreenIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  // Inline affirmation: shown as a virtual screen between questions
  const [inlineAffirmation, setInlineAffirmation] = useState<string | null>(null)
  const [loadingBullets, setLoadingBullets] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Plan selection state ──────────────────────────────────────────────────
  const [plans, setPlans] = useState<PlanData[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [planLoadingBullets, setPlanLoadingBullets] = useState<string[]>([])
  const planLoadingDone = useRef(false)

  // ── Account creation state ────────────────────────────────────────────────
  const [accountEmail, setAccountEmail] = useState('')
  const [accountPassword, setAccountPassword] = useState('')
  const [accountError, setAccountError] = useState<string | null>(null)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const screenId = FLOW[screenIndex]
  // Use affirmation key so AnimatePresence treats it as its own screen
  const animKey = inlineAffirmation ? `aff-${screenIndex}` : screenId
  const progress = inlineAffirmation ? (progressMap[screenId] ?? 0) : (progressMap[screenId] ?? 0)

  // ── Fetch plans from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('preco_mensal', { ascending: true })
      if (data) setPlans(data as PlanData[])
    }
    fetchPlans()
  }, [])

  // ── IMC live ──────────────────────────────────────────────────────────────
  const liveIMC = answers.weight && answers.height
    ? calcIMC(answers.weight, answers.height)
    : null
  const liveIMCInfo = liveIMC ? getIMCLabel(liveIMC) : null

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = useCallback((aff?: string | null) => {
    if (aff && typeof aff === 'string') {
      // Show inline affirmation as a virtual screen, then slide to next
      setDirection(1)
      setInlineAffirmation(aff)
      setTimeout(() => {
        setInlineAffirmation(null)
        setScreenIndex(i => Math.min(i + 1, FLOW.length - 1))
      }, 3000)
    } else {
      setDirection(1)
      setScreenIndex(i => Math.min(i + 1, FLOW.length - 1))
    }
  }, [])

  const goBack = useCallback(() => {
    setDirection(-1)
    setScreenIndex(i => Math.max(i - 1, 0))
  }, [])

  // ── Plan loading animation ────────────────────────────────────────────────
  useEffect(() => {
    if (screenId !== 'planLoading') return
    if (planLoadingDone.current) {
      // Already done? Skip straight to next
      goNext()
      return
    }
    setPlanLoadingBullets([])
    PLAN_LOADING_BULLETS.forEach((bullet, i) => {
      setTimeout(() => {
        setPlanLoadingBullets(prev => [...prev, bullet])
      }, i * 650)
    })
    setTimeout(() => {
      planLoadingDone.current = true
      goNext()
    }, PLAN_LOADING_BULLETS.length * 650 + 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId])

  // ── Loading screen animation ───────────────────────────────────────────────
  useEffect(() => {
    if (screenId !== 'loading') return
    computeMetrics()

    LOADING_BULLETS.forEach((bullet, i) => {
      setTimeout(() => {
        setLoadingBullets(prev => [...prev, bullet])
      }, i * 650)
    })

    // Submit data then navigate
    setTimeout(async () => {
      await handleSubmit()
    }, LOADING_BULLETS.length * 650 + 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId])

  // ── Submit to Supabase ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      console.log('[MoveVocê] Verificando sessão do usuário...')
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Usuário não autenticado. Por favor, crie sua conta na etapa anterior.')
      }

      console.log('[MoveVocê] Enviando respostas para o banco de dados...', answers)

      const { data, error } = await supabase
        .from('questionario_respostas')
        .insert([{
          user_id: session.user.id,
          first_name: answers.firstName,
          main_goal: answers.mainGoal,
          biggest_motivation: answers.biggestMotivation,
          biological_sex: answers.biologicalSex,
          age: answers.age,
          weight_kg: answers.weight,
          height_cm: answers.height,
          body_feeling_now: answers.bodyFeelingNow,
          fitness_level: answers.fitnessLevel,
          training_location: answers.trainingLocation,
          training_days_per_week: answers.trainingDaysPerWeek,
          session_duration: answers.sessionDuration,
          injuries: answers.injuries,
          dietary_restrictions: answers.dietaryRestrictions,
          meals_per_day: answers.mealsPerDay,
          cooking_habit: answers.cookingHabit,
          hunger_pattern: answers.hungerPattern,
          water_intake: answers.waterIntake,
          food_relationship: answers.foodRelationship,
          sleep_quality: answers.sleepQuality,
          stress_level: answers.stressLevel,
          work_style: answers.workStyle,
          selected_plan_id: answers.selectedPlanId || null,
          imc: answers.imc,
          imc_label: answers.imcLabel,
          tmb: answers.tmb,
          tdee: answers.tdee,
          tdee_adjusted: answers.tdeeAdjusted,
          protein_g: answers.proteinG,
          carbs_g: answers.carbsG,
          fat_g: answers.fatG,
          status: 'completed'
        }])
        .select()
        .single()

      if (error) throw error

      console.log('[MoveVocê] Respostas salvas com sucesso! ID:', data?.id)
      navigate('/home')

    } catch (err: any) {
      console.error('[MoveVocê] Erro ao salvar dados:', err)
      setSubmitError(err.message || 'Erro ao sincronizar dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Single-select helper ──────────────────────────────────────────────────
  function handleSingleSelect(key: string, value: string, options: Option[], autoAdvance = true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAnswer(key as any, value)
    if (autoAdvance) {
      const opt = options.find(o => o.value === value)
      const aff = opt?.affirmation
        ?? AFFIRMATION_FALLBACKS[Math.floor(Math.random() * AFFIRMATION_FALLBACKS.length)]
      goNext(aff)
    }
  }

  // ── Account creation handler ──────────────────────────────────────────────
  const handleCreateAccount = async () => {
    setAccountError(null)
    if (!accountEmail.trim() || !accountPassword.trim()) {
      setAccountError('Preencha e-mail e senha.')
      return
    }
    if (accountPassword.length < 6) {
      setAccountError('A senha precisa ter no mínimo 6 caracteres.')
      return
    }
    setIsCreatingAccount(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: accountEmail.trim(),
        password: accountPassword,
      })
      if (error) throw error
      // Success — advance to final loading
      goNext()
    } catch (err: any) {
      console.error('[MoveVocê] Erro ao criar conta:', err)
      setAccountError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsCreatingAccount(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Renderers per screen
  // ─────────────────────────────────────────────────────────────────────────

  function renderScreen() {
    const name = answers.firstName || 'você'

    switch (screenId) {
      // ── Q1: Nome ──────────────────────────────────────────────────────────
      case 'firstName':
        return (
          <QuestionWrapper
            question="Antes de começar, qual é o seu nome?"
            subtext="Vamos personalizar tudo com o seu nome 😊"
          >
            <input
              type="text"
              autoFocus
              value={answers.firstName}
              onChange={e => setAnswer('firstName', e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full rounded-xl px-6 py-5 text-lg font-semibold outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: 'var(--color-on-surface)',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && answers.firstName.trim()) goNext() }}
            />
            <NextButton disabled={!answers.firstName.trim()} onClick={() => goNext()} />
          </QuestionWrapper>
        )

      // ── Q2: Objetivo ──────────────────────────────────────────────────────
      case 'mainGoal': {
        const opts: Option[] = [
          { value: 'lose_weight', label: 'Emagrecer', icon: '🔥', description: 'Reduzir gordura corporal', affirmation: `Ótima escolha, ${name}! Já temos o protocolo certo para você.` },
          { value: 'gain_muscle', label: 'Ganhar massa', icon: '💪', description: 'Aumentar músculo e força', affirmation: 'Perfeito! Seu plano vai priorizar hipertrofia.' },
          { value: 'body_definition', label: 'Definir o corpo', icon: '✨', description: 'Reduzir gordura mantendo músculo', affirmation: 'Definição é treino + dieta na medida certa. Vamos lá!' },
          { value: 'more_health', label: 'Melhorar minha saúde', icon: '❤️', description: 'Mais disposição, mais qualidade de vida', affirmation: 'Saúde em dia muda tudo. Seu plano será equilibrado e sustentável.' },
          { value: 'more_energy', label: 'Ter mais disposição', icon: '⚡', description: 'Acabar com o cansaço do dia a dia', affirmation: 'Treino e alimentação certos são a melhor fonte de energia.' },
          { value: 'reduce_stress', label: 'Reduzir o estresse', icon: '🧘', description: 'Equilíbrio físico e mental', affirmation: 'Movimento e nutrição são os melhores ansiolíticos naturais.' },
        ]
        return (
          <QuestionWrapper question="O que você mais quer alcançar?" subtext="Escolha o que mais te representa agora">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.mainGoal === opt.value} onClick={() => handleSingleSelect('mainGoal', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q3: Motivação ─────────────────────────────────────────────────────
      case 'biggestMotivation': {
        const opts: Option[] = [
          { value: 'health', label: 'Minha saúde preocupa', icon: '🏥', affirmation: 'Cuidar da saúde é o melhor investimento. Vamos juntos.' },
          { value: 'appearance', label: 'Quero me olhar no espelho e gostar', icon: '🪞', affirmation: 'Autoestima é poderosa. Seu plano vai te ajudar a chegar lá.' },
          { value: 'energy', label: 'Estou sempre cansado(a)', icon: '😴', affirmation: 'Dieta e treino certos mudam o nível de energia em semanas.' },
          { value: 'event', label: 'Tenho um evento se aproximando', icon: '📅', affirmation: 'Prazo definido = foco total. Vamos otimizar seu plano para isso.' },
          { value: 'family', label: 'Quero estar bem para minha família', icon: '👨‍👩‍👧', affirmation: 'O melhor presente para quem você ama é você saudável.' },
          { value: 'tired_of_trying', label: 'Já tentei de tudo e nada funcionou', icon: '😤', affirmation: 'Planos genéricos não funcionam. O seu será diferente, feito para você.' },
        ]
        return (
          <QuestionWrapper question="O que mais te motiva a mudar agora?" subtext="Sua resposta vai moldar o tom do seu plano">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.biggestMotivation === opt.value} onClick={() => handleSingleSelect('biggestMotivation', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Transição 1 ───────────────────────────────────────────────────────
      case 'transition_1':
        return (
          <TransitionScreen
            headline={`Entendemos, ${name}.`}
            subtext="Agora vamos conhecer o seu corpo para montar um plano que realmente funciona."
            socialProof="89% das pessoas que completam esse questionário veem resultados nas primeiras 3 semanas."
            onContinue={goNext}
          />
        )

      // ── Q4: Sexo ──────────────────────────────────────────────────────────
      case 'biologicalSex': {
        const opts: Option[] = [
          { value: 'male', label: 'Masculino', icon: '♂️', affirmation: 'Anotado.' },
          { value: 'female', label: 'Feminino', icon: '♀️', affirmation: 'Anotado.' },
        ]
        return (
          <QuestionWrapper question={interpolate('Qual é o seu sexo biológico, {nome}?', name)} subtext="">
            <div className="grid grid-cols-2 gap-4">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <button
                    onClick={() => handleSingleSelect('biologicalSex', opt.value, opts)}
                    className="w-full flex flex-col items-center gap-3 py-8 rounded-2xl transition-all"
                    style={{
                      border: answers.biologicalSex === opt.value ? '1.5px solid #EF3340' : '1px solid rgba(255,255,255,0.06)',
                      backgroundColor: answers.biologicalSex === opt.value ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)',
                    }}
                  >
                    <span className="text-4xl">{opt.icon}</span>
                    <span className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{opt.label}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q5: Idade ─────────────────────────────────────────────────────────
      case 'age':
        return (
          <QuestionWrapper question="Quantos anos você tem?" subtext="">
            <div className="flex flex-col items-center gap-4">
              <span className="text-7xl font-black" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>
                {answers.age}
              </span>
              <input
                type="range" min={16} max={70} step={1}
                value={answers.age}
                onChange={e => setAnswer('age', Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between w-full text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span>16 anos</span><span>70 anos</span>
              </div>
            </div>
            <NextButton onClick={() => goNext()} />
          </QuestionWrapper>
        )

      // ── Q6: Peso ──────────────────────────────────────────────────────────
      case 'weight':
        return (
          <QuestionWrapper question="Qual é o seu peso atual?" subtext="Seja honesto(a) — quanto mais preciso, melhor seu plano 😉">
            <NumberInputField
              value={answers.weight || ''}
              onChange={v => setAnswer('weight', v)}
              unit="kg" min={40} max={250} placeholder="70"
              helperText="Essa informação fica só entre a gente."
            />
            {liveIMC && liveIMCInfo && answers.height > 0 && (
              <IMCBadge imc={liveIMC} label={liveIMCInfo.label} color={liveIMCInfo.color} />
            )}
            <NextButton disabled={!answers.weight} onClick={() => goNext()} />
          </QuestionWrapper>
        )

      // ── Q7: Altura ────────────────────────────────────────────────────────
      case 'height':
        return (
          <QuestionWrapper question="Qual é a sua altura?" subtext="">
            <NumberInputField
              value={answers.height || ''}
              onChange={v => setAnswer('height', v)}
              unit="cm" min={140} max={220} placeholder="170"
            />
            {liveIMC && liveIMCInfo && answers.weight > 0 && (
              <IMCBadge imc={liveIMC} label={liveIMCInfo.label} color={liveIMCInfo.color} />
            )}
            <NextButton disabled={!answers.height} onClick={() => goNext()} />
          </QuestionWrapper>
        )

      // ── Q8: Como se sente com o corpo ─────────────────────────────────────
      case 'bodyFeelingNow': {
        const opts: Option[] = [
          { value: '1', label: '😞', description: 'Muito insatisfeito(a)', affirmation: 'Vamos mudar isso juntos. Você vai se surpreender.' },
          { value: '2', label: '😕', description: 'Insatisfeito(a)', affirmation: 'Tudo certo. Esse plano é exatamente o que você precisa.' },
          { value: '3', label: '😐', description: 'Mais ou menos', affirmation: 'Já está no caminho certo. Vamos acelerar isso.' },
          { value: '4', label: '🙂', description: 'Satisfeito(a)', affirmation: 'Ótimo! Vamos otimizar ainda mais.' },
          { value: '5', label: '😄', description: 'Muito satisfeito(a)', affirmation: 'Incrível! Vamos manter e evoluir.' },
        ]
        return (
          <QuestionWrapper question="Como você se sente com seu corpo hoje?" subtext="Escala de 1 (muito insatisfeito) a 5 (muito satisfeito)">
            <div className="flex gap-2">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} className="flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                  <ScaleCard opt={opt} isSelected={answers.bodyFeelingNow === opt.value} onClick={() => handleSingleSelect('bodyFeelingNow', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Transição 2 ───────────────────────────────────────────────────────
      case 'transition_2':
        return (
          <TransitionScreen
            headline={`Perfil físico completo, ${name}!`}
            subtext="Calculamos seu metabolismo basal e já sabemos quantas calorias seu corpo precisa. Agora vamos montar seu treino."
            highlight={answers.tmb ? `TMB: ${answers.tmb} kcal/dia` : undefined}
            highlightLabel="Seu metabolismo basal calculado"
            onContinue={goNext}
          />
        )

      // ── Q9: Condicionamento ───────────────────────────────────────────────
      case 'fitnessLevel': {
        const opts: Option[] = [
          { value: 'sedentary', label: 'Sedentário(a)', icon: '🛋️', description: 'Praticamente não me exercito', affirmation: 'Sem problema! Seu plano começa do zero, no ritmo certo.' },
          { value: 'beginner', label: 'Iniciante', icon: '🚶', description: 'Me exercito esporadicamente', affirmation: 'Ótimo ponto de partida. Vamos construir sua base.' },
          { value: 'intermediate', label: 'Intermediário(a)', icon: '🏃', description: 'Treino com certa regularidade', affirmation: 'Bom nível! Seu plano vai te levar para o próximo estágio.' },
          { value: 'advanced', label: 'Avançado(a)', icon: '🏋️', description: 'Treino com frequência e intensidade', affirmation: 'Excelente! Seu plano vai ser desafiador do jeito certo.' },
        ]
        return (
          <QuestionWrapper question="Como está seu condicionamento físico hoje?" subtext="">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.fitnessLevel === opt.value} onClick={() => handleSingleSelect('fitnessLevel', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q10: Local de treino ──────────────────────────────────────────────
      case 'trainingLocation': {
        const opts: Option[] = [
          { value: 'gym', label: 'Academia', icon: '🏋️', description: 'Acesso a todos os equipamentos', affirmation: 'Academia completa = plano completo. Vamos usar tudo.' },
          { value: 'home', label: 'Em casa', icon: '🏠', description: 'Treino com o que tenho', affirmation: 'Casa pode ser academia. Seu plano vai provar isso.' },
          { value: 'outdoor', label: 'Ao ar livre', icon: '🌳', description: 'Parque, rua ou área aberta', affirmation: 'Treino funcional ao ar livre é poderoso. Ótima escolha.' },
          { value: 'hybrid', label: 'Academia + casa', icon: '🔄', description: 'Combino os dois dependendo do dia', affirmation: 'Híbrido é o mais completo. Seu plano vai incluir ambos.' },
        ]
        return (
          <QuestionWrapper question="Onde você vai treinar?" subtext="">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.trainingLocation === opt.value} onClick={() => handleSingleSelect('trainingLocation', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q11: Dias de treino ───────────────────────────────────────────────
      case 'trainingDaysPerWeek': {
        const opts: Option[] = [
          { value: '2', label: '2x', affirmation: 'Fullbody 2x já dá resultado. Vamos aproveitar cada treino.' },
          { value: '3', label: '3x', affirmation: '3x por semana é o padrão ouro para iniciantes e intermediários.' },
          { value: '4', label: '4x', affirmation: '4x é ótimo para dividir bem os grupos musculares.' },
          { value: '5', label: '5x', affirmation: '5x é para quem quer acelerar. Vamos estruturar bem o descanso.' },
          { value: '6', label: '6x', affirmation: '6x exige planejamento inteligente de recuperação. Feito.' },
        ]
        return (
          <QuestionWrapper question="Quantos dias por semana você consegue treinar?" subtext="Seja realista — consistência bate intensidade">
            <div className="flex gap-2 flex-wrap">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} className="flex-1 min-w-[60px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                  <ButtonGroupCard opt={opt} isSelected={String(answers.trainingDaysPerWeek) === opt.value} onClick={() => { setAnswer('trainingDaysPerWeek', Number(opt.value)); goNext(opt.affirmation) }} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q12: Duração da sessão ─────────────────────────────────────────────
      case 'sessionDuration': {
        const opts: Option[] = [
          { value: 'up_to_30', label: 'Até 30 min', icon: '⚡', description: 'Sessões curtas e intensas', affirmation: '30 minutos focados fazem mais do que 1 hora sem foco.' },
          { value: '30_to_45', label: '30 a 45 min', icon: '🎯', description: 'Tempo ideal para a maioria', affirmation: 'Perfeito. Esse tempo é o sweet spot de eficiência.' },
          { value: '45_to_60', label: '45 a 60 min', icon: '💪', description: 'Sessão completa e estruturada', affirmation: 'Excelente. Dá para trabalhar tudo com qualidade.' },
          { value: 'over_60', label: 'Mais de 1 hora', icon: '🏆', description: 'Treino longo e dedicado', affirmation: 'Volume alto = resultados expressivos. Vamos estruturar bem.' },
        ]
        return (
          <QuestionWrapper question="Quanto tempo você tem por sessão?" subtext="">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.sessionDuration === opt.value} onClick={() => handleSingleSelect('sessionDuration', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q13: Lesões ───────────────────────────────────────────────────────
      case 'injuries': {
        const opts: Option[] = [
          { value: 'none', label: 'Nenhuma limitação', icon: '✅' },
          { value: 'spine', label: 'Coluna / lombar', icon: '🦴' },
          { value: 'knee', label: 'Joelho', icon: '🦵' },
          { value: 'shoulder', label: 'Ombro', icon: '💪' },
          { value: 'hip', label: 'Quadril', icon: '🦿' },
          { value: 'wrist', label: 'Punho / mão', icon: '🖐️' },
          { value: 'other', label: 'Outra limitação', icon: '⚠️' },
        ]
        const toggle = (v: string) => {
          if (v === 'none') { setAnswer('injuries', ['none']); return }
          const curr = answers.injuries.filter(x => x !== 'none')
          setAnswer('injuries', curr.includes(v) ? curr.filter(x => x !== v) : [...curr, v])
        }
        return (
          <QuestionWrapper question="Você tem alguma lesão ou limitação física?" subtext="Isso é importante para evitar exercícios contraindicados 🩺">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.injuries.includes(opt.value)} onClick={() => toggle(opt.value)} multiSelect />
                </motion.div>
              ))}
            </div>
            <NextButton disabled={answers.injuries.length === 0} onClick={() => goNext()} />
          </QuestionWrapper>
        )
      }

      // ── Transição 3 ───────────────────────────────────────────────────────
      case 'transition_3':
        return (
          <TransitionScreen
            headline={`Treino estruturado, ${name}!`}
            subtext="Já temos a divisão do seu treino semanal. Agora falta a parte que a maioria ignora: a alimentação."
            socialProof="Treino sem dieta entrega 40% do resultado. Treino com dieta entrega 100%."
            onContinue={goNext}
          />
        )

      // ── Q14: Restrições alimentares ───────────────────────────────────────
      case 'dietaryRestrictions': {
        const opts: Option[] = [
          { value: 'none', label: 'Nenhuma', icon: '✅', description: 'Como de tudo normalmente' },
          { value: 'vegetarian', label: 'Vegetariano(a)', icon: '🥦', description: 'Sem carnes' },
          { value: 'vegan', label: 'Vegano(a)', icon: '🌱', description: 'Sem produtos animais' },
          { value: 'gluten_free', label: 'Sem glúten', icon: '🌾', description: 'Intolerância ao glúten/doença celíaca' },
          { value: 'lactose_free', label: 'Sem lactose', icon: '🥛', description: 'Intolerância à lactose' },
          { value: 'low_carb', label: 'Low carb', icon: '🥩', description: 'Prefiro reduzir carboidratos' },
          { value: 'no_pork', label: 'Sem carne de porco', icon: '🐷', description: 'Religião ou preferência' },
          { value: 'food_allergy', label: 'Alergia alimentar', icon: '⚠️', description: 'Amendoim, frutos do mar etc.' },
        ]
        const toggle = (v: string) => {
          if (v === 'none') { setAnswer('dietaryRestrictions', ['none']); return }
          const curr = answers.dietaryRestrictions.filter(x => x !== 'none')
          setAnswer('dietaryRestrictions', curr.includes(v) ? curr.filter(x => x !== v) : [...curr, v])
        }
        return (
          <QuestionWrapper question="Você tem alguma restrição ou preferência alimentar?" subtext="Seu plano vai respeitar cada uma delas 💚">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <OptionCard opt={opt} isSelected={answers.dietaryRestrictions.includes(opt.value)} onClick={() => toggle(opt.value)} multiSelect />
                </motion.div>
              ))}
            </div>
            <NextButton disabled={answers.dietaryRestrictions.length === 0} onClick={() => goNext()} />
          </QuestionWrapper>
        )
      }

      // ── Q15: Refeições por dia ────────────────────────────────────────────
      case 'mealsPerDay': {
        const opts: Option[] = [
          { value: '2', label: '2 refeições', affirmation: 'Jejum intermitente? Seu plano vai se adaptar a isso.' },
          { value: '3', label: '3 refeições', affirmation: 'Café, almoço e jantar. Clássico e eficiente.' },
          { value: '4', label: '4 refeições', affirmation: '4 refeições é ótimo para manter o metabolismo ativo.' },
          { value: '5', label: '5+ refeições', affirmation: 'Frequência alta = metabolismo acelerado. Ótimo!' },
        ]
        return (
          <QuestionWrapper question="Quantas refeições você consegue fazer por dia?" subtext="Incluindo lanches — seja realista com sua rotina">
            <div className="flex gap-2 flex-wrap">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} className="flex-1 min-w-[100px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                  <ButtonGroupCard opt={opt} isSelected={String(answers.mealsPerDay) === opt.value} onClick={() => { setAnswer('mealsPerDay', Number(opt.value.replace('+', ''))); goNext(opt.affirmation) }} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q16: Cozinhar ─────────────────────────────────────────────────────
      case 'cookingHabit': {
        const opts: Option[] = [
          { value: 'cooks_a_lot', label: 'Sim, cozinho bastante', icon: '👨‍🍳', description: 'Tenho tempo e gosto de cozinhar', affirmation: 'Incrível! Seu plano vai ter receitas mais completas e saborosas.' },
          { value: 'cooks_simple', label: 'Só coisas simples', icon: '🍳', description: 'Prefiro receitas rápidas e fáceis', affirmation: 'Sem problema. Seu plano vai ter no máximo 15 minutos de preparo.' },
          { value: 'rarely_cooks', label: 'Quase não cozinho', icon: '🥡', description: 'Preciso de opções prontas ou rápidas', affirmation: 'Entendido. Seu plano vai priorizar marmitas e opções de mercado.' },
        ]
        return (
          <QuestionWrapper question="Você costuma cozinhar em casa?" subtext="">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <OptionCard opt={opt} isSelected={answers.cookingHabit === opt.value} onClick={() => handleSingleSelect('cookingHabit', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q17: Padrão de fome ───────────────────────────────────────────────
      case 'hungerPattern': {
        const opts: Option[] = [
          { value: 'morning_hunger', label: 'Acordo com fome', icon: '☀️', description: 'Café da manhã é minha refeição mais importante' },
          { value: 'afternoon_hunger', label: 'Fome forte à tarde', icon: '⏰', description: 'Fico com mais fome entre almoço e jantar' },
          { value: 'night_hunger', label: 'Fome maior à noite', icon: '🌙', description: 'À noite é quando mais quero comer' },
          { value: 'irregular', label: 'Fome irregular', icon: '🎲', description: 'Não tenho horário certo, varia muito' },
          { value: 'never_hungry', label: 'Raramente sinto fome', icon: '😶', description: 'Preciso me lembrar de comer' },
        ]
        return (
          <QuestionWrapper question="Como é sua fome durante o dia?" subtext="Essa informação ajuda a distribuir suas calorias no horário certo">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.hungerPattern === opt.value} onClick={() => handleSingleSelect('hungerPattern', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q18: Água ─────────────────────────────────────────────────────────
      case 'waterIntake': {
        const opts: Option[] = [
          { value: 'very_little', label: 'Muito pouco', icon: '😬', description: 'Quase não bebo água', affirmation: 'Seu plano vai incluir uma meta de hidratação fácil de seguir.' },
          { value: 'little', label: 'Menos de 1 litro', icon: '🥤', description: 'Bebo mas sei que é pouco', affirmation: 'Vamos aumentar isso gradualmente. Faz diferença enorme.' },
          { value: 'moderate', label: '1 a 2 litros', icon: '💧', description: 'Bebo razoavelmente bem', affirmation: 'Bom! Seu plano vai sugerir a meta ideal para seu peso.' },
          { value: 'good', label: 'Mais de 2 litros', icon: '🌊', description: 'Me preocupo com hidratação', affirmation: 'Excelente hábito! Isso vai potencializar seus resultados.' },
        ]
        return (
          <QuestionWrapper question="Quanto de água você costuma beber por dia?" subtext="Hidratação afeta diretamente seu desempenho e metabolismo">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <OptionCard opt={opt} isSelected={answers.waterIntake === opt.value} onClick={() => handleSingleSelect('waterIntake', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q19: Relação com alimentação ──────────────────────────────────────
      case 'foodRelationship': {
        const opts: Option[] = [
          { value: 'eats_well_unorganized', label: 'Como bem, mas sem organização', icon: '📋', affirmation: 'Organizar já é 80% do trabalho. Vamos facilitar isso.' },
          { value: 'eats_poorly', label: 'Sei que me alimento mal', icon: '😬', affirmation: 'Honestidade é o primeiro passo. Seu plano vai mudar isso com calma.' },
          { value: 'tried_diets_failed', label: 'Já tentei dietas e não consegui seguir', icon: '😤', affirmation: 'Dietas rígidas falham. O seu vai ser flexível e real.' },
          { value: 'emotional_eating', label: 'Como por ansiedade ou estresse', icon: '😰', affirmation: 'Comer emocional é muito comum. Seu plano vai incluir estratégias para isso.' },
          { value: 'eats_well_optimize', label: 'Me alimento bem, quero otimizar', icon: '🎯', affirmation: 'Ótimo ponto de partida! Vamos afinar os detalhes.' },
        ]
        return (
          <QuestionWrapper question="Como você descreveria sua relação com a alimentação hoje?" subtext="Seja honesto(a) — isso nos ajuda a montar um plano realista que você vai conseguir seguir">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OptionCard opt={opt} isSelected={answers.foodRelationship === opt.value} onClick={() => handleSingleSelect('foodRelationship', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Transição 4 ───────────────────────────────────────────────────────
      case 'transition_4':
        return (
          <TransitionScreen
            headline={`Dieta desenhada, ${name}!`}
            subtext="Calculamos sua necessidade calórica diária e os macros ideais para o seu objetivo. Só mais 3 perguntinhas."
            highlight={answers.tdeeAdjusted ? `Meta calórica: ~${answers.tdeeAdjusted} kcal/dia` : undefined}
            highlightLabel="Calculado com base no seu perfil"
            onContinue={goNext}
          />
        )

      // ── Q20: Sono ─────────────────────────────────────────────────────────
      case 'sleepQuality': {
        const opts: Option[] = [
          { value: 'sleeps_well', label: 'Durmo muito bem', icon: '😴', description: '7h+ por noite, acordo disposto(a)', affirmation: 'Ótimo! Sono bom é metade do resultado.' },
          { value: 'sleeps_ok', label: 'Durmo razoavelmente', icon: '🙂', description: 'Dá pra descansar, mas não é ótimo', affirmation: 'Seu plano vai incluir dicas para melhorar isso.' },
          { value: 'sleeps_poorly', label: 'Durmo mal', icon: '😵', description: 'Acordo cansado(a) com frequência', affirmation: 'Sono ruim sabota qualquer dieta. Seu plano vai endereçar isso.' },
          { value: 'irregular_sleep', label: 'Sono muito irregular', icon: '🎲', description: 'Varia muito de dia para dia', affirmation: 'Entendido. Vamos incluir estratégias de rotina noturna.' },
        ]
        return (
          <QuestionWrapper question="Como você está dormindo?" subtext="O sono é onde os músculos crescem e a gordura é queimada 🌙">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <OptionCard opt={opt} isSelected={answers.sleepQuality === opt.value} onClick={() => handleSingleSelect('sleepQuality', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q21: Estresse ─────────────────────────────────────────────────────
      case 'stressLevel': {
        const opts: Option[] = [
          { value: '1', label: '😌', description: 'Muito tranquilo(a)', affirmation: 'Maravilhoso! Ambiente ideal para resultados.' },
          { value: '2', label: '🙂', description: 'Bem tranquilo(a)', affirmation: 'Ótimo nível. Fácil de equilibrar com treino.' },
          { value: '3', label: '😐', description: 'Estresse moderado', affirmation: 'Treino vai ajudar a controlar isso também.' },
          { value: '4', label: '😟', description: 'Bastante estressado(a)', affirmation: 'Seu plano vai incluir técnicas de recuperação ativa.' },
          { value: '5', label: '😤', description: 'Muito estressado(a)', affirmation: 'Entendido. Vamos adaptar o volume de treino para isso.' },
        ]
        return (
          <QuestionWrapper question="Como está seu nível de estresse no dia a dia?" subtext="Estresse elevado dificulta a perda de gordura — precisamos saber">
            <div className="flex gap-2">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} className="flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                  <ScaleCard opt={opt} isSelected={answers.stressLevel === opt.value} onClick={() => handleSingleSelect('stressLevel', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Q22: Rotina de trabalho ───────────────────────────────────────────
      case 'workStyle': {
        const opts: Option[] = [
          { value: 'sedentary_work', label: 'Sentado a maior parte do dia', icon: '💻', description: 'Escritório, home office, estudo' },
          { value: 'light_active', label: 'Em pé ou caminhando', icon: '🚶', description: 'Comércio, atendimento, educação' },
          { value: 'very_active', label: 'Trabalho físico pesado', icon: '⚒️', description: 'Construção, logística, indústria' },
          { value: 'variable', label: 'Varia muito', icon: '🔄', description: 'Nem sempre é igual' },
        ]
        return (
          <QuestionWrapper question="Como é sua rotina de trabalho?" subtext="">
            <div className="space-y-3">
              {opts.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <OptionCard opt={opt} isSelected={answers.workStyle === opt.value} onClick={() => handleSingleSelect('workStyle', opt.value, opts)} />
                </motion.div>
              ))}
            </div>
          </QuestionWrapper>
        )
      }

      // ── Transição 5 → Escolha do plano ──────────────────────────────────────
      case 'transition_5':
        return (
          <TransitionScreen
            headline={`Perfeito, ${name}! 🎉`}
            subtext="Temos tudo que precisamos para criar seu plano. Agora escolha o plano ideal para você."
            onContinue={goNext}
          />
        )

      // ── Escolha do plano ───────────────────────────────────────────────────
      case 'choosePlan':
        return (
          <div className="w-full space-y-6 pb-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                Escolha seu plano
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                Todos os planos incluem 7 dias de garantia incondicional
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: billingCycle === 'monthly' ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>
                Mensal
              </span>
              <button
                onClick={() => setBillingCycle(c => c === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 rounded-full transition-colors"
                style={{ backgroundColor: billingCycle === 'annual' ? '#EF3340' : 'rgba(255,255,255,0.15)' }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow"
                  animate={{ left: billingCycle === 'annual' ? '30px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: billingCycle === 'annual' ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>
                Anual
              </span>
              {billingCycle === 'annual' && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                  ECONOMIA
                </motion.span>
              )}
            </div>

            {/* Plan cards */}
            <div className="space-y-4">
              {plans.map((plan, idx) => {
                const isSelected = answers.selectedPlanId === plan.id
                const price = billingCycle === 'annual' ? plan.preco_anual_mensal : plan.preco_mensal
                const priceStr = Number(price).toFixed(2)
                const [intPart, decPart] = priceStr.split('.')
                const includedFeatures = plan.features.filter(f => f.included)

                return (
                  <motion.button
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setAnswer('selectedPlanId', plan.id)}
                    className="w-full text-left rounded-2xl p-5 transition-all relative overflow-hidden"
                    style={{
                      border: isSelected ? '2px solid #EF3340' : plan.destaque ? '2px solid rgba(239,51,64,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: isSelected ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)',
                      boxShadow: isSelected ? '0 0 24px rgba(239,51,64,0.15)' : 'none',
                    }}
                  >
                    {/* Popular badge */}
                    {plan.destaque && (
                      <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest"
                        style={{ backgroundColor: '#EF3340', color: '#fff' }}>
                        ⭐ Popular
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-black" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                            {plan.nome}
                          </h3>
                        </div>
                        <p className="text-xs mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                          {plan.foco}
                        </p>

                        {/* Top features */}
                        <div className="space-y-1.5">
                          {includedFeatures.slice(0, 5).map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                              <span style={{ color: '#22C55E', fontSize: '12px' }}>✓</span>
                              {f.feature}
                            </div>
                          ))}
                          {includedFeatures.length > 5 && (
                            <p className="text-[10px] font-bold" style={{ color: '#EF3340' }}>
                              +{includedFeatures.length - 5} recursos incluídos
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 pt-1">
                        <div className="flex items-baseline gap-0.5 justify-end">
                          <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>R$</span>
                          <span className="text-3xl font-black" style={{ fontFamily: 'var(--font-headline)', color: isSelected ? '#EF3340' : 'var(--color-on-surface)' }}>
                            {intPart}
                          </span>
                          <span className="text-sm font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                            ,{decPart}
                          </span>
                        </div>
                        <span className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>/mês</span>
                        {billingCycle === 'annual' && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-[10px] font-bold mt-1" style={{ color: '#22C55E' }}>
                            Economize R$ {Number(plan.economia_anual).toFixed(0)}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    <div className="flex items-center justify-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                        style={{
                          border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                          backgroundColor: isSelected ? '#EF3340' : 'transparent',
                        }}
                      >
                        {isSelected && <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>check</span>}
                      </div>
                      <span className="ml-2 text-xs font-bold" style={{ color: isSelected ? '#EF3340' : 'var(--color-on-surface-variant)' }}>
                        {isSelected ? 'Selecionado' : 'Selecionar plano'}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Guarantee badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(27,107,74,0.1)', border: '1px solid rgba(27,107,74,0.25)' }}>
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs font-bold" style={{ color: '#22C55E' }}>Garantia de 7 dias</p>
                <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>Se não gostar, devolvemos 100% do seu dinheiro.</p>
              </div>
            </motion.div>

            <NextButton
              disabled={!answers.selectedPlanId}
              onClick={() => goNext()}
              label="CONTINUAR COM ESTE PLANO"
            />
          </div>
        )

      // ── Plan loading bullets ─────────────────────────────────────────────────
      case 'planLoading':
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
              ⚡
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                Preparando tudo...
              </h2>
            </div>
            <div className="space-y-3 w-full">
              <AnimatePresence>
                {planLoadingBullets.map((bullet, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: '#22C55E' }}>
                    <span className="text-lg">✅</span>
                    {bullet}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )

      // ── Criação de conta ────────────────────────────────────────────────────
      case 'createAccount':
        return (
          <div className="w-full space-y-6 pb-6">
            <div className="text-center space-y-2">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-2"
                style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                🚀
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                Crie sua conta
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                Falta pouco, {name}! Cadastre-se para acessar seu plano.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-on-surface-variant)' }}>
                  E-mail
                </label>
                <input
                  type="email"
                  autoFocus
                  value={accountEmail}
                  onChange={e => setAccountEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl px-6 py-5 text-base font-semibold outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'var(--color-on-surface)',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Senha
                </label>
                <input
                  type="password"
                  value={accountPassword}
                  onChange={e => setAccountPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl px-6 py-5 text-base font-semibold outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'var(--color-on-surface)',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter' && accountEmail.trim() && accountPassword.length >= 6) handleCreateAccount() }}
                />
              </div>
            </div>

            {accountError && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(239,51,64,0.1)', color: '#EF3340' }}>
                {accountError}
              </motion.div>
            )}

            <button
              onClick={handleCreateAccount}
              disabled={isCreatingAccount || !accountEmail.trim() || accountPassword.length < 6}
              className="w-full py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 mt-2 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff' }}
            >
              {isCreatingAccount ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando...
                </>
              ) : (
                'CRIAR CONTA E FINALIZAR'
              )}
            </button>

            <p className="text-[10px] text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
              Ao criar sua conta, você concorda com nossos <a href="#" className="underline">Termos de Uso</a> e <a href="#" className="underline">Política de Privacidade</a>.
            </p>
          </div>
        )

      // ── Loading ───────────────────────────────────────────────────────────
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
              style={{ backgroundColor: '#EF3340', color: '#fff', fontFamily: 'var(--font-headline)' }}>
              {(answers.firstName || 'M')[0].toUpperCase()}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>Criando o plano de</p>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
                {answers.firstName || 'você'}...
              </h2>
            </div>
            <div className="space-y-3 w-full">
              <AnimatePresence>
                {loadingBullets.map((bullet, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: '#22C55E' }}>
                    <span className="text-lg">✅</span>
                    {bullet}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {submitError && (
              <div className="text-sm text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,51,64,0.1)', color: '#EF3340' }}>
                {submitError}
                <button onClick={handleSubmit} className="block mt-2 font-bold underline">Tentar novamente</button>
              </div>
            )}
            {isSubmitting && !submitError && (
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Salvando seu perfil...</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isTransition = screenId.startsWith('transition_')
  const isLoading = screenId === 'loading'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 w-full z-50">
        <button
          onClick={goBack}
          disabled={screenIndex === 0 || isLoading || !!inlineAffirmation}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors disabled:opacity-30"
          style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="text-xl font-black italic uppercase tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>
          Move Você
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Progress bar */}
      {!isLoading && (
        <div className="w-full px-6 mb-6">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#EF3340' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>
              {Math.round(progress)}% concluído
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>
              ~4 min
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`flex-grow flex flex-col items-center px-4 py-2 w-full ${isTransition || isLoading ? 'justify-center' : ''} max-w-2xl mx-auto`}>
        <AnimatePresence mode="sync" custom={direction}>
          {inlineAffirmation ? (
            // ── Inline affirmation screen (replaces question temporarily) ──
            <motion.div
              key={animKey}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full flex flex-col items-center justify-center text-center gap-6 py-16"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 240 }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'rgba(27,107,74,0.15)', border: '1.5px solid rgba(27,107,74,0.4)' }}
              >
                👍
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-xl font-bold max-w-xs"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}
              >
                {inlineAffirmation}
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 2.3, ease: 'linear' }}
                className="h-1.5 w-64 md:w-80 rounded-full"
                style={{ backgroundColor: '#1B6B4A' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={animKey}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -20 : 20 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full"
            >
              {renderScreen()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      {/* Footer */}
      {!isLoading && (
        <footer className="w-full mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-headline)', color: 'rgba(120,115,114,1)' }}>
              © 2026 Move Você
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
              Segurança de Dados
            </div>
            <div className="flex gap-6">
              {['Termos', 'Privacidade', 'Suporte'].map(l => (
                <a key={l} href="#" className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#EF3340]"
                  style={{ fontFamily: 'var(--font-headline)', color: 'rgba(120,115,114,1)' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI sub-components
// ─────────────────────────────────────────────────────────────────────────────

function QuestionWrapper({ question, subtext, children }: { question: string; subtext: string; children: ReactNode }) {
  return (
    <div className="w-full space-y-6 pb-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
          {question}
        </h1>
        {subtext && (
          <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>{subtext}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function NextButton({ onClick, disabled = false, label = 'PRÓXIMO' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 mt-2"
      style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff' }}
    >
      {label}
    </button>
  )
}

function NumberInputField({
  value, onChange, unit, placeholder, helperText,
}: { value: string | number; onChange: (v: number) => void; unit: string; min?: number; max?: number; placeholder?: string; helperText?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl overflow-hidden"
        style={{ border: '1.5px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--color-surface-container-low)' }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className="flex-1 px-6 py-5 text-xl font-bold outline-none bg-transparent"
          style={{ color: 'var(--color-on-surface)' }}
        />
        <span className="px-5 text-sm font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>{unit}</span>
      </div>
      {helperText && (
        <p className="text-xs px-1" style={{ color: 'var(--color-on-surface-variant)' }}>{helperText}</p>
      )}
    </div>
  )
}

function IMCBadge({ imc, label, color }: { imc: number; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}44` }}
    >
      <span className="text-xl">📊</span>
      <div>
        <p className="text-sm font-bold" style={{ color }}>IMC: {imc} — {label}</p>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Vamos ajustar seu plano para esse perfil.</p>
      </div>
    </motion.div>
  )
}

function TransitionScreen({
  headline, subtext, highlight, highlightLabel, socialProof, onContinue,
}: {
  headline: string; subtext: string; highlight?: string;
  highlightLabel?: string; socialProof?: string; onContinue: () => void
}) {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
        🎯
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
          {headline}
        </h2>
        <p className="text-sm font-medium max-w-sm mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>{subtext}</p>
      </div>

      {highlight && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="px-6 py-4 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
          <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>{highlight}</p>
          {highlightLabel && <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>{highlightLabel}</p>}
        </motion.div>
      )}

      {socialProof && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-xs font-semibold max-w-xs px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(27,107,74,0.15)', color: '#22C55E', border: '1px solid rgba(27,107,74,0.3)' }}>
          💬 {socialProof}
        </motion.p>
      )}

      <button
        onClick={() => onContinue()}
        className="w-full max-w-sm py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff' }}
      >
        Continuar →
      </button>
    </div>
  )
}

// Needed for GOAL_LABELS and LOCATION_LABELS usage in other files (e.g. CTA page)
export { GOAL_LABELS, LOCATION_LABELS }
