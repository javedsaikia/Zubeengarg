import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'Biography', href: '#intro' },
  { label: 'Music', href: '#voice' },
  { label: 'Legacy', href: '#legacy' },
  { label: 'Tribute', href: '#tribute' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'glass' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lav-400/30 font-serif text-lg text-lav-300 transition group-hover:border-lav-400/70">
            ZG
          </span>
          <span className="hidden text-sm font-medium tracking-wide text-lav-100 sm:block">Zubeen Garg</span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-lav-100/60 transition hover:text-lav-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#tribute"
            className="rounded-full border border-lav-100/25 px-5 py-2 text-sm text-lav-100 transition hover:border-lav-100/70 hover:bg-lav-100/5"
          >
            Light a Candle
          </a>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span
            className={`h-px w-5 bg-lav-100 transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-5 bg-lav-100 transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 pb-8 pt-2">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-lav-100/80"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#tribute"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block w-fit rounded-full border border-lav-100/25 px-5 py-2 text-sm"
              >
                Light a Candle
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
