import { useEffect, useRef } from 'react'
import { sampleIcon, ICONS } from '../lib/icons'
import { makeSprite, capDPR } from '../lib/particles'

const CACHE = {}
let SPRITE

export default function ParticleIcon({ icon, size = 72, className, count = 150 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (!SPRITE) {
      SPRITE = makeSprite(
        [
          [0, 'rgba(255,255,255,0.95)'],
          [0.4, 'rgba(196,168,255,0.55)'],
          [1, 'rgba(0,0,0,0)'],
        ],
        24,
      )
    }
    const ctx = canvas.getContext('2d')
    const dpr = capDPR()
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!CACHE[icon]) CACHE[icon] = sampleIcon(ICONS[icon], { count, size: 128, threshold: 40 })
    const pts = CACHE[icon]

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cx = size / 2
    const cy = size / 2
    const start = performance.now()
    let raf = 0
    let running = true

    function frame(t) {
      if (!running) return
      const time = (t - start) / 1000
      ctx.clearRect(0, 0, size, size)
      const angle = motion ? 0 : Math.sin(time * 0.5) * 0.12
      const bobY = motion ? 0 : Math.sin(time * 0.9) * 1.6
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const scale = (size / 128) * 2.2
      for (const p of pts) {
        const dx = p.x * size - cx
        const dy = p.y * size - cy
        const rx = dx * cos - dy * sin + cx
        const ry = dx * sin + dy * cos + cy + bobY
        const tw = motion ? 1 : 0.65 + 0.35 * Math.sin(time * 2 + p.phase)
        const r = (0.6 + p.b * 0.8) * scale * (0.8 + 0.4 * Math.sin(time * 2.6 + p.phase * 3))
        ctx.globalAlpha = tw
        ctx.drawImage(SPRITE, rx - r, ry - r, r * 2, r * 2)
      }
      raf = requestAnimationFrame(frame)
    }

    function pause() {
      if (!running) return
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    function resume() {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? resume() : pause()),
      { rootMargin: '240px' },
    )
    io.observe(canvas)

    return () => {
      io.disconnect()
      pause()
    }
  }, [icon, size, count])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
