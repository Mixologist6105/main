import { RiDiscordFill, RiGitRepositoryFill, RiStore2Fill } from 'react-icons/ri'
import LogoIcon from './LogoIcon'

const links = [
  { label: 'Docs', icon: RiGitRepositoryFill, href: 'https://www.yuque.com/themixo/ai' },
  { label: 'Kook', icon: RiDiscordFill, href: 'https://www.kookapp.cn/app/invite/lCo7Gt' },
  { label: 'Store', icon: RiStore2Fill, href: 'https://68n.cn/gtbCl' },
]

function ADeveloperCard() {
  return (
    <div className="adev-card">
      <div className="adev-card-inner">
        <div className="adev-logo-wrap" aria-hidden="true">
          <LogoIcon className="adev-logo" />
        </div>

        <div className="adev-info">
          <div className="adev-brand-chip">MixoCore</div>
          <p className="adev-name">theMixo 0x539</p>
          <p className="adev-location">Canada</p>
        </div>

        <div className="adev-links">
          {links.map((item) => (
            <a
              key={item.label}
              className="adev-link-btn"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <item.icon aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ADeveloperCard
