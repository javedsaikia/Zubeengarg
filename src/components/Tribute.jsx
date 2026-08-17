import Reveal from './Reveal'

export default function Tribute() {
  return (
    <section id="tribute" className="relative overflow-hidden px-6 py-32 md:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lav-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">
            Light a Candle
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            He lives on <span className="font-serif font-normal text-lav-300 italic">in every
            song.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 max-w-xl leading-relaxed text-lav-100/60">
            From the valleys of the Brahmaputra to the studios of Mumbai, his voice carried love,
            unity, and the soul of Assam to every corner of the world. Whether it reached you in a
            quiet moment or on a long journey home — keep it close, and it stays alive.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://open.spotify.com/search/Zubeen%20Garg"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-lav-100 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white"
            >
              Listen to His Music
            </a>
            <a
              href="mailto:?subject=Zubeen%20Garg%20—%20in%20memory"
              className="rounded-full border border-lav-100/25 px-7 py-3.5 text-sm text-lav-100 transition hover:border-lav-100/60 hover:bg-lav-100/5"
            >
              Share a Memory
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
