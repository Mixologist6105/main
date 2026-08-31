import { FiGithub, FiMail } from 'react-icons/fi'
import { FaBilibili } from 'react-icons/fa6'
import { socials } from '../data/projects'

const ICONS = {
  github: FiGithub,
  bilibili: FaBilibili,
  email: FiMail,
}

/**
 * Social link chips, shared by the home page social section and /about.
 */
export default function SocialLinks({ centered = false }) {
  return (
    <div className={`flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
      {socials.map((s) => {
        const Icon = ICONS[s.id] ?? FiMail
        return (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl px-5 py-3 flex items-center gap-2.5 text-sm text-mist-dim
              hover:text-brand hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-240 ease-out"
          >
            <Icon size={18} />
            {s.label}
          </a>
        )
      })}
    </div>
  )
}
