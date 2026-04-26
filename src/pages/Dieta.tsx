import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Dieta() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dietPlan, setDietPlan] = useState<any>(null)
  const [meals, setMeals] = useState<any[]>([])
  const [selectedMeal, setSelectedMeal] = useState<any>(null)

  useEffect(() => {
    if (!user?.id) return
    const userId = user.id

    async function fetchData() {
      try {
        setLoading(true)
        // 1. Obter plano de dieta ativo
        const { data: planData } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!planData) {
          setLoading(false)
          return
        }
        setDietPlan(planData)

        // 2. Obter refeições e alimentos
        const { data: mealsData } = await supabase
          .from('diet_meals')
          .select(`
            *,
            meal_food_items (
              id,
              quantity_label,
              calories,
              protein_g,
              carbs_g,
              fat_g,
              notes,
              substitute_food_ids,
              order_in_meal,
              foods (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('diet_plan_id', planData.id)
          .order('order_in_day', { ascending: true })

        if (mealsData) {
          setMeals(mealsData)
        }
      } catch (error) {
        console.error("Erro ao buscar dieta:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const goal = dietPlan?.target_calories || 2000
  const totalKcal = meals.reduce((acc, meal) => acc + (Number(meal.total_calories) || 0), 0)

  const macros = [
    { label: 'Proteína', value: `${dietPlan?.target_protein_g || 0}g` },
    { label: 'Carbo', value: `${dietPlan?.target_carbs_g || 0}g` },
    { label: 'Gordura', value: `${dietPlan?.target_fat_g || 0}g` },
  ]

  const waterTargetL = (dietPlan?.water_target_ml || 2500) / 1000

  // Formatador de tempo (ex: "07:30" ou "07:30:00" -> "07:30")
  const formatTime = (timeStr: string) => {
    if (!timeStr) return ''
    return timeStr.substring(0, 5)
  }

  const getMealIcon = (mealType: string) => {
    const type = mealType?.toLowerCase() || ''
    if (type.includes('breakfast')) return 'coffee'
    if (type.includes('snack')) return 'cookie'
    if (type.includes('lunch') || type.includes('dinner')) return 'restaurant'
    return 'restaurant'
  }

  return (
    <>
      <Navbar />
      <main className="pt-8 pb-32 px-6 max-w-7xl mx-auto">
        {/* Editorial Header */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-black italic leading-none opacity-90" style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(4rem,12vw,9rem)', color: '#EF3340', letterSpacing: '-0.05em' }}>
            DIETA
          </h1>
          <p className="text-lg font-medium mt-2 tracking-widest uppercase" style={{ color: 'var(--color-on-surface-variant)' }}>
            Performance e Nutrição
          </p>
        </motion.section>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#EF3340] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !dietPlan ? (
          <div className="py-20 text-center rounded-3xl" style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50" style={{ color: 'var(--color-on-surface-variant)' }}>restaurant</span>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-headline)' }}>Nenhuma dieta ativa</h2>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>Você ainda não gerou ou não possui um plano de dieta ativo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: summary */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Calorie counter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="p-8 rounded-3xl relative overflow-hidden group"
                style={{ backgroundColor: 'var(--color-surface-container-low)' }}
              >
                <div className="relative z-10">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>Alvo Diário</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-6xl font-black" style={{ fontFamily: 'var(--font-headline)' }}>{Math.round(totalKcal).toLocaleString('pt-BR')}</span>
                    <span className="text-xl font-headline" style={{ color: '#EF3340' }}>kcal</span>
                  </div>
                  <div className="mt-6 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((totalKcal / goal) * 100))}%`, backgroundColor: '#EF3340' }} />
                  </div>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Meta calculada: {goal.toLocaleString('pt-BR')} kcal/dia.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full transition-all duration-500 group-hover:opacity-30"
                  style={{ backgroundColor: 'rgba(239,51,64,0.12)', filter: 'blur(40px)' }} />
              </motion.div>

              {/* Macros grid */}
              <div className="grid grid-cols-3 gap-4">
                {macros.map(m => (
                  <div key={m.label} className="p-5 rounded-2xl flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    <span className="text-[10px] uppercase font-black tracking-tighter mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{m.label}</span>
                    <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Water */}
              <div className="p-6 rounded-2xl flex justify-between items-center" style={{ backgroundColor: 'rgba(44,160,161,0.08)', border: '1px solid rgba(92,63,62,0.2)' }}>
                <div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-tertiary)' }}>
                    <span className="material-symbols-outlined">water_drop</span>
                    <span className="font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Hidratação</span>
                  </div>
                  <p className="text-2xl font-black mt-1" style={{ fontFamily: 'var(--font-headline)' }}>
                    0.0L <span className="text-sm font-normal" style={{ color: 'var(--color-on-surface-variant)' }}>/ {waterTargetL.toFixed(1)}L</span>
                  </p>
                </div>
                <button className="p-3 rounded-xl transition-all active:scale-90" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-on-tertiary-fixed)' }}>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                {[{ icon: 'picture_as_pdf', label: 'Dieta (PDF)' }, { icon: 'shopping_cart', label: 'Compras' }].map(b => (
                  <button
                    key={b.label}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors hover:bg-surface-container"
                    style={{ fontFamily: 'var(--font-headline)', border: '1px solid rgba(92,63,62,0.2)', color: 'var(--color-on-surface)' }}
                  >
                    <span className="material-symbols-outlined text-sm">{b.icon}</span>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: meals */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {meals.length === 0 ? (
                <div className="py-12 text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Nenhuma refeição encontrada para esta dieta.
                </div>
              ) : (
                meals.map((m, i) => {
                  const foodItems = m.meal_food_items || []

                  return (
                    <motion.div
                      key={m.id}
                      onClick={() => setSelectedMeal(m)}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                      className="group rounded-3xl overflow-hidden cursor-pointer hover:ring-1 hover:ring-[#EF3340]/50 transition-all"
                      style={{ backgroundColor: 'var(--color-surface-container)' }}
                    >
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-black uppercase" style={{ color: '#EF3340', letterSpacing: '0.2em' }}>{formatTime(m.scheduled_time)}</span>
                            <h3 className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-headline)' }}>{m.meal_name}</h3>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface)' }}>
                            {Math.round(m.total_calories || 0)} kcal
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {foodItems.map((item: any) => (
                            <span key={item.id} className="text-sm px-4 py-1.5 rounded-full" style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(92,63,62,0.2)' }}>
                              <span className="font-bold opacity-70 mr-1">{item.quantity_label}</span> {item.foods?.name}
                            </span>
                          ))}
                        </div>
                        {m.notes && (
                          <p className="mt-4 text-xs italic opacity-70 border-l-2 pl-2" style={{ borderColor: '#EF3340', color: 'var(--color-on-surface-variant)' }}>
                            {m.notes}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </main>
      <BottomNav />

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedMeal(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl glass-card border border-white/10"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--color-surface-container-high)' }}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 relative">
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white"
                onClick={() => setSelectedMeal(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,51,64,0.15)' }}>
                  <span className="material-symbols-outlined icon-filled text-3xl" style={{ color: '#EF3340' }}>
                    {getMealIcon(selectedMeal.meal_type)}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>
                    {selectedMeal.meal_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span>{formatTime(selectedMeal.scheduled_time)}</span>
                    <span>•</span>
                    <span>{selectedMeal.day_of_week === 'daily' ? 'Todos os dias' : selectedMeal.day_of_week}</span>
                  </div>
                </div>
              </div>

              {selectedMeal.notes && (
                <p className="text-sm italic opacity-80" style={{ color: 'var(--color-on-surface-variant)' }}>
                  "{selectedMeal.notes}"
                </p>
              )}
            </div>

            {/* SubHeader: Macros */}
            <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              {[
                { label: 'Kcal', val: Math.round(selectedMeal.total_calories || 0), color: '#EF3340' },
                { label: 'Prot', val: `${Math.round(selectedMeal.total_protein_g || 0)}g`, color: 'var(--color-on-surface)' },
                { label: 'Carbo', val: `${Math.round(selectedMeal.total_carbs_g || 0)}g`, color: 'var(--color-on-surface)' },
                { label: 'Gord', val: `${Math.round(selectedMeal.total_fat_g || 0)}g`, color: 'var(--color-on-surface)' }
              ].map((m, i) => (
                <div key={i} className="p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70" style={{ color: 'var(--color-on-surface-variant)' }}>{m.label}</span>
                  <span className="text-lg font-black" style={{ fontFamily: 'var(--font-headline)', color: m.color }}>{m.val}</span>
                </div>
              ))}
            </div>

            {/* Grid de Itens */}
            <div className="p-6 md:p-8 overflow-y-auto no-scrollbar flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: '#EF3340' }}>Itens da Refeição</h3>
              <div className="space-y-4">
                {((selectedMeal.meal_food_items || []) as any[])
                  .sort((a, b) => (a.order_in_meal || 0) - (b.order_in_meal || 0))
                  .map((item, index) => (
                    <div key={item.id} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container)' }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-lg">{item.foods?.name}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                          {item.quantity_label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ backgroundColor: 'rgba(239,51,64,0.1)', color: '#EF3340' }}>
                          {Math.round(item.calories || 0)} kcal
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/5 opacity-80">
                          P: {Math.round(item.protein_g || 0)}g
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/5 opacity-80">
                          C: {Math.round(item.carbs_g || 0)}g
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/5 opacity-80">
                          G: {Math.round(item.fat_g || 0)}g
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-sm italic opacity-70 mb-2 border-l-2 pl-2" style={{ borderColor: 'var(--color-surface-container-highest)' }}>
                          "{item.notes}"
                        </p>
                      )}

                      {item.substitute_food_ids && item.substitute_food_ids.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-amber-500/80">
                            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                            {item.substitute_food_ids.length} opção(ões) de substituição
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                {(!selectedMeal.meal_food_items || selectedMeal.meal_food_items.length === 0) && (
                  <p className="text-center opacity-50 text-sm py-4">Nenhum item cadastrado.</p>
                )}
              </div>
            </div>

            {/* Footer space */}
            <div className="p-4 border-t border-white/5 text-center text-[10px] font-medium uppercase tracking-widest opacity-40">
              Mantenha o foco. Cada refeição conta.
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

