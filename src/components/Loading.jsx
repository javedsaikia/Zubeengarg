import { useEffect, useRef, useState } from 'react'

const R = 120
const CIRC = 2 * Math.PI * R

function ease(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export default function Loading({ onDone }) {
  const [p, setP] = useState(0)
  const [fade, setFade] = useState(false)
  const [gone, setGone] = useState(false)
  const doneRef = useRef(onDone)

  useEffect(() => {
    const repeat = (() => {
      try {
        return sessionStorage.getItem('zg-loaded') === '1'
      } catch {
        return false
      }
    })()
    const total = repeat ? 650 : 4500
    const start = performance.now()
    let raf = 0
    let timers = []
    const tick = (t) => {
      const el = Math.min(1, (t - start) / total)
      setP(Math.round(ease(el) * 100))
      if (el < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        timers.push(setTimeout(() => setFade(true), repeat ? 0 : 350))
        timers.push(setTimeout(() => setGone(true), repeat ? 300 : 900))
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!gone) return
    try {
      sessionStorage.setItem('zg-loaded', '1')
    } catch {}
    doneRef.current && doneRef.current()
  }, [gone])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-300 ${
        fade ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative flex h-[242px] w-[242px] items-center justify-center">
        <svg width="242" height="242" viewBox="0 0 242 242">
          <circle
            fill="transparent"
            r={R}
            cx={121}
            cy={121}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
            strokeDasharray={CIRC}
          />
          <circle
            fill="transparent"
            r={R}
            cx={121}
            cy={121}
            stroke="#ffffff"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - p / 100)}
          />
        </svg>
        <span className="absolute text-[18px] font-bold text-white">{p}%</span>
      </div>
    </div>
  )
}