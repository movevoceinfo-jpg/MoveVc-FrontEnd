import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

const meals = [
  {
    time: '07:30 AM',
    title: 'Café da Manhã',
    kcal: 450,
    chips: ['3 Ovos Mexidos', '1 Fatia Pão Integral', 'Café Preto'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDidlGcZbrlaVyqFTA5kGqVnX0Yzu85JV44nT9H9KZ3C3Q3xZV9ZmzmZF-IQKrg1-3pKnJJ7CFb5knFVQYPQjLDs53qbGBfraAyYa4C9jV57FYoGYY7BQuoafAorolvWr8zijRCpss3S0eSDUHSB3HF1FU-9jGQYJk2nlafDK9RS53MNt0nfnNrr8xIruTuh_vQYHfUADOHouDA_d8AFcYGqN4Sy4WMrtfF9i85HlZl89jJEVKHtt0-Hi19owrEmDKZttRXIwUQZlCc',
  },
  {
    time: '12:30 PM',
    title: 'Almoço',
    kcal: 750,
    chips: ['200g Frango Grelhado', '150g Arroz Integral', 'Brócolis'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCQxyPZT7AQ1QPokSPYQ2XeFmoO6yBukf-qjEvKcsYlOsyPn_1ttHLPT2GxkkOCXjBFczsuHo0AuTWYkMaC6SI0VVa2tRXl-r-Lj19ZhpraRV_LbvWE8yOZO5R4V1NvGSkVXUZmxlfwRYJeLB8LdgHquCXpQUEuft6nfhyCPGa4ApgsXEJdr_8ff2-eOzmg3oHAc5w0hLka_0Noz3iQHKi0zsUllOFQrvwY_OpRIo1TT8WWGnE4B00siSaMoaCG6gK1HVpR03DfOUl',
  },
  {
    time: '04:00 PM',
    title: 'Lanche',
    kcal: 250,
    chips: ['30g Whey Protein', '1 Maçã', '15g Amêndoas'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPj7gLbd_tTHfxHXLxgGOCGpP-ztz6hjacv93Wg_INxc28fq-UgO34li3XJzRfBfMCnVD5azis5HW9MU4QOFQTLtbfKmJP6n3duMq1KAk8J-TbWHyR_uXmuKAEmkjaJ1Sy-V-FazbpWBoZbEwIMFcxpaxeOZ-_yujOmKrU5p-sBW3DmyivJYHdSMpmjq6AtmFWOQ3lJ2zL1GkRqjK7HWrDJ4LqIKE8IwH69d7qUMvRaN4eikor5j2SpfldzTNpunVZDQPvIgzpisrP',
  },
]

export default function Dieta() {
  const totalKcal = meals.reduce((a, m) => a + m.kcal, 0)
  const goal = 2800
  const remaining = goal - totalKcal

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
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>Restantes</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-6xl font-black" style={{ fontFamily: 'var(--font-headline)' }}>{remaining.toLocaleString('pt-BR')}</span>
                  <span className="text-xl font-headline" style={{ color: '#EF3340' }}>kcal</span>
                </div>
                <div className="mt-6 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((totalKcal / goal) * 100)}%`, backgroundColor: '#EF3340' }} />
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Meta: {goal.toLocaleString('pt-BR')} kcal consumidas hoje.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full transition-all duration-500 group-hover:opacity-30"
                style={{ backgroundColor: 'rgba(239,51,64,0.12)', filter: 'blur(40px)' }} />
            </motion.div>

            {/* Macros grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Proteína', value: '180g' },
                { label: 'Carbo',    value: '250g' },
                { label: 'Gordura',  value: '75g' },
              ].map(m => (
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
                  2.5L <span className="text-sm font-normal" style={{ color: 'var(--color-on-surface-variant)' }}>/ 3.5L</span>
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
            {meals.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className="group rounded-3xl overflow-hidden flex flex-col md:flex-row"
                style={{ backgroundColor: 'var(--color-surface-container)' }}
              >
                <div className="md:w-40 relative h-48 md:h-auto">
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-surface-container) 0%, transparent 60%)' }} />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase" style={{ color: '#EF3340', letterSpacing: '0.2em' }}>{m.time}</span>
                      <h3 className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-headline)' }}>{m.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface)' }}>
                      {m.kcal} kcal
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.chips.map(c => (
                      <span key={c} className="text-sm px-4 py-1.5 rounded-full" style={{ color: 'var(--color-on-surface-variant)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(92,63,62,0.2)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
