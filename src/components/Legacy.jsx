import Reveal from './Reveal'

const QUOTES = [
  {
    text: 'His voice carried the Brahmaputra in every note — it was home, wherever you were.',
    who: 'A listener · Guwahati',
  },
  {
    text: "He didn't just sing Assamese music. He made the whole world hear it.",
    who: 'Music community · Assam',
  },
  {
    text: 'Every song of his is a memory of home. He will never be far.',
    who: 'A fan · from the diaspora',
  },
]

export default function Legacy() {
  return (
    <section id="legacy" className="relative overflow-hidden px-6 py-28 md:py-40">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-lav-600/10 blur-[140px]" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">Legacy</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            The silence is loud,{' '}
            <span className="font-serif font-normal text-lav-300 italic">but the music stays.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.who} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-lav-100/10 bg-[#08050f] p-8 transition hover:border-lav-400/30 hover:bg-[#0b0716]">
                <blockquote className="font-serif text-xl leading-relaxed text-lav-100/90 italic md:text-2xl">
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-8 text-xs uppercase tracking-[0.2em] text-lav-100/45">
                  {q.who}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-24 max-w-3xl text-center">
            <p className="font-serif text-3xl leading-snug text-lav-200 md:text-4xl">
              Where words fail, music speaks. <em className="text-lav-300">His</em> will always
              speak for Assam.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
