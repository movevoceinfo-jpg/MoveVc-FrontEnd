import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { session } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/home')
    }
  }, [session, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      navigate('/home')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Glow bg */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(239,51,64,0.07)', filter: 'blur(120px)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full" style={{ background: 'rgba(44,160,161,0.04)', filter: 'blur(100px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          className="w-full max-w-md z-10"
        >
          {/* Brand */}
          <div className="mb-10 text-center">
            <Link to="/" className="font-black italic tracking-tighter uppercase inline-block text-4xl" style={{ fontFamily: 'var(--font-headline)', color: '#EF3340' }}>
              Move Você
            </Link>
            <p className="mt-3 font-light tracking-wide" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface-variant)' }}>
              Sua jornada de performance editorial começa aqui.
            </p>
          </div>

          {/* Card */}
          <div className="p-8 rounded-xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#EF3340' }} />

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--color-on-surface-variant)' }} htmlFor="email">
                  E-mail
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--color-on-surface-variant)' }}>
                    mail
                  </span>
                  <input
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-lg border-none outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-surface-container-highest)',
                      color: 'var(--color-on-surface)',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--color-on-surface-variant)' }} htmlFor="password">
                    Senha
                  </label>
                  <a href="#" className="text-xs font-medium transition-all hover:brightness-125" style={{ color: '#EF3340' }}>
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--color-on-surface-variant)' }}>
                    lock
                  </span>
                  <input
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-lg border-none outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-surface-container-highest)',
                      color: 'var(--color-on-surface)',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold text-lg rounded-lg flex items-center justify-center gap-2 mt-4 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff', boxShadow: '0 8px 24px rgba(239,51,64,0.2)' }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Não possui uma conta?{' '}
                <Link to="/form" className="font-bold hover:underline transition-all" style={{ color: '#EF3340' }}>
                  Criar conta
                </Link>
              </p>
            </div>
          </div>

          {/* Feature chips */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: 'fitness_center', label: 'Treinos', sub: 'Planos Elite' },
              { icon: 'restaurant_menu', label: 'Nutrição', sub: 'Dieta Customizada' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-container-highest)', color: '#EF3340' }}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-tighter" style={{ color: 'rgba(120,115,114,1)' }}>{label}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="w-full py-8 border-t" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: 'rgba(120,115,114,1)', fontFamily: 'var(--font-headline)' }}>
            © 2024 Move Você. Performance Editorial. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {['Termos de Uso', 'Privacidade', 'Suporte'].map(l => (
              <a key={l} href="#" className="text-sm transition-colors" style={{ color: 'rgba(120,115,114,1)' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

