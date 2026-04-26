import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'

const history = [
  { icon: 'fitness_center', title: 'Treino de Força • Inferiores', sub: 'Ontem às 18:30 • 45 min' },
  { icon: 'restaurant',     title: 'Dieta Atualizada',             sub: '05 Dez, 2023 • Fase de Cutting' },
]

export default function Perfil() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        <div className="flex flex-col gap-12">
          {/* Profile header */}
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA-D7ViAGVq0rCJoswBcuHVKW5pP2FWxoimWFGpEivdw8v7mg2zoT7idKHuDrDDZvQ1HSeaOD4OlV_3KtU9YmNjmMcrkLEclnCoXalGp_jkCttbnDqPpbpESa3t8mMmtp2PY4g9LDPxPavmqTK9nIRUK07BkdabTDgYhCDO_X7uGAHSsxeudOdoCqQgmlO8TuZGF5r13AkV96_ZgELjcQNqWbahTpN3dHfCnd-AxW5ViQEsHPrsfVzA4KFaXrYHJOaSODXpZ4rkIZ"
                    alt="Profile" className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-lg text-white transition-transform hover:scale-110" style={{ backgroundColor: '#EF3340' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic" style={{ fontFamily: 'var(--font-headline)' }}>
                  Mariana Silva
                </h1>
                <p className="flex items-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined text-sm">mail</span>
                  mariana.performance@email.com
                </p>
              </div>

              <button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(92,63,62,0.2)', color: '#EF3340' }}
              >
                <span className="material-symbols-outlined">settings</span>
                Editar Perfil
              </button>
            </div>
          </motion.section>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left — Plan + History */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* Plano card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-8 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-surface-container-low)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20" style={{ backgroundColor: 'rgba(239,51,64,0.08)', filter: 'blur(80px)' }} />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#EF3340', backgroundColor: 'rgba(239,51,64,0.1)' }}>
                      Assinatura Ativa
                    </span>
                    <h2 className="text-3xl font-black mt-4 tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Plano Gold+</h2>
                    <p className="mt-2 max-w-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                      Acesso ilimitado a todos os programas de treino, planos de dieta personalizados e suporte prioritário com especialistas.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 text-center"
                      style={{ backgroundColor: '#fff', color: '#131313' }}>
                      Alterar Plano
                    </button>
                    <button className="text-sm transition-colors text-center underline underline-offset-4"
                      style={{ color: 'rgba(165,161,160,0.6)' }}>
                      Cancelar Assinatura
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  {[
                    { label: 'Próximo Cobrança', value: '15 Jan, 2024' },
                    { label: 'Valor Mensal',      value: 'R$ 89,90' },
                    { label: 'Método',            value: 'Visa •••• 4242' },
                    { label: 'Membro desde',      value: 'Março 2023' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs uppercase font-bold tracking-tighter" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</p>
                      <p className="text-lg font-bold mt-1" style={{ color: 'var(--color-on-surface)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* History */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                <h3 className="font-bold text-xl px-2" style={{ fontFamily: 'var(--font-headline)' }}>Histórico Recente</h3>
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                  {history.map((h, i) => (
                    <div
                      key={h.title}
                      className={`p-6 flex items-center justify-between transition-all group cursor-pointer hover:bg-white/5 ${i > 0 ? 'border-t' : ''}`}
                      style={i > 0 ? { borderColor: 'rgba(255,255,255,0.04)' } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-container-highest)', color: '#EF3340' }}>
                          <span className="material-symbols-outlined">{h.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{h.title}</h4>
                          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{h.sub}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right sidebar */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Bio dados */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid rgba(92,63,62,0.1)' }}
              >
                <h3 className="font-bold text-lg mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Bio-Dados</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Peso Atual', value: '68.5 kg', red: false },
                    { label: 'Altura',     value: '1.72 m',  red: false },
                    { label: 'Meta',       value: 'Hipertrofia', red: true },
                  ].map(({ label, value, red }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</span>
                      <span className="font-bold" style={{ color: red ? '#EF3340' : 'var(--color-on-surface)' }}>{value}</span>
                    </div>
                  ))}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    <div className="h-full w-[75%]" style={{ backgroundColor: '#EF3340' }} />
                  </div>
                  <p className="text-xs text-center" style={{ color: 'var(--color-on-surface-variant)' }}>75% da meta mensal atingida</p>
                </div>
              </motion.div>

              {/* Preferências */}
              <div className="p-6 rounded-xl flex flex-col gap-4" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>Preferências</h3>
                <div className="flex flex-wrap gap-2">
                  {['Notificações Push', 'Modo Escuro'].map(p => (
                    <span key={p} className="px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface)' }}>
                      {p}
                    </span>
                  ))}
                  <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ color: '#EF3340', backgroundColor: 'rgba(239,51,64,0.15)', border: '1px solid rgba(239,51,64,0.3)' }}>
                    Privacidade Alta
                  </span>
                </div>
              </div>

              {/* Club card */}
              <div className="p-6 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #EF3340 0%, #930019 100%)' }}>
                <span className="material-symbols-outlined mb-4 block">military_tech</span>
                <h4 className="font-black text-xl leading-tight uppercase italic mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                  Clube de Performance
                </h4>
                <p className="text-sm mb-4" style={{ opacity: 0.8 }}>
                  Você está entre o top 5% dos usuários mais ativos deste mês. Continue assim!
                </p>
                <button className="w-full py-2 rounded-lg text-sm font-bold transition-all hover:bg-white/30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                  Ver Conquistas
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}

