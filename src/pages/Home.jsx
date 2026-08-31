import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroBackground from '../components/HeroBackground'
import Showcase from '../components/Showcase'
import ProjectGrid from '../components/ProjectGrid'
import SocialLinks from '../components/SocialLinks'
import { useLang } from '../i18n/useLang'

export default function Home() {
  const { t, lang } = useLang()
 
  return (
    <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Hero */}
      <section className="relative min-h-[88vh] grid place-items-center overflow-hidden">
        <HeroBackground />
        <div className="relative mx-auto max-w-[1200px] px-6 text-center pt-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand text-xs uppercase tracking-[0.35em] mb-6"
          >
            {t('hero.kicker')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
          >
            {t('hero.title.a')}
            <span className="text-brand">{t('hero.title.b')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-mist-dim text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            {t('hero.sub.1')}
            <br className="hidden md:block" />
            {t('hero.sub.2')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#showcase"
              className="rounded-xl bg-brand text-ink font-semibold px-8 py-3.5 text-sm
                hover:bg-brand-dim hover:-translate-y-0.5 transition-all duration-240 ease-out"
            >
              {t('hero.cta.primary')}
            </a>
            <Link
              to="/about"
              className="glass rounded-xl px-8 py-3.5 text-sm text-mist
                hover:border-brand/40 hover:text-brand hover:-translate-y-0.5 transition-all duration-240 ease-out"
            >
              {t('hero.cta.secondary')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Flagship product showcase */}
      <div id="showcase" className="mt-24 md:mt-32">
        <Showcase />
      </div>

      {/* Project grid */}
      <div className="mt-24 md:mt-32">
        <ProjectGrid />
      </div>

      {/* Socials */}
      <section className="mx-auto max-w-[1200px] px-6 mt-24 md:mt-32 text-center">
        <header className="mb-12">
          <p className="text-brand text-xs uppercase tracking-[0.3em] mb-3">{t('socials.kicker')}</p>
          <h2 className="text-3xl md:text-4xl font-semibold">{t('socials.title')}</h2>
        </header>
        <SocialLinks centered />
      </section>
    </motion.div>
  )
}
