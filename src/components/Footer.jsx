import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="mt-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="glass rounded-2xl px-6 py-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-mist-dim text-sm">
            Braytech <span className="opacity-50">· {t('footer.tagline')}</span>
          </span>
          <div className="flex items-center gap-6 text-xs text-mist-dim">
            <Link to="/" className="hover:text-brand transition-colors">{t('nav.home')}</Link>
            <Link to="/docs" className="hover:text-brand transition-colors">{t('nav.docs')}</Link>
            <Link to="/about" className="hover:text-brand transition-colors">{t('nav.about')}</Link>
          </div>
          <span className="text-xs text-mist-dim opacity-60">
            © {new Date().getFullYear()} Braytech · {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  )
}
