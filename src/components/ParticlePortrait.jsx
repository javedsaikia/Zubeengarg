import { useEffect, useRef, useState } from 'react'
import { sampleImage, createParticleRenderer } from '../lib/particles'

function defaultQuality() {
  if (typeof window === 'undefined') return 16000
  return window.matchMedia('(pointer: coarse)').matches ? 9500 : 16000
}

export default function ParticlePortrait({ src, className, quality, alignY = 0.5, pixelAlpha = 0.3, cells = 32 }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let renderer = null
    let io = null
    const count = quality ?? defaultQuality()
    ;(async () => {
      try {
        const { points, aspect, pixel } = await sampleImage(src, {
          width: 220,
          count,
          threshold: 30,
          cells,
        })
        if (cancelled) return
        renderer = createParticleRenderer(canvasRef.current, {
          points,
          aspect,
          alignY,
          pixel,
          pixelAlpha,
        })
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
  }, [src, quality, alignY, pixelAlpha, cells])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${className} transition-opacity duration-[2200ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
