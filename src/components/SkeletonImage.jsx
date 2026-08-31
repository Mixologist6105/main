import { useState } from 'react'

/**
 * Image with a grey pulsing skeleton behind it; the image fades in once loaded.
 * `fit` maps to object-fit ('contain' shows the whole image, 'cover' crops).
 */
// Class names kept literal so Tailwind can see them
const FIT_CLASS = { cover: 'object-cover' }

export default function SkeletonImage({ src, alt, className = '', fit = 'cover' }) {
  const [loaded, setLoaded] = useState(false)
  const fade = `transition-opacity duration-500 ${loaded ? 'opacity-100 fade-in' : 'opacity-0'}`

  // 'contain': fully adaptive — flex-centered img limited by both max-w and
  // max-h so any aspect ratio stays fully visible, no crop, no overflow.
  // Skeleton keeps the same inset shape as the padded content box.
  if (fit === 'contain') {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
        {!loaded && <div className="skeleton absolute inset-0 rounded-[5px]" />}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`relative max-w-full max-h-full w-auto h-auto object-contain rounded-[5px] ${fade}`}
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full ${FIT_CLASS.cover} ${fade}`}
      />
    </div>
  )
}
