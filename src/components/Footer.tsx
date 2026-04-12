import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <div className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-headline)' }}>
            Move Você
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(165,161,160,1)', fontFamily: 'var(--font-headline)' }}>
            Elevando o fitness ao patamar de editorial de performance. Onde cada movimento conta uma história.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(165,161,160,1)' }}>
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(165,161,160,1)' }}>
              <span className="material-symbols-outlined text-xl">camera</span>
            </a>
          </div>
        </div>

        {/* Plataforma */}
        <div>
          <h5 className="font-bold uppercase text-xs tracking-widest mb-6" style={{ color: 'var(--color-on-surface)' }}>Plataforma</h5>
          <ul className="space-y-4">
            {['Treinos', 'Planos', 'Nutrição'].map(item => (
              <li key={item}>
                <Link to="/home" className="text-sm transition-all inline-block hover:translate-x-1"
                  style={{ color: 'rgba(165,161,160,1)', fontFamily: 'var(--font-headline)' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h5 className="font-bold uppercase text-xs tracking-widest mb-6" style={{ color: 'var(--color-on-surface)' }}>Empresa</h5>
          <ul className="space-y-4">
            {['Suporte', 'Trabalhe Conosco', 'Comunidade'].map(item => (
              <li key={item}>
                <Link to="/" className="text-sm transition-all inline-block hover:translate-x-1"
                  style={{ color: 'rgba(165,161,160,1)', fontFamily: 'var(--font-headline)' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="font-bold uppercase text-xs tracking-widest mb-6" style={{ color: 'var(--color-on-surface)' }}>Legal</h5>
          <ul className="space-y-4">
            {['Termos de Uso', 'Privacidade'].map(item => (
              <li key={item}>
                <Link to="/" className="text-sm transition-all inline-block hover:translate-x-1"
                  style={{ color: 'rgba(165,161,160,1)', fontFamily: 'var(--font-headline)' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-8 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-sm uppercase tracking-widest" style={{ color: 'rgba(120,115,114,1)', fontFamily: 'var(--font-headline)', letterSpacing: '0.2em' }}>
          © 2024 Move Você. Performance Editorial. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
