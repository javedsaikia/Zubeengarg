import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import ParticlePortrait from './ParticlePortrait'
import FloatIcon from './FloatIcon'

const FLOAT_ICONS = [
  {
    icon: 'mic',
    size: 78,
    className: 'right-[6%] top-[24%]',
    xr: 10,
    yr: 7,
    dur: 16,
    phase: 0.4,
    par: 46,
    count: 160,
  },
  {
    icon: 'note',
    size: 88,
    className: 'left-[6%] top-[24%]',
    xr: 9,
    yr: 6,
    dur: 15,
    phase: 1.2,
    par: 38,
  },
  {
    icon: 'drum',
    size: 96,
    className: 'right-[24%] top-[18%] hidden md:block',
    xr: 6,
    yr: 4,
    dur: 20,
    phase: 2.6,
    par: 26,
    count: 170,
  },
  {
    icon: 'piano',
    size: 100,
    className: 'left-[22%] top-[36%] hidden xl:block',
    xr: 8,
    yr: 6,
    dur: 21,
    phase: 4,
    par: 34,
    count: 220,
  },
  {
    icon: 'gamosa',
    size: 80,
    className: 'right-[18%] top-[38%] hidden lg:block',
    xr: 7,
    yr: 5,
    dur: 15,
    phase: 5.3,
    par: 16,
  },
  {
    icon: 'guitar',
    size: 104,
    className: 'left-[12%] top-[48%] hidden lg:block',
    xr: 12,
    yr: 8,
    dur: 22,
    phase: 2.1,
    par: -20,
  },
  {
    icon: 'saxophone',
    size: 90,
    className: 'right-[26%] top-[46%] hidden xl:block',
    xr: 5,
    yr: 3,
    dur: 18,
    phase: 0.8,
    par: -16,
    count: 170,
  },
  {
    icon: 'headphones',
    size: 94,
    className: 'right-[9%] bottom-[42%] hidden sm:block',
    xr: 10,
    yr: 7,
    dur: 19,
    phase: 1,
    par: 42,
  },
  {
    icon: 'wave',
    size: 84,
    className: 'left-[6%] bottom-[42%] hidden md:block',
    xr: 9,
    yr: 6,
    dur: 17,
    phase: 3.1,
    par: 24,
  },
  {
    icon: 'vinyl',
    size: 88,
    className: 'left-[20%] bottom-[38%] hidden md:block',
    xr: 6,
    yr: 4,
    dur: 23,
    phase: 5.9,
    par: 30,
    count: 190,
  },
]

const EASE = [0.22, 1, 0.36, 1]

export default function Hero() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 55, damping: 18, mass: 0.6 })
  const springY = useSpring(cursorY, { stiffness: 55, damping: 18, mass: 0.6 })
  const interacting = useRef(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    if (coarse && !reduced) {
      const start = performance.now()
      const drift = (t) => {
        if (!interacting.current) {
          const s = (t - start) / 1000
          cursorX.set(Math.sin(s * 0.38 + 1) * 0.13)
          cursorY.set(Math.cos(s * 0.31 + 2.6) * 0.1)
        }
        raf = requestAnimationFrame(drift)
      }
      raf = requestAnimationFrame(drift)
    }
    const end = (e) => {
      interacting.current = false
      if (!e || e.pointerType !== 'mouse') {
        cursorX.set(0)
        cursorY.set(0)
      }
    }
    window.addEventListener('pointerup', end, { passive: true })
    window.addEventListener('pointercancel', end, { passive: true })
    window.addEventListener('blur', end)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      window.removeEventListener('blur', end)
    }
  }, [cursorX, cursorY])

  function onPointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    cursorX.set((e.clientX - rect.left) / rect.width - 0.5)
    cursorY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function release(e) {
    interacting.current = false
    if (!e || e.pointerType !== 'mouse') {
      cursorX.set(0)
      cursorY.set(0)
    }
  }

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-black md:block md:h-dvh md:min-h-[640px]"
      onPointerMove={onPointerMove}
      onPointerDown={() => {
        interacting.current = true
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="relative z-0 h-[70svh] w-full shrink-0 md:absolute md:inset-0 md:h-full">
        <ParticlePortrait src="/portrait.jpeg" className="h-full w-full" alignY={0.12} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_56%_50%_at_50%_42%,rgba(148,110,255,0.22),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.78),transparent_50%)]" />

      {FLOAT_ICONS.map((it, i) => (
        <FloatIcon
          key={it.icon}
          icon={it.icon}
          size={it.size}
          className={it.className}
          cx={springX}
          cy={springY}
          xr={it.xr}
          yr={it.yr}
          dur={it.dur}
          phase={it.phase + i * 0.3}
          par={it.par}
          count={it.count}
        />
      ))}

      <div className="relative z-20 px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:absolute md:inset-x-0 md:bottom-0 md:pt-0 md:pb-[calc(4rem+env(safe-area-inset-bottom))] md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="md:max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
              className="mb-4 text-[11px] font-medium uppercase tracking-[0.45em] text-lav-400"
            >
              The Voice of Assam
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 1, ease: EASE }}
              className="text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-8xl"
            >
              Zubeen{' '}
              <span className="bg-gradient-to-r from-lav-300 to-lav-500 bg-clip-text font-serif text-transparent italic">
                Garg.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
              className="mt-5 font-serif text-xl italic text-lav-200/70 md:text-2xl"
            >
              1972 – 2025
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.9, ease: EASE }}
              className="mt-9"
            >
              <a
                href="#intro"
                className="group inline-flex items-center gap-3 rounded-full bg-lav-100 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white"
              >
                Explore His Legacy
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-lav-100/40">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-lav-400/70 to-transparent" />
      </motion.div>
    </section>
  )
}
