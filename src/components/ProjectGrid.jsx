import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenshotFrame from './ScreenshotFrame'
import Lightbox from './Lightbox'
import { projects } from '../data/projects'
import { useLang } from '../i18n/useLang'

// Minimal empty-state illustration for upcoming projects
function EmptyIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="44" height="44" rx="12" stroke="#ffd745" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M32 24v16M24 32h16" stroke="#ffd745" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Small status capsule; 'archived' is muted grey, 'wip' is brand gold
function StatusBadge({ status }) {
  const { t } = useLang()
  const styles =
    status === 'wip'
      ? 'text-brand border-brand/30 bg-brand/10'
      : 'text-mist-dim border-white/10 bg-white/5'
  return (
    <span className={`glass rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${styles}`}>
      {t(`projects.badge.${status}`)}
    </span>
  )
}

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

const cardClass =
  'glass rounded-2xl p-6 flex flex-col gap-5 transition-all duration-240 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'

/**
 * Project grid — status-driven cards, data from src/data/projects.js:
 * 'live'     → full card + docs link button
 * 'archived' → content card, grey badge, no link
 * 'wip'      → content card, gold badge, no link
 * otherwise  → Coming Soon empty-state placeholder
 */
export default function ProjectGrid() {
  const { t, pick } = useLang()
  // Fullscreen cover preview; holds the resolved src of the clicked cover
  const [preview, setPreview] = useState(null)

  return (
    <section className="mx-auto max-w-[1200px] px-6">
      <header className="mb-16">
        <p className="text-brand text-xs uppercase tracking-[0.3em] mb-3">{t('projects.kicker')}</p>
        <h2 className="text-3xl md:text-4xl font-semibold">{t('projects.title')}</h2>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => {
          // Content card shared by live / archived / wip
          if (p.status === 'live' || p.status === 'archived' || p.status === 'wip') {
            const cover = pick(p.src)
            return (
              <motion.article key={i} {...cardMotion} className={cardClass}>
                {/* Cover click opens the lightbox; empty covers stay inert.
                    Click handler sits on the wrapper above the skeleton. */}
                {cover ? (
                  <div onClick={() => setPreview(cover)} className="cursor-zoom-in">
                    <ScreenshotFrame src={cover} alt={pick(p.title)} />
                  </div>
                ) : (
                  <ScreenshotFrame src={cover} alt={pick(p.title)} />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-semibold">{pick(p.title)}</h3>
                    {p.status !== 'live' && <StatusBadge status={p.status} />}
                  </div>
                  <p className="text-brand text-xs mt-1 mb-3">{pick(p.subtitle)}</p>
                  <p className="text-mist-dim text-sm leading-relaxed">{pick(p.description)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-mist-dim">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Only live projects link to the docs */}
                {p.status === 'live' && p.link && (
                  <Link
                    to={p.link}
                    className="mt-auto inline-flex items-center justify-center rounded-xl bg-brand/15 border border-brand/30
                      text-brand text-sm py-2.5 hover:bg-brand/25 transition-colors duration-240"
                  >
                    {t('projects.viewDocs')}
                  </Link>
                )}
              </motion.article>
            )
          }

          // Empty-state placeholder card for future/unknown projects
          return (
            <motion.article
              key={i}
              {...cardMotion}
              className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]
                transition-all duration-240 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            >
              <EmptyIllustration />
              <div>
                <h3 className="text-lg font-medium text-mist-dim">{pick(p.title)}</h3>
                <p className="text-xs text-mist-dim opacity-60 mt-1">{t('projects.comingSoon')}</p>
              </div>
              <span className="rounded-full border border-dashed border-white/15 px-4 py-1.5 text-xs text-mist-dim opacity-70">
                {t('projects.preparing')}
              </span>
            </motion.article>
          )
        })}
      </div>

      {/* Fullscreen cover preview */}
      <Lightbox src={preview} onClose={() => setPreview(null)} />
    </section>
  )
}
