import { useEffect, useRef, useState } from 'react'
import { sampleImage, createParticleRenderer } from '../lib/particles'

function defaultQuality() {
  if (typeof window === 'undefined') return 9000
  return window.matchMedia('(pointer: coarse)').matches ? 5000 : 9000
}

export default function ParticlePortrait({ src, className, quality }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let renderer = null
    let io = null
    const count = quality ?? defaultQuality()
    ;(async () => {
      try {
        const { points, aspect } = await sampleImage(src, { width: 220, count, threshold: 40 })
        if (cancelled) return
        renderer = createParticleRenderer(canvasRef.current, { points, aspect })
        io = new IntersectionObserver(
          ([entry]) => (entry.isIntersecting ? renderer.resume() : renderer.pause()),
          { rootMargin: '240px' },
        )
        io.observe(canvasRef.current)
        setReady(true)
      } catch (err) {
        console.error('[ParticlePortrait]', err)
      }
    })()
    return () => {
      cancelled = true
      if (io) io.disconnect()
      if (renderer) renderer.destroy()
    }
  }, [src, quality])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${className} transition-opacity duration-[2200ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
