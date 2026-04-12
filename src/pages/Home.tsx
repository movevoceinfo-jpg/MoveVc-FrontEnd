import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'

const days = [
  { label: 'Seg', name: 'Legs',  pct: 80,  active: false },
  { label: 'Ter', name: 'Push',  pct: 65,  active: false },
  { label: 'Qua', name: 'Rest',  pct: 0,   active: false, rest: true },
  { label: 'Qui', name: 'Pull',  pct: 90,  active: false },
  { label: 'Sex', name: 'Legs',  pct: 75,  active: false },
  { label: 'Sáb', name: 'Push',  pct: 40,  active: true },
  { label: 'Dom', name: 'Rest',  pct: 0,   active: false, rest: true, faded: true },
]

const meals = [
  { icon: 'coffee',         name: 'Café da Manhã', desc: 'Ovos mexidos, abacate, torrada integral', kcal: 450,  done: true },
  { icon: 'restaurant',     name: 'Almoço',        desc: 'Frango grelhado, batata doce, brócolis', kcal: 680,  done: true },
  { icon: 'dinner_dining',  name: 'Jantar',        desc: 'Salmão, quinoa, mix de folhas',           kcal: null, done: false },
]

const exercises = [
  { name: 'Supino Reto (Barra)',   sets: '4 Séries', reps: '10-12 Reps' },
  { name: 'Crucifixo Inclinado',   sets: '3 Séries', reps: '15 Reps' },
  { name: 'Paralelas',             sets: '3 Séries', reps: 'Até a Falha' },
]

const macros = [
  { label: 'Proteína', pct: 65, current: '142g', total: '220g', color: '#EF3340' },
  { label: 'Carbo',    pct: 40, current: '110g', total: '350g', color: 'var(--color-tertiary-container)' },
  { label: 'Gordura',  pct: 25, current: '22g',  total: '85g',  color: 'var(--color-secondary-container)' },
  { label: 'Água',     pct: 80, current: '3.2L', total: '4L',   color: '#fff' },
]

export default function Home() {
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
              Seu dashboard central de evolução. Acompanhe seus macronutrientes e sua rotina de treinamento avançado.
            </p>
          </motion.div>

          <div className="flex gap-3 w-full md:w-auto">
            {['Treino (PDF)', 'Dieta (PDF)'].map(label => (
              <button
                key={label}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-on-surface)' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#EF3340' }}>picture_as_pdf</span>
                <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Main grid */}
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

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-headline)' }}>Resumo Nutricional</h2>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>Meta Diária: 2.800 kcal</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>1.940</span>
                <span className="font-bold text-sm uppercase ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>kcal Restantes</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {macros.map(m => (
                <div key={m.label} className="p-4 rounded-2xl flex flex-col items-center" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                  <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>{m.label}</span>
                  <div className="w-full h-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                  </div>
                  <span className="font-black text-lg" style={{ fontFamily: 'var(--font-headline)' }}>
                    {m.current} <span className="text-xs font-normal" style={{ color: 'var(--color-on-surface-variant)' }}>/ {m.total}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="space-y-4">
              {meals.map(m => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-5 rounded-2xl transition-all group"
                  style={{
                    backgroundColor: m.done ? 'rgba(255,255,255,0.04)' : 'transparent',
                    border: m.done ? 'none' : '1px dashed rgba(255,255,255,0.08)',
                    opacity: m.done ? 1 : 0.65,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                      <span className="material-symbols-outlined" style={{ color: '#EF3340' }}>{m.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{m.name}</h4>
                      <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>{m.desc}</p>
                    </div>
                  </div>
                  {m.done ? (
                    <div className="text-right">
                      <p className="font-black" style={{ fontFamily: 'var(--font-headline)' }}>{m.kcal} <span className="text-[10px] uppercase">kcal</span></p>
                      <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full"
                        style={{ color: '#EF3340', backgroundColor: 'rgba(239,51,64,0.15)' }}>Realizado</span>
                    </div>
                  ) : (
                    <button className="p-2 rounded-lg text-white" style={{ backgroundColor: '#EF3340' }}>
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Next workout */}
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-4 rounded-3xl overflow-hidden flex flex-col"
            style={{ border: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'var(--color-surface)' }}
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Próximo Treino</h2>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuvEKdmzn1d-rwBx0jee1_3vTRLG5b3k5nCMXQq1Z8rNdjSYr68v46yRFRt7ppWHsCGjvqEYigHugG4gO8Z5H-Qzf6ahh1rG8gddIw1TThFl_gOxHRKCoVesEYVROLhwDlHCze76xt_RlFLrAtx5o4BQgko-Mh9mGX58QSswESIxIerow58M0iukDsuz7Rzzx0puKT7CHUMXkUItBXDe_sI2pEjHIdkF480v2KHljQTjDNH2ZtEGoRVySOxDroKqWf1Tz_hwCTgd3P"
                  alt="Treino" className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 60%)' }} />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest italic" style={{ backgroundColor: '#EF3340', color: '#fff' }}>Pops &amp; Power</span>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter mt-1" style={{ fontFamily: 'var(--font-headline)', color: '#fff' }}>Peitorais &amp; Tríceps</h3>
                </div>
              </div>

              <div className="space-y-4">
                {exercises.map(e => (
                  <div key={e.name} className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239,51,64,0.1)' }}>
                      <span className="material-symbols-outlined icon-filled text-xl" style={{ color: '#EF3340' }}>fitness_center</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>{e.name}</h4>
                      <div className="flex gap-2 mt-1">
                        {[e.sets, e.reps].map(chip => (
                          <span key={chip} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                            style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'rgba(255,255,255,0.05)' }}>{chip}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all hover:bg-white/10"
                style={{ fontFamily: 'var(--font-headline)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Ver Plano Completo
              </button>
            </div>
          </motion.section>
        </div>

        {/* Performance Timeline */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>Timeline de Performance</h2>
            <span className="text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full" style={{ color: '#EF3340', backgroundColor: 'rgba(239,51,64,0.1)' }}>
              Últimos 7 Dias
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`p-6 rounded-3xl flex flex-col items-center cursor-pointer transition-all ${d.active ? 'ring-1' : 'hover:border-opacity-50'}`}
                style={{
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: d.active ? '1px solid rgba(239,51,64,0.4)' : '1px solid rgba(255,255,255,0.04)',
                  opacity: d.faded ? 0.4 : 1,
                  ...(d.active ? { boxShadow: '0 0 0 1px rgba(239,51,64,0.2)' } : {}),
                }}
              >
                <span className="text-xs font-bold uppercase mb-4" style={{ color: d.active ? '#EF3340' : 'var(--color-on-surface-variant)' }}>{d.label}</span>
                <div className="w-2 h-24 rounded-full relative overflow-hidden mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="absolute bottom-0 left-0 w-full rounded-full" style={{ height: `${d.pct}%`, backgroundColor: d.rest ? 'rgba(255,255,255,0.15)' : '#EF3340' }} />
                </div>
                <span className="font-black italic" style={{ fontFamily: 'var(--font-headline)', color: d.rest ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}>
                  {d.name}
                </span>
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
