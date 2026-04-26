import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Mock dados do Blog
const blogPosts = [
  {
    id: 1,
    title: 'A Importância do Sono na Hipertrofia',
    category: 'Recuperação',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: '5 Mitos sobre Dietas Low Carb',
    category: 'Nutrição',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Como Evitar Lesões no Treino de Força',
    category: 'Treino',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Hidratação: Quanto de água realmente preciso?',
    category: 'Saúde',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop',
  }
]

export default function Home() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // Treino
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [todayExercises, setTodayExercises] = useState<any[]>([])
  
  // Dieta
  const [dietPlan, setDietPlan] = useState<any>(null)
  const [dietMeals, setDietMeals] = useState<any[]>([])

  useEffect(() => {
    if (!user?.id) return
    const userId = user.id

    async function fetchData() {
      try {
        setLoading(true)
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const todayString = daysOfWeek[new Date().getDay()]

        // Fetch plano de treino ativo
        const { data: wpData } = await supabase
          .from('workout_plans')
          .select('id, name')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (wpData) {
          const { data: dayData } = await supabase
            .from('workout_days')
            .select('*')
            .eq('workout_plan_id', wpData.id)
            .eq('day_of_week', todayString)
            .maybeSingle()

          if (dayData) {
            setTodayWorkout(dayData)
            const { data: exData } = await supabase
              .from('workout_day_exercises')
              .select(`
                id,
                sets,
                reps_label,
                exercises (
                  name
                )
              `)
              .eq('workout_day_id', dayData.id)
              .order('order_in_day', { ascending: true })
            
            if (exData) setTodayExercises(exData)
          }
        }

        // Fetch plano de dieta ativo
        const { data: dpData } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (dpData) {
          setDietPlan(dpData)
          const { data: mData } = await supabase
            .from('diet_meals')
            .select('id, meal_name, total_calories, scheduled_time, meal_type, notes')
            .eq('diet_plan_id', dpData.id)
            .order('order_in_day', { ascending: true })
          
          if (mData) setDietMeals(mData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados da home:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const targetCalories = dietPlan?.target_calories || 0
  const totalDietKcal = dietMeals.reduce((acc, m) => acc + (Number(m.total_calories) || 0), 0)

  const macros = [
    { label: 'Proteína', pct: 0, current: '0g', total: `${dietPlan?.target_protein_g || 0}g`, color: '#EF3340' },
    { label: 'Carbo', pct: 0, current: '0g', total: `${dietPlan?.target_carbs_g || 0}g`, color: 'var(--color-tertiary-container)' },
    { label: 'Gordura', pct: 0, current: '0g', total: `${dietPlan?.target_fat_g || 0}g`, color: 'var(--color-secondary-container)' },
    { label: 'Água', pct: 0, current: '0L', total: `${((dietPlan?.water_target_ml || 0) / 1000).toFixed(1)}L`, color: '#fff' },
  ]

  const getMealIcon = (mealType: string) => {
    const type = mealType?.toLowerCase() || ''
    if (type.includes('breakfast')) return 'coffee'
    if (type.includes('snack')) return 'cookie'
    if (type.includes('lunch') || type.includes('dinner')) return 'restaurant'
    return 'restaurant'
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ''
    return timeStr.substring(0, 5)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 pb-28 md:pb-12">
        {/* Editorial Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full md:w-2/3">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              Performance <span style={{ color: '#EF3340' }}>Editorial</span>
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Seu dashboard central de evolução. Acompanhe seus macronutrientes e sua rotina de treinamento.
            </p>
          </motion.div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link to="/treino" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-on-surface)' }}>
              <span className="material-symbols-outlined" style={{ color: '#EF3340' }}>fitness_center</span>
              <span className="font-bold text-sm uppercase tracking-wider">Treino</span>
            </Link>
            <Link to="/dieta" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-on-surface)' }}>
              <span className="material-symbols-outlined" style={{ color: '#EF3340' }}>restaurant</span>
              <span className="font-bold text-sm uppercase tracking-wider">Dieta</span>
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#EF3340] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Nutrition summary */}
            <motion.section
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-8 p-8 rounded-3xl relative overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '120px' }}>nutrition</span>
              </div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-headline)' }}>Resumo Nutricional</h2>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Meta Diária: {targetCalories.toLocaleString('pt-BR')} kcal
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>
                    {Math.round(totalDietKcal).toLocaleString('pt-BR')}
                  </span>
                  <span className="font-bold text-sm uppercase ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>kcal Planejadas</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
                {macros.map(m => (
                  <div key={m.label} className="p-5 rounded-2xl flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80" style={{ color: 'var(--color-on-surface-variant)' }}>{m.label}</span>
                    <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-headline)', color: m.color }}>
                      {m.total}
                    </span>
                  </div>
                ))}
              </div>

              {/* Meals */}
              <div className="space-y-4 relative z-10">
                {dietMeals.length > 0 ? (
                  dietMeals.map(m => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-5 rounded-2xl transition-all group bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                          <span className="material-symbols-outlined" style={{ color: '#EF3340' }}>{getMealIcon(m.meal_type)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-[#EF3340] tracking-widest">{formatTime(m.scheduled_time)}</span>
                            <h4 className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{m.meal_name}</h4>
                          </div>
                          {m.notes && <p className="text-xs font-medium opacity-70 mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>{m.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black" style={{ fontFamily: 'var(--font-headline)' }}>{Math.round(m.total_calories || 0)} <span className="text-[10px] uppercase">kcal</span></p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm opacity-50 py-4">Nenhuma refeição cadastrada.</p>
                )}
              </div>
            </motion.section>

            {/* Today workout */}
            <motion.section
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-4 rounded-3xl overflow-hidden flex flex-col"
              style={{ border: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'var(--color-surface)' }}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Treino de Hoje</h2>
                
                {todayWorkout ? (
                  <>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuvEKdmzn1d-rwBx0jee1_3vTRLG5b3k5nCMXQq1Z8rNdjSYr68v46yRFRt7ppWHsCGjvqEYigHugG4gO8Z5H-Qzf6ahh1rG8gddIw1TThFl_gOxHRKCoVesEYVROLhwDlHCze76xt_RlFLrAtx5o4BQgko-Mh9mGX58QSswESIxIerow58M0iukDsuz7Rzzx0puKT7CHUMXkUItBXDe_sI2pEjHIdkF480v2KHljQTjDNH2ZtEGoRVySOxDroKqWf1Tz_hwCTgd3P"
                        alt="Treino" className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 60%)' }} />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest italic" style={{ backgroundColor: '#EF3340', color: '#fff' }}>
                          Foco Diário
                        </span>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter mt-1" style={{ fontFamily: 'var(--font-headline)', color: '#fff' }}>
                          {todayWorkout.focus_area || 'Treino do Dia'}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {todayExercises.length > 0 ? (
                        todayExercises.slice(0, 3).map((e: any) => (
                          <div key={e.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(239,51,64,0.1)' }}>
                              <span className="material-symbols-outlined icon-filled text-xl" style={{ color: '#EF3340' }}>fitness_center</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>{e.exercises?.name}</h4>
                              <div className="flex gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                  {e.sets} Séries
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                  {e.reps_label}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm opacity-50 py-2">Nenhum exercício cadastrado.</p>
                      )}
                    </div>

                    {todayExercises.length > 3 && (
                      <p className="text-center text-xs opacity-50 mt-4">+ {todayExercises.length - 3} exercícios no plano completo</p>
                    )}

                    <Link to="/treino" className="block text-center w-full mt-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all hover:bg-white/10"
                      style={{ fontFamily: 'var(--font-headline)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Acessar Treino
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-30">self_improvement</span>
                    <h3 className="text-lg font-bold">Dia de Descanso!</h3>
                    <p className="text-sm opacity-60 mt-1">Você não tem treino agendado para hoje. Aproveite para recuperar.</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        )}

        {/* Blog Carousel */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>Últimos Artigos</h2>
            <button className="text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#EF3340]" style={{ color: 'var(--color-on-surface-variant)' }}>
              Ver Todos
            </button>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: '#EF3340', color: '#fff' }}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {post.readTime}
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-[#EF3340] transition-colors" style={{ fontFamily: 'var(--font-headline)' }}>
                  {post.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
