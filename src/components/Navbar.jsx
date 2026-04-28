import { NavLink } from 'react-router-dom'
import LogoIcon from './LogoIcon'

function Navbar({ lang, onLangChange }) {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const t = lang === 'zh'
    ? {
        features: '功能特性',
        docs: '文档',
        about: '关于我们',
        download: '立即下载',
      }
    : {
        features: 'Features',
        docs: 'Documentation',
        about: 'About Us',
        download: 'Download',
      }

  return (
    <header className="site-nav-wrap">
      <div className="container-shell site-nav">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <LogoIcon className="brand-mark-icon" />
          </span>
          <div>
            <p className="brand-title text-backslash">MIXOCORE</p>
            <p className="brand-subtitle">DML</p>
          </div>
        </NavLink>

        <nav className="nav-links">
          <a href={`${baseUrl}#features`} className="nav-link">
            {t.features}
          </a>
          <NavLink to="/tutorial" className="nav-link">
            {t.docs}
          </NavLink>
          <NavLink to="/socials" className="nav-link">
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
        </div>
      </div>
    </header>
  )
}

export default Navbar
