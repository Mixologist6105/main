import { useState } from 'react'
import SoftwarePreview from '../components/SoftwarePreview'

function Tutorial({ lang }) {
  const t = lang === 'zh'
    ? {
        tag: '教程',
        title: 'UI 预览教程',
        hintTitle: '控件使用教程',
        defaultHint: '将鼠标移动到下方任意控件上，这里会显示对应功能说明。',
      }
    : {
        tag: 'Tutorial',
        title: 'UI Preview Walkthrough',
        hintTitle: 'Control Tips',
        defaultHint: 'Hover over any control below to view its corresponding usage tip here.',
      }
  const [hoverHint, setHoverHint] = useState(t.defaultHint)

  return (
    <section className="section-gap">
      <div className="container-shell content-stack-loose tutorial-stack">
        <div className="content-stack">
          <p className="hero-tag">{t.tag}</p>
          <h1 className="section-title tutorial-title">{t.title}</h1>
          <div className="hint-box tutorial-hint-box" aria-live="polite">
            <p>{t.hintTitle}</p>
            <span>{hoverHint}</span>
          </div>
        </div>

        <div className="tutorial-preview-gap">
          <SoftwarePreview lang={lang} onHintChange={setHoverHint} defaultHint={t.defaultHint} />
        </div>
      </div>
    </section>
  )
}

export default Tutorial
