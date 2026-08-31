import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { showcaseBlocks } from '../data/showcase'
import { useLang } from '../i18n/useLang'
import Lightbox from './Lightbox'

const AUTOPLAY_MS = 3500
const SWIPE_THRESHOLD = 60
const DEPTH = 3 // max cards visible in the deck (front + 2 behind)

// Adaptive slide image: keeps its own aspect ratio, capped by max-h, with a
// pulsing skeleton underneath until loaded.
function SlideImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false)
  const fade = `transition-opacity duration-500 ${loaded ? 'opacity-100 fade-in' : 'opacity-0'}`

  if (!src) {
    // Placeholder panel for slides without a screenshot yet
    return (
      <div className="glass rounded-[5px] h-[260px] md:h-[340px] grid place-items-center">
        <svg width="64" height="64" viewBox="0 0 72 72" fill="none" aria-hidden="true">
          <rect x="6" y="12" width="60" height="42" rx="6" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="22" cy="27" r="5" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M6 46l16-12 12 9 14-11 18 14" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="24" y="60" width="24" height="3" rx="1.5" fill="#9c9ca6" fillOpacity="0.3" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative flex justify-center">
      {!loaded && <div className="skeleton rounded-[5px] w-full max-w-[560px] min-h-[240px] md:min-h-[340px]" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`relative max-w-full w-auto max-h-[380px] md:max-h-[440px] mx-auto rounded-[5px] ${fade}`}
      />
    </div>
  )
}

// Deck pose per depth position — fanned playing-card stack:
// rear cards rotate around their bottom-center edge (sign alternates per
// slide for a casual, hand-held feel), with small x/y offsets and
// decreasing scale/opacity/blur. Rotation and offsets halve on mobile.
function deckPose(pos, mobile, i) {
  const dir = i % 2 === 0 ? 1 : -1
  const k = mobile ? 0.5 : 1
  const poses = [
    { rotate: 0, x: 0, y: 0, scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)' },
    { rotate: 5 * dir * k, x: 18 * dir * k, y: 10 * k, scale: 0.94, opacity: 0.75, filter: 'brightness(0.8) blur(1px)' },
    { rotate: -9 * dir * k, x: -24 * dir * k, y: 20 * k, scale: 0.88, opacity: 0.5, filter: 'brightness(0.65) blur(2px)' },
  ]
  return poses[Math.min(pos, poses.length - 1)]
}

/**
 * Braytech product showcase — auto-playing stacked-card deck.
 * The front slide carries a liquid-glass info banner fused to the bottom
 * edge of its screenshot; rear slides peek behind with decreasing
 * scale/opacity/blur. Autoplay pauses on hover; rear cards and dots jump
 * directly. Reduced motion: static crossfade only.
 * Data-driven from src/data/showcase.js (unchanged bilingual fields).
 */
