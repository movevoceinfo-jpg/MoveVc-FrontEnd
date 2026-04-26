import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/treino', label: 'Treino' },
  { to: '/dieta', label: 'Dieta' },
  { to: '/perfil', label: 'Perfil' },
]

interface NavbarProps {
  minimal?: boolean
}

export default function Navbar({ minimal = false }: NavbarProps) {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-2" style={{ color: '#EF3340', fontFamily: 'var(--font-headline)' }}>
          Move Você
        </Link>

        {/* Desktop nav */}
        {!minimal && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => {
              const active = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className="font-bold tracking-tight transition-colors"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    color: active ? '#EF3340' : 'var(--color-on-surface-variant)',
                    borderBottom: active ? '2px solid #EF3340' : '2px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {!session ? (
            <>
              <Link
                to="/login"
                className="hidden lg:block font-bold text-sm transition-colors px-3 py-1.5"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface-variant)' }}
              >
                Entrar
              </Link>
              <Link
                to="/form"
                className="font-bold text-sm px-5 py-2 rounded-lg transition-all hover:brightness-110 active:scale-95"
                style={{ fontFamily: 'var(--font-headline)', backgroundColor: '#EF3340', color: '#fff' }}
              >
                Assinar Agora
              </Link>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              aria-label="Sair"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 border"
              style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface-variant)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            </button>
          )}

          {/* Mobile Hamburger */}
          {!minimal && (
            <button
              className="md:hidden ml-1 w-9 h-9 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {!minimal && menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-4 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--color-surface-container-low)' }}
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="font-bold py-2 transition-colors"
                style={{
                  fontFamily: 'var(--font-headline)',
                  color: pathname === to ? '#EF3340' : 'var(--color-on-surface-variant)',
                }}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

