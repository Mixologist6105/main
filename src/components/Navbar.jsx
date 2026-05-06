import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import LogoIcon from './LogoIcon'

const COMPACT_MQ = '(max-width: 1024px)'

function Navbar({ lang, onLangChange }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MQ)
    const apply = () => {
      setIsCompact(mq.matches)
      if (!mq.matches) setMenuOpen(false)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!isCompact || !menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isCompact, menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((o) => !o)

  const t = lang === 'zh'
    ? {
        home: '首页',
        docs: '文档',
        about: '关于我们',
        download: '立即购买',
        openMenu: '打开导航菜单',
        closeMenu: '关闭导航菜单',
      }
    : {
        home: 'Home',
        docs: 'Documentation',
        about: 'About Us',
        download: 'Buy now',
        openMenu: 'Open navigation menu',
        closeMenu: 'Close navigation menu',
      }

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`

  return (
    <header className="site-nav-wrap">
      {menuOpen && isCompact && (
        <div
          className="site-nav-backdrop"
          aria-hidden
          onClick={closeMenu}
        />
      )}

      <div className="container-shell site-nav">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <LogoIcon className="brand-mark-icon" />
          </span>
          <div>
            <p className="brand-title text-backslash">MIXOCORE</p>
            <p className="brand-subtitle">DML</p>
          </div>
        </NavLink>

        <nav
          id="primary-nav"
          className={`nav-links ${menuOpen ? 'is-open' : ''}`}
          inert={isCompact && !menuOpen ? true : undefined}
          aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}
        >
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            {t.home}
          </NavLink>
          <NavLink to="/tutorial" className={linkClass} onClick={closeMenu}>
            {t.docs}
          </NavLink>
          <NavLink to="/socials" className={linkClass} onClick={closeMenu}>
            {t.about}
          </NavLink>
        </nav>

        <div className="nav-actions">
          <div className="site-lang-toggle">
            <button
              type="button"
              className={`site-lang-btn ${lang === 'zh' ? 'is-active' : ''}`}
              onClick={() => onLangChange('zh')}
            >
              中文
            </button>
            <button
              type="button"
              className={`site-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => onLangChange('en')}
            >
              EN
            </button>
          </div>
          <a
            href="https://1820200195.share.123pan.cn/123pan/01wojv-cXSod"
            className="download-button"
            target="_blank"
            rel="noreferrer"
          >
            {t.download}
          </a>
          <button
            type="button"
            className={`site-nav-menu-btn ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            onClick={toggleMenu}
          >
            <span className="site-nav-menu-btn-bars" aria-hidden="true">
              <span className="site-nav-menu-btn-bar" />
              <span className="site-nav-menu-btn-bar" />
              <span className="site-nav-menu-btn-bar" />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
