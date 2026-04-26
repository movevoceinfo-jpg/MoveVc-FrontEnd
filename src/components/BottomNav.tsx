import { Link, useLocation } from 'react-router-dom'

const items = [
  { to: '/home', icon: 'dashboard', label: 'Home' },
  { to: '/treino', icon: 'fitness_center', label: 'Treino' },
  { to: '/dieta', icon: 'restaurant', label: 'Dieta' },
  { to: '/perfil', icon: 'account_circle', label: 'Perfil' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 rounded-t-2xl glass-card border-t shadow-[0_-4px_24px_rgba(0,0,0,0.1)]"
      style={{
        borderTopColor: 'var(--color-outline-variant)'
      }}
    >
      {items.map(({ to, icon, label }) => {
        const active = pathname === to
        return (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center justify-center gap-0.5 transition-all"
            style={{ color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}
          >
            {active ? (
              <span
                className="px-4 py-1 rounded-xl flex flex-col items-center gap-0.5"
                style={{ backgroundColor: 'rgba(239,51,64,0.1)' }}
              >
                <span className="material-symbols-outlined icon-filled">{icon}</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </span>
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined">{icon}</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </span>
              </>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
