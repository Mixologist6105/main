import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const viewport = { once: true, margin: '-72px 0px -12% 0px' }

function WorkflowStepLink({ index, isLit, paused, reduceMotion }) {
  const body = (
    <div className="home-step-link-body">
      <div className="home-step-link-track">
        {!reduceMotion && (
          <span
            className="home-step-link-shimmer"
            style={{ animationDelay: `${index * 0.45}s` }}
          />
        )}
      </div>
      <span className="home-step-link-arrow" />
    </div>
  )

  return (
    <div
      className={`home-step-link ${isLit ? 'is-lit' : ''} ${paused ? 'is-paused' : ''} ${reduceMotion ? 'is-static' : ''}`}
      aria-hidden="true"
    >
      {body}
    </div>
  )
}

function WorkflowOutputViz({ lang, reduceMotion, vizActive }) {
  const live = Boolean(vizActive) && !reduceMotion
  return (
    <div className="home-step-output-viz" aria-hidden="true">
      <div className={`home-output-schematic ${live ? 'is-animated' : ''}`}>
        <div className="home-output-col">
          <span className="home-output-screen" />
          <span className="home-output-caption">{lang === 'zh' ? 'MixoCore' : 'MixoCore'}</span>
        </div>
        <div className="home-output-seg">
          <span className="home-output-rail" />
          <span className="home-output-bolt home-output-bolt--a" />
        </div>
        <div className="home-output-col">
          <span className="home-output-hub" />
          <span className="home-output-caption">{lang === 'zh' ? 'Makcu' : 'Makcu'}</span>
        </div>
        <div className="home-output-seg">
          <span className="home-output-rail" />
          <span className="home-output-bolt home-output-bolt--b" />
        </div>
        <div className="home-output-col">
          <span className="home-output-cross">
            <span className="home-output-cross-h" />
            <span className="home-output-cross-v" />
          </span>
          <span className="home-output-caption">{lang === 'zh' ? 'Aim' : 'Aim'}</span>
        </div>
      </div>
      {live && <span className="home-output-scan" />}
    </div>
  )
}

function HomeHeroPreview({ reduceMotion, motionProps }) {
  const frameRef = useRef(null)
  const [pointerInside, setPointerInside] = useState(false)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const tiltTargetRef = useRef({ rx: 0, ry: 0 })
  const rafRef = useRef(0)

  const scheduleTiltFlush = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      setTilt({ ...tiltTargetRef.current })
    })
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (reduceMotion) return
      const el = frameRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5
      const y = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5
      const maxRx = 9
      const maxRy = 12
      tiltTargetRef.current = { rx: -y * 2 * maxRx, ry: x * 2 * maxRy }
      scheduleTiltFlush()
    },
    [reduceMotion, scheduleTiltFlush],
  )

  const onPointerEnter = useCallback(() => {
    if (!reduceMotion) setPointerInside(true)
  }, [reduceMotion])

  const onPointerLeave = useCallback(() => {
    setPointerInside(false)
    tiltTargetRef.current = { rx: 0, ry: 0 }
    setTilt({ rx: 0, ry: 0 })
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [])

  const frameTransformStyle =
    pointerInside && !reduceMotion
      ? {
          transform: `perspective(1050px) rotateX(${6 + tilt.rx}deg) rotateY(${-2.5 + tilt.ry}deg) scale(1.028) translateY(-14px)`,
        }
      : undefined

  return (
    <motion.div className="home-preview" {...motionProps}>
      <div
        ref={frameRef}
        className={`preview-frame home-preview-frame${pointerInside && !reduceMotion ? ' is-preview-pointer' : ''}`}
        style={frameTransformStyle}
        onPointerEnter={reduceMotion ? undefined : onPointerEnter}
        onPointerMove={reduceMotion ? undefined : onPointerMove}
        onPointerLeave={reduceMotion ? undefined : onPointerLeave}
      >
        <div className="home-preview-slot">
          <img src={`${import.meta.env.BASE_URL}ui-preview.png`} alt="MIXOCORE UI 预览图" />
        </div>
      </div>
    </motion.div>
  )
}

