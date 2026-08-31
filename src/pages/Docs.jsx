import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/useLang'
 
export default function Docs() {
  const [loaded, setLoaded] = useState(false)
  const { t } = useLang()
  const pinTimer = useRef(null)
 
  useEffect(() => {
    window.scrollTo(0, 0)
    return () => clearInterval(pinTimer.current)
  }, [])

  const onFrameLoad = () => {
    setLoaded(true)
    window.scrollTo(0, 0) 
    clearInterval(pinTimer.current)
    const stop = Date.now() + 1000
    pinTimer.current = setInterval(() => {
      if (Date.now() > stop) {
        clearInterval(pinTimer.current)
        return
      }
      if (window.scrollY !== 0) window.scrollTo(0, 0)
    }, 100)
  }

  return (
    <section className="pt-28 mx-auto max-w-[1200px] px-6">
      <header className="mb-8">
        <p className="text-brand text-xs uppercase tracking-[0.3em] mb-3">{t('docs.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-semibold">{t('docs.title')}</h1>
      </header>

      <div className="glass rounded-2xl overflow-hidden relative h-[calc(100vh-260px)] min-h-[480px]">
        {!loaded && (
          <div className="skeleton absolute inset-0 grid place-items-center">
            <span className="text-mist-dim text-sm">{t('docs.loading')}</span>
          </div>
        )}
        <iframe
          src={`${import.meta.env.BASE_URL}lua_api_doc.html`}
          title={t('docs.iframe.title')}
          onLoad={onFrameLoad}
          className={`w-full h-full border-0 bg-white transition-opacity duration-500 ${loaded ? 'opacity-100 fade-in' : 'opacity-0'}`}
        />
      </div>
    </section>
  )
}
