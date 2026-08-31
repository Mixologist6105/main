import { useEffect, useRef } from 'react'

/**
 * Hero atmosphere background: a slowly drifting field of low-saturation
 * particles plus a soft gradient glow, rendered with three.js.
 * three.js is lazy-loaded so the main bundle stays light.
 * Fully disabled under prefers-reduced-motion (static CSS glow remains).
 */
export default function HeroBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    // Respect reduced motion: keep only the static gradient below
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mount = mountRef.current
    if (!mount) return

    let dispose = () => {}
    let cancelled = false

    ;(async () => {
      const THREE = await import('three')
      if (cancelled) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
      camera.position.z = 8

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      mount.appendChild(renderer.domElement)

      // Low-density particle field, brand gold + cool grey, very dim
      const COUNT = 220
      const positions = new Float32Array(COUNT * 3)
      const seeds = new Float32Array(COUNT)
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6
        seeds[i] = Math.random() * Math.PI * 2
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const gold = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color: 0xffd745, size: 0.05, transparent: true, opacity: 0.35 })
      )
      const grey = new THREE.Points(
        geometry.clone(),
        new THREE.PointsMaterial({ color: 0x8a8a96, size: 0.04, transparent: true, opacity: 0.25 })
      )
      grey.rotation.z = Math.PI / 5
      scene.add(gold, grey)

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = mount
        if (!w || !h) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      window.addEventListener('resize', resize)

      let raf = 0
      const clock = new THREE.Clock()
      const animate = () => {
        const t = clock.getElapsedTime()
        // Slow ambient drift + gentle wave
        gold.rotation.y = t * 0.02
        grey.rotation.y = -t * 0.015
        const pos = geometry.attributes.position
        for (let i = 0; i < COUNT; i++) {
          pos.array[i * 3 + 1] += Math.sin(t * 0.3 + seeds[i]) * 0.0008
        }
        pos.needsUpdate = true
        renderer.render(scene, camera)
        raf = requestAnimationFrame(animate)
      }
      animate()

      dispose = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        geometry.dispose()
        gold.material.dispose()
        grey.geometry.dispose()
        grey.material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Static soft gradient glow (visible even with reduced motion) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 30%, rgba(255,215,69,0.07) 0%, rgba(255,215,69,0.02) 45%, transparent 70%)',
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  )
}