function Home({ lang }) {
  const reduceMotion = useReducedMotion()
  const workflowTrackRef = useRef(null)
  const workflowInView = useInView(workflowTrackRef, { amount: 0.32, margin: '-12% 0px -8% 0px' })
  const [flowPhase, setFlowPhase] = useState(0)

  useEffect(() => {
    if (reduceMotion || !workflowInView) {
      setFlowPhase(0)
      return
    }
    const id = window.setInterval(() => {
      setFlowPhase((p) => (p + 1) % 4)
    }, 980)
    return () => window.clearInterval(id)
  }, [reduceMotion, workflowInView])

  const t =
    lang === 'zh'
      ? {
          heroEyebrow: 'MIXOCORE',
          heroLine1: '神经网络瞄准软件',
          heroLine2: '适用于所有游戏',
          title: '智能操控，随心掌控',
          subtitle:
            '为专业游戏玩家与高效率爱好者打造的智能键鼠控制工具，高度自定义功能 / 流畅手感 / 极致性能。',
          download: '立即购买',
          docs: '查看实时教程',
          chips: ['Windows 10+', 'onnxruntime', 'DirectML', 'DXGI / OBS UDP', 'Makcu', '实时推理', '低延迟'],
          featureKicker: '功能特性',
          featureTitle: '深度可配置',
          featureSubtitle: '模块化面板，像桌面软件一样顺手 — 每个选项都有清晰说明。',
          features: [
            {
              tier: '核心',
              title: '实时推理',
              desc: '高性能算法引擎，实时捕捉，精准响应。',
            },
            {
              tier: '核心',
              title: '精准控制',
              desc: '多维度算法调节，满足个性化需求。',
            },
            {
              tier: '核心',
              title: '按键绑定',
              desc: '无限制的按键绑定，组合键与侧键都支持。',
            },
            {
              tier: '扩展',
              title: '扳机系统',
              desc: 'Trigger 自动化配置，智能触发更高效。',
            },
            {
              tier: '扩展',
              title: 'FOV 可视化',
              desc: '可视化范围调节，范围中心可跟随鼠标或屏幕。',
            },
            {
              tier: '扩展',
              title: '更多设置',
              desc: '网络推流、标签编辑、日志与版本信息一站管理。',
            },
          ],
          howKicker: '工作流程',
          howTitle: '简单四步，跑通闭环',
          howSubtitle: '从画面到指令，链路清晰，调参更直觉。',
          steps: [
            { title: '采集画面', desc: 'DXGI 本机截取或 OBS UDP 推流，按场景选择。' },
            { title: '模型推理', desc: '加载模型后开启实时线程，置信度与帧率可独立限制。' },
            { title: '逻辑与平滑', desc: '预测、平滑、FOV 与偏移组合，形成稳定手感。' },
            { title: '输出指令', desc: '通过 Makcu 等外设链路下发移动，低抖动、低延迟。' },
          ],
          statsKicker: '数据',
          statsTitle: '我们持续打磨体验',
          stats: [
            { value: '5+', label: '年迭代方向', sub: '专注控制与交互' },
            { value: '∞', label: '按键绑定', sub: '绑定不受限' },
            { value: '300', label: '默认可调帧上限', sub: '按显卡与场景调节' },
            { value: '24/7', label: '文档与教程', sub: '随产品更新' },
          ],
          faqKicker: '常见问题',
          faqTitle: '安装与兼容',
          faqs: [
            {
              q: '以后会不会发布免费版？',
              a: '未来确实会发布免费版，但没有具体时间，请以实际发行说明为准。',
            },
            {
              q: '支持哪些显卡与系统？',
              a: '推荐 Windows 10 及以上；显卡与驱动版本会影响推理帧率，推荐1080ti及以上，可在面板内限制帧数平衡占用。',
            },
            {
              q: '双机推流怎么接？',
              a: '在截图方式中选择 OBS UDP，并在网络设置里填写主机 IP 与端口，与 OBS 配置保持一致即可。',
            },
            {
              q: '难不难上手？',
              a: '跟随「教程」页逐步完成模型路径、按键与 FOV 配置，大多数用户可在短时间内跑通。',
            },
          ],
          metrics: ['高度自定义', '智能算法', '全局兼容'],
        }
      : {
          heroEyebrow: 'MIXOCORE',
          heroLine1: 'Artificial neural network',
          heroLine2: 'for all games',
          title: 'Artificial neural network, for all games',
          subtitle:
            'A high-performance control suite for professional gamers and power users, built for speed, flexibility, and consistency.',
          download: 'Buy now',
          docs: 'Open Guide',
          chips: ['Windows 10+', 'onnxruntime', 'DirectML', 'DXGI / OBS UDP', 'Makcu', 'Real-time', 'Low latency'],
          featureKicker: 'Features',
          featureTitle: 'Deep customization',
          featureSubtitle:
            'Modular panels that feel like desktop software — every control ships with clear guidance.',
          features: [
            {
              tier: 'Core',
              title: 'Real-Time Inference',
              desc: 'Fast AI processing with stable and accurate response.',
            },
            {
              tier: 'Core',
              title: 'Precision Tuning',
              desc: 'Fine-grained controls tailored to your play style.',
            },
            {
              tier: 'Core',
              title: 'Hotkeys',
              desc: 'Unlimited bindings, including side buttons.',
            },
            {
              tier: 'Plus',
              title: 'Advanced Trigger',
              desc: 'Smart trigger behaviors for faster, cleaner execution.',
            },
            {
              tier: 'Plus',
              title: 'FOV Overlay',
              desc: 'Visual range tuning with screen- or mouse-centered FOV.',
            },
            {
              tier: 'Plus',
              title: 'Extended Settings',
              desc: 'Streaming, labels, logging, and version info in one place.',
            },
          ],
          howKicker: 'How it works',
          howTitle: 'Four steps, end-to-end',
          howSubtitle: 'From capture to output — a clear chain that makes tuning intuitive.',
          steps: [
            { title: 'Capture', desc: 'DXGI locally or OBS UDP streaming — pick what fits your setup.' },
            { title: 'Inference', desc: 'Load a model, enable the realtime thread, tune confidence and FPS.' },
            { title: 'Logic & smooth', desc: 'Prediction, smoothing, FOV, and offsets combine for stable feel.' },
            { title: 'Output', desc: 'Send movement via Makcu-class devices for low-jitter, low-latency paths.' },
          ],
          statsKicker: 'By the numbers',
          statsTitle: 'Built for long-term polish',
          stats: [
            { value: '5+', label: 'Years of focus', sub: 'Control & UX' },
            { value: '∞', label: 'Hotkeys', sub: 'Unlimited bindings' },
            { value: '300', label: 'Default FPS cap', sub: 'Tune to your GPU' },
            { value: '24/7', label: 'Docs & guides', sub: 'Updated with releases' },
          ],
          faqKicker: 'FAQ',
          faqTitle: 'Setup & compatibility',
          faqs: [
            {
              q: 'Will there be a free tier in the future?',
              a: 'Future releases will include a free tier, but no specific timeline; please follow the official release notes.',
            },
            {
              q: 'Which GPUs and OS versions are supported?',
              a: 'Windows 10+ is recommended. Driver and GPU class affect inference FPS — use the FPS limiter to balance utilization. Recommended GPUs: 1080ti or higher.',
            },
            {
              q: 'How do I run a dual-PC streaming setup?',
              a: 'Choose OBS UDP for capture and set the host IP/port in network settings to match your OBS configuration.',
            },
            {
              q: 'Is it hard to get started?',
              a: 'Follow the Tutorial page to configure model paths, hotkeys, and FOV — most users can get a stable loop quickly.',
            },
          ],
          metrics: ['Fully Customizable', 'Intelligent Targeting', 'Wide Compatibility'],
        }

  const fadeUp = reduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport, transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] } }

  const staggerParent = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'show',
        viewport,
        variants: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.06 },
          },
        },
      }

  const staggerChild = reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 18 },
          show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] } },
        },
      }

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="container-shell hero-grid home-hero-grid">
          <motion.div className="content-stack-loose home-hero-copy" {...staggerParent}>
            <motion.p className="brand-title text-backslash home-hero-eyebrow" {...staggerChild}>
              {t.heroEyebrow}
            </motion.p>

            <div className="home-hero-title-block">
              {lang === 'zh' ? (
                <>
                  <motion.h1 className="hero-title home-hero-title" {...staggerChild}>
                    <span className="home-hero-title-line">{t.heroLine1}</span>
                    <span className="home-hero-title-line home-hero-title-accent">{t.heroLine2}</span>
                  </motion.h1>
                </>
              ) : (
                <motion.h1 className="hero-title home-hero-title" {...staggerChild}>
                  <span className="home-hero-title-line">{t.heroLine1}</span>
                  <span className="home-hero-title-line home-hero-title-accent">{t.heroLine2}</span>
                </motion.h1>
              )}
            </div>

            <motion.p className="hero-subtitle home-hero-sub" {...staggerChild}>
              {t.subtitle}
            </motion.p>

            <motion.div className="button-row" {...staggerChild}>
              <a
                href="https://www.qianxun1688.com/links/27F96D6D"
                className="btn-primary home-cta-primary"
                target="_blank"
                rel="noreferrer"
              >
                {t.download}
              </a>
              <Link to="/tutorial" className="btn-ghost home-cta-ghost">
                {t.docs}
              </Link>
            </motion.div>

            <motion.div className="home-chip-row" {...staggerChild} role="list" aria-label={lang === 'zh' ? '亮点标签' : 'Highlights'}>
              {t.chips.map((chip) => (
                <span key={chip} className="home-chip" role="listitem">
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div className="hero-metrics home-hero-metrics" {...staggerChild}>
              {t.metrics.map((metric) => (
                <span key={metric} className="hero-metric-chip">
                  {metric}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <HomeHeroPreview
            reduceMotion={reduceMotion}
            motionProps={
              reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 28 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-10% 0px' },
                    transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] },
                  }
            }
          />
        </div>
      </section>

      <section className="section-gap home-section" id="features">
        <div className="container-shell">
          <motion.div className="home-section-head" {...fadeUp}>
            <p className="home-kicker">{t.featureKicker}</p>
            <h2 className="section-title home-section-title">{t.featureTitle}</h2>
            <p className="section-subtitle home-section-sub">{t.featureSubtitle}</p>
          </motion.div>

          <div className="home-feature-grid">
            {t.features.map((feature, i) => (
              <motion.article
                key={feature.title}
                className="home-feature-card"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 26 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport,
                      transition: { duration: 0.5, delay: Math.min(i * 0.05, 0.25), ease: [0.22, 0.61, 0.36, 1] },
                    })}
              >
                <div className="home-feature-top">
                  <span className="home-feature-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`home-feature-tier ${feature.tier === '扩展' || feature.tier === 'Plus' ? 'is-plus' : ''}`}>
                    {feature.tier}
                  </span>
                </div>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-desc">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap home-section home-section-tint" id="how">
        <div className="container-shell">
          <motion.div className="home-section-head" {...fadeUp}>
            <p className="home-kicker">{t.howKicker}</p>
            <h2 className="section-title home-section-title">{t.howTitle}</h2>
            <p className="section-subtitle home-section-sub">{t.howSubtitle}</p>
          </motion.div>

          <div className="home-step-track" ref={workflowTrackRef}>
            <div className="home-step-grid home-step-grid--linked">
              {t.steps.flatMap((step, i) => {
                const isFinal = i === 3
                const activeHighlight = !reduceMotion && workflowInView && flowPhase === i
                const vizOn = workflowInView && !reduceMotion
                const card = (
                  <motion.div
                    key={`step-${step.title}`}
                    className={`home-step-card ${activeHighlight ? 'is-active-step' : ''} ${isFinal ? 'home-step-card--has-viz' : ''}`}
                    {...(reduceMotion
                      ? {}
                      : {
                          initial: { opacity: 0, y: 20 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport,
                          transition: { duration: 0.48, delay: i * 0.06 },
                        })}
                  >
                    <span className="home-step-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="home-step-title">{step.title}</h3>
                    <p className="home-step-desc">{step.desc}</p>
                    {isFinal && (
                      <WorkflowOutputViz lang={lang} reduceMotion={reduceMotion} vizActive={vizOn} />
                    )}
                  </motion.div>
                )

                if (i >= t.steps.length - 1) return [card]

                const link = (
                  <WorkflowStepLink
                    key={`step-link-${i}`}
                    index={i}
                    isLit={!reduceMotion && workflowInView && flowPhase === i}
                    paused={!workflowInView}
                    reduceMotion={reduceMotion}
                  />
                )

                return [card, link]
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap home-section" id="stats">
        <div className="container-shell">
          <motion.div className="home-section-head" {...fadeUp}>
            <p className="home-kicker">{t.statsKicker}</p>
            <h2 className="section-title home-section-title">{t.statsTitle}</h2>
          </motion.div>

          <div className="home-stat-strip">
            {t.stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="home-stat-card"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.96 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport,
                      transition: { duration: 0.45, delay: i * 0.05 },
                    })}
              >
                <p className="home-stat-value">{s.value}</p>
                <p className="home-stat-label">{s.label}</p>
                <p className="home-stat-sub">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap home-section home-faq-section" id="faq">
        <div className="container-shell home-faq-shell">
          <motion.div className="home-section-head" {...fadeUp}>
            <p className="home-kicker">{t.faqKicker}</p>
            <h2 className="section-title home-section-title">{t.faqTitle}</h2>
          </motion.div>

          <div className="home-faq-list">
            {t.faqs.map((item, i) => (
              <motion.details
                key={item.q}
                className="home-faq-item"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 14 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport,
                      transition: { duration: 0.4, delay: i * 0.05 },
                    })}
              >
                <summary className="home-faq-q">{item.q}</summary>
                <p className="home-faq-a">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
