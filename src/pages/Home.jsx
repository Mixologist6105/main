import { Link } from 'react-router-dom'

function Home({ lang }) {
  const t = lang === 'zh'
    ? {
        title: '智能操控，随心掌控',
        subtitle: '为游戏玩家与高效率爱好者打造的全能键鼠控制工具，高度自定义，强大功能，极致性能。',
        download: '立即下载',
        docs: '查看教程',
        metrics: ['高度自定义', '智能算法', '全局兼容'],
        featureTitle: '功能特性',
        featureSubtitle: '强大功能模块，满足各类使用需求。',
        features: [
          { icon: '◉', title: '实时推理', desc: '高性能算法引擎，实时捕捉，精准响应。' },
          { icon: '◎', title: '精准控制', desc: '多维度算法调节，满足个性化需求。' },
          { icon: '⌘', title: '强大的按键绑定系统', desc: '无限制的按键绑定。' },
          { icon: '↯', title: '扳机系统', desc: 'Trigger 自动化配置，智能触发更高效。' },
          { icon: '◌', title: 'FOV 可视化', desc: '可视化范围调节。' },
          { icon: '⚙', title: '更多设置', desc: '丰富的拓展设置，打造专属配置。' },
        ],
      }
    : {
        title: 'Smarter Control, Effortless Precision',
        subtitle: 'A high-performance control suite for gamers and power users, built for speed, flexibility, and consistency.',
        download: 'Download',
        docs: 'Open Guide',
        metrics: ['Fully Customizable', 'Intelligent Targeting', 'Wide Compatibility'],
        featureTitle: 'Core Features',
        featureSubtitle: 'Advanced modules designed for real gameplay and practical workflows.',
        features: [
          { icon: '◉', title: 'Real-Time Inference', desc: 'Fast AI processing with stable and accurate response.' },
          { icon: '◎', title: 'Precision Tuning', desc: 'Fine-grained controls tailored to your play style.' },
          { icon: '⌘', title: 'Hotkeys Binding', desc: 'Unlimited keybinding.' },
          { icon: '↯', title: 'Advanced Trigger System', desc: 'Smart trigger behaviors for faster, cleaner execution.' },
          { icon: '◌', title: 'FOV Visual Overlay', desc: 'Clear visual range tuning for better field awareness.' },
          { icon: '⚙', title: 'Extended Settings', desc: 'Deep configuration options for custom setups.' },
        ],
      }

  return (
    <>
      <section className="hero-section">
        <div className="container-shell hero-grid">
          <div className="content-stack-loose">
            <p className="hero-tag">MIXOCORE DML</p>
            <h1 className="hero-title">
              {lang === 'zh' ? (
                <>
                  智能操控，
                  <br />
                  随心掌控
                </>
              ) : (
                t.title
              )}
            </h1>
            <p className="hero-subtitle">{t.subtitle}</p>

            <div className="button-row">
              <a
                href="https://1820200195.share.123pan.cn/123pan/01wojv-cXSod"
                className="btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                {t.download}
              </a>
              <Link to="/tutorial" className="btn-ghost">
                {t.docs}
              </Link>
            </div>

            <div className="hero-metrics">
              {t.metrics.map((metric) => (
                <span key={metric} className="hero-metric-chip">
                  {metric}
                </span>
              ))}
            </div>
          </div>

          <div className="preview-frame">
            <img
              src={`${import.meta.env.BASE_URL}ui-preview.png`}
              alt="MIXOCORE UI 预览图"
            />
          </div>
        </div>
      </section>

      <section className="section-gap" id="features">
        <div className="container-shell">
          <div className="content-stack">
            <h2 className="section-title">{t.featureTitle}</h2>
            <p className="section-subtitle">{t.featureSubtitle}</p>
          </div>

          <div className="feature-grid">
            {t.features.map((feature) => (
              <article key={feature.title} className="surface-card feature-card">
                <span className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default Home
