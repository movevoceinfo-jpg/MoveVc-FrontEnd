import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const getDayLabelShort = (dayOfWeek: string) => {
  const map: Record<string, string> = {
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sáb',
    sunday: 'Dom'
  }
  return map[dayOfWeek?.toLowerCase()] || dayOfWeek
}

interface DailyWorkoutProgress {
  date: string;
  completedExercises: string[];
}

export default function Treino() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [workoutDays, setWorkoutDays] = useState<any[]>([])
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [exercises, setExercises] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [activeTimer, setActiveTimer] = useState<number | null>(null)

  useEffect(() => {
    if (activeTimer === null || activeTimer <= 0) return
    const interval = setInterval(() => {
      setActiveTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeTimer])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('movevc_workout_progress')
    if (saved) {
      try {
        const parsed: DailyWorkoutProgress = JSON.parse(saved)
        if (parsed.date === today) {
          setCompletedExercises(parsed.completedExercises)
        } else {
          localStorage.removeItem('movevc_workout_progress')
        }
      } catch (e) {
        console.error('Failed to parse workout progress', e)
      }
    }
  }, [])

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const isCompleted = prev.includes(exerciseId)
      const next = isCompleted
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]

      const today = new Date().toISOString().split('T')[0]
      const progress: DailyWorkoutProgress = {
        date: today,
        completedExercises: next
      }
      localStorage.setItem('movevc_workout_progress', JSON.stringify(progress))
      return next
    })
  }

  useEffect(() => {
    if (!user?.id) return
    const userId = user.id

    async function fetchData() {
      try {
        setLoading(true)
        // Obter o plano ativo do usuário
        const { data: planData } = await supabase
          .from('workout_plans')
          .select('id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!planData) {
          setLoading(false)
          return
        }

        // Obter os dias do plano
        const { data: daysData } = await supabase
          .from('workout_days')
          .select('*')
          .eq('workout_plan_id', planData.id)
          .order('order_in_week', { ascending: true })

        if (daysData && daysData.length > 0) {
          setWorkoutDays(daysData)

          // Tentar encontrar o dia atual (baseado no dia da semana)
          const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          const todayString = daysOfWeek[new Date().getDay()]

          const todayData = daysData.find(d => d.day_of_week === todayString)
          setSelectedDayId(todayData ? todayData.id : daysData[0].id)
        }
      } catch (error) {
        console.error("Erro ao buscar plano de treino:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    if (!selectedDayId) return

    async function fetchExercises() {
      try {
        const { data: exercisesData } = await supabase
          .from('workout_day_exercises')
          .select(`
            id,
            sets,
            reps_label,
            rest_seconds,
            notes,
            order_in_day,
            exercises (
              id,
              name,
              equipment,
              instructions,
              image_url
            )
          `)
          .eq('workout_day_id', selectedDayId)
          .order('order_in_day', { ascending: true })

        if (exercisesData) {
          setExercises(exercisesData)
        }
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error)
      }
    }

    fetchExercises()
  }, [selectedDayId])

  const selectedDayData = workoutDays.find(d => d.id === selectedDayId)

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 pb-32">
        {/* Cabeçalho */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-headline)' }}>
              Seu <span style={{ color: '#EF3340' }}>Treino</span>
            </h1>
            <p className="mt-2 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
              Selecione o dia e acompanhe sua rotina de performance.
            </p>
          </div>
        </motion.section>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#EF3340] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workoutDays.length === 0 ? (
          <div className="py-20 text-center rounded-3xl" style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50" style={{ color: 'var(--color-on-surface-variant)' }}>fitness_center</span>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-headline)' }}>Nenhum plano ativo</h2>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>Você ainda não gerou ou não possui um plano de treino ativo.</p>
          </div>
        ) : (
          <>
            {/* Timeline de Seleção de Dia */}
            <section className="mb-12">
              <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto md:overflow-x-visible pt-2 pb-4 md:pb-0 snap-x scrollbar-hide">
                {workoutDays.map((day, i) => {
                  const isActive = day.id === selectedDayId
                  const isRest = day.is_rest_day

                  return (
                    <motion.div
                      key={day.id}
                      onClick={() => setSelectedDayId(day.id)}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`p-5 rounded-3xl flex flex-col items-center cursor-pointer transition-all shrink-0 w-[140px] md:w-auto snap-center ${isActive ? 'ring-1 scale-105 z-10' : 'hover:bg-white/5 opacity-80'}`}
                      style={{
                        backgroundColor: isActive ? 'var(--color-surface-container)' : 'var(--color-surface-container-low)',
                        border: isActive ? '1px solid rgba(239,51,64,0.4)' : '1px solid rgba(255,255,255,0.04)',
                        ...(isActive ? { boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(239,51,64,0.2)' } : {}),
                      }}
                    >
                      <span className="text-xs font-bold uppercase mb-3" style={{ color: isActive ? '#EF3340' : 'var(--color-on-surface-variant)' }}>
                        {getDayLabelShort(day.day_of_week)}
                      </span>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: isActive ? 'rgba(239,51,64,0.1)' : 'var(--color-surface-container-highest)' }}>
                        <span className="material-symbols-outlined" style={{ color: isActive ? '#EF3340' : 'var(--color-on-surface-variant)' }}>
                          {isRest ? 'self_improvement' : 'fitness_center'}
                        </span>
                      </div>
                      <span className="font-black italic text-center text-xs leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-headline)', color: isRest ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}>
                        {isRest ? 'Descanso' : (day.day_label?.split('—')[1] || day.day_label || 'Treino')}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Lista de Exercícios */}
            <motion.section
              key={selectedDayId}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="rounded-3xl p-6 md:p-10"
              style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>
                    {selectedDayData?.day_label || 'Detalhes do Dia'}
                  </h2>
                  <p className="mt-2 text-sm font-medium uppercase tracking-widest" style={{ color: '#EF3340' }}>
                    {selectedDayData?.is_rest_day ? 'Dia de Recuperação' : `${exercises.length} Exercícios`}
                  </p>
                </div>
              </div>

              {selectedDayData?.is_rest_day ? (
                <div className="py-16 flex flex-col items-center text-center opacity-70">
                  <span className="material-symbols-outlined text-6xl mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>spa</span>
                  <p className="text-xl font-medium" style={{ color: 'var(--color-on-surface)' }}>O descanso faz parte da evolução.</p>
                  <p className="mt-2 max-w-md mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Aproveite este dia para focar na recuperação muscular, hidratação e sono adequado.
                  </p>
                </div>
              ) : exercises.length === 0 ? (
                <div className="py-12 text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Nenhum exercício encontrado para este dia.
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((ex, index) => {
                    const exerciseData = ex.exercises || {}
                    return (
                      <div key={ex.id} className="group relative flex flex-col md:flex-row gap-6 rounded-2xl transition-all hover:bg-white/5 overflow-hidden"
                        style={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid rgba(255,255,255,0.02)' }}>

                        {/* Imagem / Icone - Flush left/top/bottom */}
                        <div
                          className="w-full md:w-32 aspect-[3/4] flex items-center justify-center shrink-0 overflow-hidden cursor-zoom-in"
                          style={{ backgroundColor: 'rgba(239,51,64,0.1)' }}
                          onClick={() => exerciseData.image_url && setPreviewImage(exerciseData.image_url)}
                        >
                          {exerciseData.image_url ? (
                            <img
                              src={exerciseData.image_url}
                              alt={exerciseData.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <span className="material-symbols-outlined icon-filled text-4xl" style={{ color: '#EF3340' }}>fitness_center</span>
                          )}
                        </div>

                        {/* Detalhes do Exercicio - Com padding interno */}
                        <div className="flex-1 p-5 pl-5 md:pl-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/30" style={{ color: '#EF3340' }}>
                              {index + 1}
                            </span>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>
                              {exerciseData.name || 'Exercício Desconhecido'}
                            </h4>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs font-bold uppercase px-3 py-1 rounded-md flex items-center gap-1"
                              style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'var(--color-surface-container)' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>repeat</span>
                              {ex.sets} Séries
                            </span>
                            <span className="text-xs font-bold uppercase px-3 py-1 rounded-md flex items-center gap-1"
                              style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'var(--color-surface-container)' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>123</span>
                              {ex.reps_label || 'Falha'}
                            </span>
                            {ex.rest_seconds && (
                              <button
                                onClick={() => setActiveTimer(ex.rest_seconds)}
                                className="text-xs font-bold uppercase px-3 py-1 rounded-md flex items-center gap-1 transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
                                style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'var(--color-surface-container)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                                {ex.rest_seconds}s
                              </button>
                            )}
                          </div>

                          {exerciseData.instructions && (
                            <div className="mt-3 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                              <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: '#EF3340', display: 'block', marginBottom: '4px' }}>Instruções</span>
                              <p className="leading-relaxed">
                                {exerciseData.instructions}
                              </p>
                            </div>
                          )}

                          {ex.notes && (
                            <p className="mt-3 text-sm italic border-l-2 pl-3" style={{ borderColor: 'rgba(239,51,64,0.3)', color: 'var(--color-on-surface-variant)' }}>
                              "{ex.notes}"
                            </p>
                          )}
                        </div>

                        {/* Botão Concluir */}
                        <div className="shrink-0 p-5 md:p-0 md:pr-5 self-end md:self-center">
                          {(() => {
                            const isCompleted = completedExercises.includes(ex.id);
                            return (
                              <button
                                onClick={() => toggleExercise(ex.id)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isCompleted ? '' : 'hover:bg-[#EF3340] hover:text-white group'}`}
                                style={{
                                  backgroundColor: isCompleted ? '#EF3340' : 'var(--color-surface-container)',
                                  color: isCompleted ? '#fff' : 'var(--color-on-surface-variant)'
                                }}>
                                <span className="material-symbols-outlined text-[24px]">
                                  {isCompleted ? 'check_circle' : 'check'}
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.section>
          </>
        )}
      </main>
      <Footer />
      <BottomNav />

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full aspect-[3/4] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Timer Modal */}
      {activeTimer !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setActiveTimer(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center relative rounded-[3rem] w-64 h-64 shadow-2xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span className="material-symbols-outlined text-4xl mb-2" style={{ color: '#EF3340' }}>timer</span>
            <div className="text-6xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}>
              {Math.floor(activeTimer / 60).toString().padStart(2, '0')}:{(activeTimer % 60).toString().padStart(2, '0')}
            </div>
            {activeTimer === 0 && (
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-[#22C55E] animate-pulse">
                Tempo Esgotado!
              </p>
            )}

            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ color: 'var(--color-on-surface-variant)' }}
              onClick={() => setActiveTimer(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}
