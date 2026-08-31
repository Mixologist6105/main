import { motion } from 'framer-motion'
import SocialLinks from '../components/SocialLinks'
import { useLang } from '../i18n/useLang'
 
const TECH_STACK = ['C#', 'Python', 'React', 'Lua', 'Win x64']

export default function About() {
  const { t, lang } = useLang()

  const cardMotion = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, ease: 'easeOut' },
  }
 
  return (
    <motion.section
      key={lang}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-40 mx-auto max-w-[1200px] px-6"
    >
      <header className="mb-16">
        <p className="text-brand text-xs uppercase tracking-[0.3em] mb-3">{t('about.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-semibold">{t('about.title')}</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bio */}
        <motion.article
          {...cardMotion}
          className="glass rounded-2xl p-8 md:row-span-2
            transition-all duration-240 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <span className="size-14 rounded-2xl bg-brand/15 border border-brand/30 grid place-items-center mb-6">
            <span className="size-4 rounded-full bg-brand" />
          </span>
          <h2 className="text-xl font-semibold mb-4">{t('about.bio.title')}</h2>
          <div className="text-mist-dim leading-relaxed text-sm flex flex-col gap-4">
            <p>{t('about.bio.p1')}</p>
            <p>{t('about.bio.p2')}</p>
          </div>
        </motion.article>

        {/* Tech stack */}
        <motion.article
          {...cardMotion}
          className="glass rounded-2xl p-8
            transition-all duration-240 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <h2 className="text-xl font-semibold mb-5">{t('about.stack.title')}</h2>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-mist-dim
                  hover:text-brand hover:border-brand/30 transition-colors duration-240"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.article>

        {/* Contact */}
        <motion.article
          {...cardMotion}
          className="glass rounded-2xl p-8
            transition-all duration-240 ease-out hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <h2 className="text-xl font-semibold mb-5">{t('about.contact.title')}</h2>
          <SocialLinks />
        </motion.article>
      </div>
    </motion.section>
  )
}
