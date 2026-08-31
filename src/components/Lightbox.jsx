import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Shared fullscreen image preview (lightbox).
 * Renders nothing when `src` is falsy; parent keeps `src` state and passes
 * `onClose`. Clicking the backdrop or pressing ESC closes; body scroll is
 * locked while open.
 */
export default function Lightbox({ src, alt = '', onClose }) {
  // ESC closes; lock body scroll while open
  useEffect(() => {
    if (!src) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [src, onClose])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-6 cursor-zoom-out"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-[5px]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
