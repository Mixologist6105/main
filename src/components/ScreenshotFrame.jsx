import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import SkeletonImage from './SkeletonImage'
import { useLang } from '../i18n/useLang'

/**
 * Spotlight screenshot frame ("聚焦展位"):
 * - near-square default ratio (5/4) with object-contain so square app
 *   screenshots render uncropped on a darker glass bed
 * - soft brand-gold radial glow behind the card for a floating feel
 * - subtle pointer-follow 3D tilt (±4°), disabled on touch devices and
 *   under prefers-reduced-motion
 * `ratio` in the data can still override the aspect per block.
 */
export default function ScreenshotFrame({ src, alt, ratio = 'aspect-[5/4]' }) {
  const { t } = useLang()
  const ref = useRef(null)

  // Enable tilt only on devices with a real pointer and motion allowed
  const [tiltEnabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Normalized pointer position inside the card (0..1)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 180, damping: 22 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-4, 4]), { stiffness: 180, damping: 22 })

  const onMouseMove = (e) => {
    if (!tiltEnabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const onMouseLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      {/* Soft gold radial glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(50% 50% at 50% 55%, rgba(255,215,69,0.12) 0%, rgba(255,215,69,0.04) 45%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        whileHover={tiltEnabled ? { y: -6 } : undefined}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className={`relative glass rounded-2xl overflow-hidden ${ratio}
          bg-ink-2/70 shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          hover:shadow-[0_20px_56px_rgba(0,0,0,0.5)] transition-shadow duration-240`}
      >
        {src ? (
          <SkeletonImage src={src} alt={alt} fit="contain" className="p-4 md:p-6" />
        ) : (
          // Minimal placeholder graphic — replace by setting `src` in the showcase data
          <div className="absolute inset-0 grid place-items-center">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
              <rect x="6" y="12" width="60" height="42" rx="6" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" />
              <circle cx="22" cy="27" r="5" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" />
              <path d="M6 46l16-12 12 9 14-11 18 14" stroke="#9c9ca6" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="24" y="60" width="24" height="3" rx="1.5" fill="#9c9ca6" fillOpacity="0.3" />
            </svg>
            <span className="absolute bottom-4 text-xs text-mist-dim opacity-60">
              {t('screenshot.placeholder')}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
