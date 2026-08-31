import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { useLang } from '../i18n/useLang'

const NAV_ITEMS = [
  { to: '/', key: 'nav.home' },
  { to: '/docs', key: 'nav.docs' },
  { to: '/about', key: 'nav.about' },
]

function navLinkClass({ isActive }) {
  const base = 'px-4 py-2 rounded-full text-sm transition-colors duration-200'
  return isActive
    ? `${base} text-brand bg-brand/10`
    : `${base} text-mist-dim hover:text-mist hover:bg-white/5`
}

// Capsule segmented switch: 中 | EN, active side highlighted in brand gold
function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center rounded-full border border-white/10 p-0.5 text-xs">
      {[
        { id: 'zh', label: '中' },
        { id: 'en', label: 'EN' },
      ].map((opt) => (
        <button
          key={opt.id}
          onClick={() => setLang(opt.id)}
          aria-pressed={lang === opt.id}
          className={`px-2.5 py-1 rounded-full transition-colors duration-200 ${
            lang === opt.id ? 'bg-brand/15 text-brand' : 'text-mist-dim hover:text-mist'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLang()

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="glass mt-4 rounded-2xl flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <span className="size-8 rounded-lg bg-brand/15 border border-brand/30 grid place-items-center">
              <span className="size-2.5 rounded-full bg-brand transition-transform duration-240 group-hover:scale-125" />
            </span>
            <span className="font-display tracking-wide text-lg text-mist">Braytech</span>
          </Link>

          {/* Desktop links + language switch */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
                {t(item.key)}
              </NavLink>
            ))}
            <span className="mx-2 h-4 w-px bg-white/10" />
            <LangSwitch />
          </div>

          {/* Mobile: language switch + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LangSwitch />
            <button
              className="p-2 rounded-lg text-mist-dim hover:text-mist hover:bg-white/5 transition-colors"
              aria-label={open ? t('nav.menu.close') : t('nav.menu.open')}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown panel */}
        {open && (
          <div className="glass md:hidden mt-2 rounded-2xl p-2 flex flex-col gap-1 fade-in">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm transition-colors ${
                    isActive ? 'text-brand bg-brand/10' : 'text-mist-dim hover:text-mist hover:bg-white/5'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
