const socialPlatforms = [
  {
    name: 'Discord',
    href: 'https://discord.com/users/themixo_101',
    display: 'themixo_101',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@themixo_101',
    display: '@themixo_101',
  },
]

function Socials({ lang }) {
  const t = lang === 'zh'
    ? {
        tag: '社交媒体',
        title: '关于 theMixo 0x539',
        subtitle: '我们专注于为专业游戏玩家提供服务。',
        pending: '点击访问',
      }
    : {
        tag: 'Social Channels',
        title: 'About theMixo 0x539',
        subtitle: 'We focus on providing services to professional gamers.',
        pending: 'Open link',
      }

  return (
    <section className="section-gap">
      <div className="container-shell content-stack-loose">
        <div className="content-stack">
          <p className="hero-tag">{t.tag}</p>
          <h1 className="section-title">{t.title}</h1>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        <div className="social-grid">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              className="surface-card social-card"
              target="_blank"
              rel="noreferrer"
            >
              <h3>{platform.name}</h3>
              <p>{platform.display} · {t.pending}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Socials
