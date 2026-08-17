import Reveal from './Reveal'

const STATS = [
  { value: '20,000+', label: 'songs recorded' },
  { value: '12+', label: 'Indian languages sung in' },
  { value: '1992', label: 'debut album · Anamika' },
  { value: '2006', label: 'Ya Ali · GIFA Best Playback Singer' },
]

const ROLES = ['Singer', 'Composer', 'Lyricist', 'Music Director', 'Actor', 'Director', 'Filmmaker', 'Humanitarian']

export default function Voice() {
  return (
    <section id="voice" className="relative overflow-hidden px-6 py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-lav-600/10 blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">The Voice</p>
        </Reveal>
        <div className="mt-4 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <Reveal>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              A voice that spoke{' '}
              <span className="font-serif font-normal text-lav-300 italic">in every language</span>{' '}
              love knows.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-lav-100/60">
              From the Assamese ballads that made him a legend to Ya Ali's national anthem, he sang
              in nearly every major Indian language — yet his heart always belonged to Assam.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-lav-100/10 bg-lav-100/10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-[#050308]">
              <div className="p-8 md:p-10">
                <p className="font-serif text-5xl text-lav-200 md:text-6xl">{s.value}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-lav-100/50">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <Reveal>
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-lav-100/40">
              He was also
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {ROLES.map((r, i) => (
              <Reveal key={r} delay={i * 0.05}>
                <span className="rounded-full border border-lav-100/15 px-5 py-2 text-sm text-lav-100/70">
                  {r}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
