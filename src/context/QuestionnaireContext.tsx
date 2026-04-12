import { createContext, useContext, useState, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Types — exportados para uso pelo back-end de IA
// ─────────────────────────────────────────────────────────────────────────────

export interface QuestionnaireAnswers {
  // Fase 1 — Identidade
  firstName: string
  mainGoal: string
  biggestMotivation: string

  // Fase 2 — Corpo
  biologicalSex: 'male' | 'female' | ''
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

  // Fase 5 — Saúde & Estilo de Vida
  sleepQuality: string
  stressLevel: string
  workStyle: string

  // Calculados automaticamente
  imc?: number
  imcLabel?: string
  tmb?: number
  tdee?: number
  tdeeAdjusted?: number
  proteinG?: number
  carbsG?: number
  fatG?: number
}

export const EMPTY_ANSWERS: QuestionnaireAnswers = {
  firstName: '',
  mainGoal: '',
  biggestMotivation: '',
  biologicalSex: '',
  age: 28,
  weight: 70,
  height: 170,
  bodyFeelingNow: '',
  fitnessLevel: '',
  trainingLocation: '',
  trainingDaysPerWeek: 3,
  sessionDuration: '',
  injuries: [],
  dietaryRestrictions: [],
  mealsPerDay: 3,
  cookingHabit: '',
  hungerPattern: '',
  waterIntake: '',
  foodRelationship: '',
  sleepQuality: '',
  stressLevel: '',
  workStyle: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// Cálculos automáticos
// ─────────────────────────────────────────────────────────────────────────────

export function calcIMC(weight: number, height: number): number {
  return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1))
}

export function getIMCLabel(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Abaixo do peso', color: '#3B82F6' }
  if (imc < 25)   return { label: 'Peso saudável',  color: '#22C55E' }
  if (imc < 30)   return { label: 'Acima do peso',  color: '#EAB308' }
  return               { label: 'Obesidade',        color: '#F97316' }
}

export function calcTMB(sex: 'male' | 'female' | '', weight: number, height: number, age: number): number {
  if (sex === 'male') return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
}

const activityFactor: Record<string, number> = {
  sedentary_work: 1.2,
  light_active:   1.375,
  very_active:    1.725,
  variable:       1.55,
}

export function calcTDEE(tmb: number, workStyle: string): number {
  return Math.round(tmb * (activityFactor[workStyle] ?? 1.375))
}

export function adjustTDEEByGoal(tdee: number, goal: string): number {
  const adjustments: Record<string, number> = {
    lose_weight:     -500,
    body_definition: -250,
    gain_muscle:     +300,
    more_health:      0,
    more_energy:      0,
    reduce_stress:    0,
  }
  return tdee + (adjustments[goal] ?? 0)
}

export function calcMacros(tdee: number, goal: string, weight: number) {
  const multiplier: Record<string, number> = {
    gain_muscle: 2.0, body_definition: 1.8,
    lose_weight: 1.8, more_health: 1.6,
    more_energy: 1.6, reduce_stress: 1.6,
  }
  const proteinG    = Math.round(weight * (multiplier[goal] ?? 1.6))
  const proteinKcal = proteinG * 4
  const fatKcal     = Math.round(tdee * 0.25)
  const carbsKcal   = tdee - proteinKcal - fatKcal
  return {
    protein: proteinG,
    carbs:   Math.round(carbsKcal / 4),
    fat:     Math.round(fatKcal / 9),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress map (psicológico — avança mais rápido no início)
// ─────────────────────────────────────────────────────────────────────────────

export const progressMap: Record<string, number> = {
  firstName: 5, mainGoal: 10, biggestMotivation: 15,
  transition_1: 15,
  biologicalSex: 19, age: 23, weight: 27, height: 31, bodyFeelingNow: 35,
  transition_2: 35,
  fitnessLevel: 40, trainingLocation: 44, trainingDaysPerWeek: 48, sessionDuration: 52, injuries: 55,
  transition_3: 55,
  dietaryRestrictions: 61, mealsPerDay: 65, cookingHabit: 69, hungerPattern: 72, waterIntake: 76, foodRelationship: 80,
  transition_4: 80,
  sleepQuality: 86, stressLevel: 91, workStyle: 95,
  transition_5: 95,
  loading: 100,
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface QuestionnaireContextType {
  answers: QuestionnaireAnswers
  setAnswer: <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => void
  resetAnswers: () => void
  computeMetrics: () => void
}

const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null)

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    try {
      const saved = localStorage.getItem('movevoce_quiz_state')
      if (saved) {
        const parsed = JSON.parse(saved) as { answers: QuestionnaireAnswers; savedAt: string }
        const savedAt = new Date(parsed.savedAt).getTime()
        if (Date.now() - savedAt < 24 * 60 * 60 * 1000) return parsed.answers
      }
    } catch { /* ignore */ }
    return EMPTY_ANSWERS
  })

  const setAnswer = <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => {
    setAnswers(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('movevoce_quiz_state', JSON.stringify({ answers: next, savedAt: new Date().toISOString() }))
      return next
    })
  }

  const resetAnswers = () => {
    localStorage.removeItem('movevoce_quiz_state')
    setAnswers(EMPTY_ANSWERS)
  }

  const computeMetrics = () => {
    setAnswers(prev => {
      const { biologicalSex, weight, height, age, workStyle, mainGoal } = prev
      if (!weight || !height || !age) return prev
      const imc     = calcIMC(weight, height)
      const imcInfo = getIMCLabel(imc)
      const tmb     = calcTMB(biologicalSex, weight, height, age)
      const tdee    = calcTDEE(tmb, workStyle)
      const tdeeAdj = adjustTDEEByGoal(tdee, mainGoal)
      const macros  = calcMacros(tdeeAdj, mainGoal, weight)
      const next    = {
        ...prev, imc, imcLabel: imcInfo.label, tmb, tdee, tdeeAdjusted: tdeeAdj,
        proteinG: macros.protein, carbsG: macros.carbs, fatG: macros.fat,
      }
      localStorage.setItem('movevoce_quiz_state', JSON.stringify({ answers: next, savedAt: new Date().toISOString() }))
      return next
    })
  }

  return (
    <QuestionnaireContext.Provider value={{ answers, setAnswer, resetAnswers, computeMetrics }}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext)
  if (!ctx) throw new Error('useQuestionnaire must be used inside QuestionnaireProvider')
  return ctx
}
