import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const reviews = [
  {
    text: '"A interface é impecável e os treinos são realmente desafiadores. Sinto que estou em uma revista de fitness de luxo."',
    name: 'Ricardo Santos',
    tier: 'Atleta Gold+',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-cF8aMYNOGOriYT7y05NlhZG7EAR9fgJlspFVUtMg3lAsNez0iXPAVrSc9MkuKDSgX2F5kuWUEIcXZ0EhbNgFWZBRFg9v2MJJSa4-haXo-ZTywYFcd5YF9nWAIceLnLBfxQ1kz7iZXAwkjR2NPXqAmuzCxUqrniWnnyhDuIcHVQTNyndTw50QoI7gFay9WDsORAUHZZrNI5xvtWBsbj8ZbYL1njA_nOPo6X1H7LxK2m2fQheeaX6Ftmu8qfLBsf7ULi9_mWDsZkj',
    glass: true,
  },
  {
    text: '"O suporte e a comunidade são o diferencial. Você não se sente sozinho na jornada, a plataforma te empurra pra frente."',
    name: 'Juliana Mendes',
    tier: 'Atleta Gold',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3KtC-UmAQnTCwYv2iCnP_mGBw8KK1budfqo9rh5qBaVDpVU50HDCNUcyU2C-yvCbjrfjQGNGrKJV_kdJCoMlYkY48f3xeN3krDnTwVf0dYZSqd_aKkETVPvY1gfvHvhLW58-NzpgCLtBp4byb0gu6F6YAuSkhFNt7EtH5Wjbdek4S3bmtWfaEzEKmK4fh-Yb5eXOgpORNaFk5-w52XcGsbrEE3-PbLvIBxBellASsfctWrlgH8OjoR4cYS7QS8or4KenVcCljvNpC',
    glass: false,
  },
  {
    text: '"Troquei minha academia convencional pelo Move Você. Treinar em casa com essa qualidade visual mudou meu jogo."',
    name: 'Marcus Oliveira',
    tier: 'Atleta Gold+',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP_1eBQjHQMn6A7Ov2vlZmQ4Acx5A8BOCyxkQBnx74zWopaE4G3oPv2hfZbKFqBRvpz9Yv68SB8dGhs-8CFrSL7niVZt-kAkKaTJ60ejRM2WO2rKdyzugYcp7pj6yuusji85dufTamT36heKVhNJHZXA_twjlSyPnr7swogkkV4AuFgwoP9ZacEetXENHnf5PgpYv2oPvKjIqKKy8a3jlZtXRqGqSIxhFyDdsQkCoOcAVIVLBua5jV-A6fhJwwpF1t5huPuSeO8UvX',
    glass: true,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' } }),
}

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, var(--color-background) 30%, rgba(19,19,19,0.65) 70%, transparent)' }} />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2oQnMyzslQO5GWyXVXqaAVzrcUys6AUcl_INhUPsEQQf1wXfqTds3XR_cOHSXYdiWRuY-QGX0s1aXBJZUBdH-SCkZi0h9BL0k5Py0oHKI9zYkJiaGmPao8jcUnsZM4TkMg140a76VoaruZsVKIKfMsjq0mUs3szoPh1FkLlGNfBZE8UCKzvL9FxvZLHDmGY_6QS21-5q7uPzB54SBbCA0nQ5GAkGBZ0u7eXbGCpBfZQJJnD4vyfNcSlOTIjFWpw0An52sfhohVBPS"
              alt="Athlete performing deadlift"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 py-24">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-container-highest)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF3340' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Performance Editorial
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}
              >
                REDEFINA <br />
                <span style={{ color: '#EF3340' }}>SEU LIMITE.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl max-w-lg font-light leading-relaxed"
                style={{ color: 'rgba(165,161,160,1)' }}
              >
                Acesse a metodologia exclusiva que une ciência esportiva e estética de alta performance. O treino que você merece, com a sofisticação que você exige.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link
                  to="/form"
                  className="px-10 py-5 rounded-lg font-black text-lg flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-95"
                  style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff' }}
                >
                  COMEÇAR AGORA
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <a
                  href="#planos"
                  className="px-10 py-5 rounded-lg font-black text-lg flex items-center justify-center gap-3 transition-all"
                  style={{ fontFamily: 'var(--font-headline)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-on-surface)' }}
                >
                  VER PLANOS
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-6 pt-8 max-w-sm"
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div>
                  <div className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>15K+</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>Atletas Ativos</div>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>4.9/5</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>Avaliação Média</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="py-24 px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-headline)' }}>
                  REAIS <span style={{ color: '#EF3340' }}>RESULTADOS.</span>
                </h2>
                <p style={{ color: 'rgba(165,161,160,1)', maxWidth: '28rem' }}>
                  Depoimentos de quem transformou não apenas o corpo, mas o lifestyle através do Move Você.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-4 rounded-full transition-all hover:scale-105" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-on-surface)' }}>
                  <span className="material-symbols-outlined">west</span>
                </button>
                <button className="p-4 rounded-full transition-all hover:brightness-110" style={{ backgroundColor: '#EF3340', color: '#fff' }}>
                  <span className="material-symbols-outlined">east</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`p-8 rounded-xl flex flex-col justify-between min-h-[300px] ${r.glass ? 'glass-card' : ''}`}
                  style={r.glass ? { border: '1px solid rgba(255,255,255,0.05)' } : { backgroundColor: 'var(--color-surface-container-low)' }}
                >
                  <div>
                    <div className="flex gap-1 mb-6" style={{ color: '#EF3340' }}>
                      {[...Array(5)].map((_, s) => <span key={s} className="material-symbols-outlined icon-filled">star</span>)}
                    </div>
                    <p className="text-lg font-medium italic" style={{ color: 'var(--color-on-surface)' }}>{r.text}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-8">
                    <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-tight" style={{ color: 'var(--color-on-surface)' }}>{r.name}</h4>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#EF3340' }}>{r.tier}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="planos" className="py-24 px-6" style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                ESCOLHA SUA <span style={{ color: '#EF3340' }}>EVOLUÇÃO.</span>
              </h2>
              <p style={{ color: 'rgba(165,161,160,1)', maxWidth: '42rem', margin: '0 auto' }}>
                Planos flexíveis para quem busca performance editorial e resultados comprovados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Gold */}
              <motion.div
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="rounded-2xl p-10 flex flex-col transition-all group"
                style={{ backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-black italic mb-2 tracking-tight uppercase" style={{ fontFamily: 'var(--font-headline)' }}>GOLD</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-headline)' }}>R$ 89,90</span>
                    <span className="uppercase text-xs font-bold tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>/mês</span>
                  </div>
                </div>
                <div className="space-y-6 flex-grow mb-10">
                  {['Acesso a todos os treinos', 'Planilha de dieta básica', 'Suporte via comunidade'].map(f => (
                    <div key={f} className="flex items-center gap-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ color: '#EF3340' }}>check_circle</span>
                      <span className="text-sm font-medium uppercase tracking-tight">{f}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3" style={{ color: 'rgba(120,115,114,1)', textDecoration: 'line-through' }}>
                    <span className="material-symbols-outlined">cancel</span>
                    <span className="text-sm font-medium uppercase tracking-tight">Consultoria 1-on-1</span>
                  </div>
                </div>
                <button className="w-full py-5 rounded-xl font-black uppercase italic tracking-tighter transition-all hover:bg-white/5"
                  style={{ fontFamily: 'var(--font-headline)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-on-surface)' }}>
                  ASSINAR GOLD
                </button>
              </motion.div>

              {/* Gold+ */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="rounded-2xl p-10 flex flex-col relative overflow-hidden group"
                style={{ backgroundColor: 'var(--color-surface-container-high)', border: '2px solid #EF3340' }}
              >
                <div className="absolute top-6 right-6 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest"
                  style={{ backgroundColor: '#EF3340' }}>
                  MAIS VENDIDO
                </div>
                <div className="mb-8">
                  <h3 className="text-3xl font-black italic mb-2 tracking-tight uppercase" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>GOLD+</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-headline)' }}>R$ 149,90</span>
                    <span className="uppercase text-xs font-bold tracking-widest" style={{ color: 'rgba(120,115,114,1)' }}>/mês</span>
                  </div>
                </div>
                <div className="space-y-6 flex-grow mb-10">
                  {['Tudo do Plano Gold', 'Consultoria 1-on-1 Mensal', 'Dietas Personalizadas', 'Conteúdo Exclusivo Premium'].map(f => (
                    <div key={f} className="flex items-center gap-3" style={{ color: 'var(--color-on-surface)' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ color: '#EF3340' }}>check_circle</span>
                      <span className="text-sm font-black uppercase tracking-tight">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full py-5 text-white rounded-xl font-black uppercase italic tracking-tighter transition-all hover:brightness-110 group-hover:scale-[1.02] active:scale-95"
                  style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340' }}
                >
                  ASSINAR GOLD+
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="rounded-3xl p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12"
              style={{ backgroundColor: '#EF3340' }}
            >
              <div className="text-white max-w-xl text-center md:text-left">
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
                  ESTÁ PRONTO PARA <br /> O PRÓXIMO NÍVEL?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', fontWeight: 500 }}>
                  Não perca mais tempo com métodos genéricos. Entre para a elite da performance.
                </p>
              </div>
              <Link
                to="/form"
                className="flex items-center gap-4 px-12 py-6 rounded-xl font-black text-xl uppercase italic tracking-tight transition-all hover:bg-white/90 shadow-2xl"
                style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#fff', color: '#EF3340' }}
              >
                QUERO COMEÇAR
                <span className="material-symbols-outlined">bolt</span>
              </Link>
            </motion.div>
          </div>
          <div className="absolute -bottom-24 -left-24 pointer-events-none select-none uppercase font-black italic"
            style={{ fontSize: '20vw', fontFamily: 'var(--font-headline)', opacity: 0.04 }}>
            PERFORMANCE
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