export default function Showcase() {
  const { t, pick } = useLang()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [mobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  const total = showcaseBlocks.length

  const go = useCallback((next) => setIndex(((next % total) + total) % total), [total])

  // Lightbox: fullscreen preview of the front card's image
  const [lightbox, setLightbox] = useState(false)
  // Distinguish a click from a swipe: drags past a small offset suppress the
  // click that fires on mouse-up
  const dragMoved = useRef(false)

  // Autoplay: paused on hover, while the lightbox is open, or with reduced motion
  useEffect(() => {
    if (paused || lightbox || reducedMotion) return
    const id = setInterval(() => go(index + 1), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [index, paused, lightbox, reducedMotion, go])

  const onDragEnd = (_, info) => {
    dragMoved.current = Math.abs(info.offset.x) > 10
    if (info.offset.x < -SWIPE_THRESHOLD) go(index + 1)
    else if (info.offset.x > SWIPE_THRESHOLD) go(index - 1)
  }

  // Front image click → open preview unless the gesture was a drag
  const onFrontImageClick = () => {
    if (dragMoved.current) {
      dragMoved.current = false
      return
    }
    setLightbox(true)
  }

  // Visible deck: pos 0 = front, 1..DEPTH-1 = rear cards
  const visible = Array.from({ length: Math.min(DEPTH, total) }, (_, pos) => ({
    i: (index + pos) % total,
    pos,
  }))

  const transition = reducedMotion
    ? { duration: 0.15 }
    : { type: 'spring', stiffness: 260, damping: 26 }

  return (
    <section
      className="mx-auto max-w-[1200px] px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <header className="mb-14 md:mb-20">
        <p className="text-brand text-xs uppercase tracking-[0.3em] mb-3">{t('showcase.kicker')}</p>
        <h2 className="text-3xl md:text-4xl font-semibold">
          {t('showcase.title')}{' '}
          <span className="text-mist-dim font-normal text-xl md:text-2xl">/ {t('showcase.title.accent')}</span>
        </h2>
      </header>

      {/* Deck */}
      <div className="relative max-w-[860px] mx-auto">
        {/* Soft gold radial glow behind the deck */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 55%, rgba(255,215,69,0.12) 0%, rgba(255,215,69,0.04) 45%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />

        <AnimatePresence mode="popLayout">
          {visible.map(({ i, pos }) => {
            const block = showcaseBlocks[i]
            const front = pos === 0
            const pose = deckPose(pos, mobile, i)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, y: 60, rotate: pose.rotate * 1.5 }}
                animate={{ opacity: pose.opacity, scale: pose.scale, x: pose.x, y: pose.y, rotate: pose.rotate, filter: pose.filter }}
                // Front card slides out like a drawn playing card
                exit={{ opacity: 0, x: reducedMotion ? 0 : -140, rotate: reducedMotion ? 0 : -10, transition: { duration: 0.3 } }}
                transition={transition}
                drag={front && !reducedMotion ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={front ? onDragEnd : undefined}
                onClick={front ? undefined : () => go(i)}
                style={{ zIndex: 30 - pos * 10, transformOrigin: 'bottom center' }}
                className={
                  front
                    ? 'relative'
                    : 'absolute inset-0 flex justify-center items-start cursor-pointer'
                }
              >
                {/* Card shell: crisp border + layered shadow make each card's
                    edge readable inside the stack */}
                <div
                  className={`relative ${front ? '' : 'w-full'} rounded-[5px] border border-white/15
                    bg-ink-2/60 shadow-[0_12px_36px_rgba(0,0,0,0.55)]`}
                >
                  {front ? (
                    // Front image is click-to-preview; drag gestures are
                    // filtered out via dragMoved (see onDragEnd)
                    <div onClick={onFrontImageClick} className="cursor-zoom-in">
                      <SlideImage src={pick(block.src)} alt={pick(block.title)} />
                    </div>
                  ) : (
                    <SlideImage src={pick(block.src)} alt={pick(block.title)} />
                  )}

                  {/* Floating liquid-glass info strip on the front image's
                      lower edge. Quick-fades on exit (propagated from the
                      card's AnimatePresence) so outgoing/incoming banner
                      text never overlaps. */}
                  {front && (
                    <motion.div
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      className="absolute inset-x-2 md:inset-x-3 bottom-2 md:bottom-3 glass rounded-[5px]
                        px-4 py-3 flex items-center gap-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
                    >
                      <div className="min-w-0 flex-1">
                        {/* Subtitle + title share one line */}
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-mist-dim text-[10px] tracking-widest uppercase shrink-0">
                            {pick(block.subtitle)}
                          </span>
                          <h3 className="text-sm md:text-base font-semibold truncate">{pick(block.title)}</h3>
                        </div>
                        <p className="text-mist-dim text-xs leading-relaxed line-clamp-2 md:line-clamp-1 mt-1">
                          {pick(block.description)}
                        </p>
                        <div className="hidden sm:flex flex-wrap gap-1.5 mt-1.5">
                          {block.tags.slice(0, 3).map((tag, j) => (
                            <span
                              key={j}
                              className="glass rounded-full px-2.5 py-0.5 text-[11px] text-mist-dim"
                            >
                              {pick(tag)}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Current / total counter fused into the strip */}
                      <span className="font-display text-sm shrink-0 self-start pt-0.5">
                        <span className="text-brand">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-mist-dim opacity-50"> / {String(total).padStart(2, '0')}</span>
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-10 md:mt-14 flex justify-center gap-2.5">
        {showcaseBlocks.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-240 ${
              i === index ? 'w-7 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Lightbox: fullscreen preview of the front card's image */}
      <Lightbox
        src={lightbox ? pick(showcaseBlocks[index].src) : null}
        alt={pick(showcaseBlocks[index].title)}
        onClose={() => setLightbox(false)}
      />
    </section>
  )
}
