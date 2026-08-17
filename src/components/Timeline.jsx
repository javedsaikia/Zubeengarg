import Reveal from './Reveal'

const MILESTONES = [
  {
    year: '1972',
    title: 'Born in Jorhat, Assam',
    text: 'A young voice begins — one that would one day be carried across the world.',
  },
  {
    year: '1992',
    title: 'Debut album · Anamika',
    text: 'His first Assamese album announces a talent the region would never forget.',
  },
  {
    year: '1990s',
    title: 'The voice of Assamese cinema',
    text: 'Soundtrack after soundtrack, he became the sound of a generation’s life.',
  },
  {
    year: '2006',
    title: 'Ya Ali · a nationwide phenomenon',
    text: 'With Gangster, a single song makes the whole country fall in love with his voice.',
  },
  {
    year: '2010s',
    title: '38,000+ songs · 40+ languages',
    text: 'An unmatched body of work spanning cinema, albums, devotional music and beyond.',
  },
  {
    year: '2025',
    title: 'Rest in peace',
    text: 'He leaves behind a legacy no silence can touch.',
  },
]

export default function Timeline() {
  return (
    <section id="journey" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">
            The Journey
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            A life spent <span className="font-serif font-normal text-lav-300 italic">in song.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 md:mt-24">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-lav-500/50 via-lav-500/20 to-transparent md:left-1/2" />
          <div className="space-y-14 md:space-y-20">
            {MILESTONES.map((m, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={m.year} delay={0.05}>
                  <div className={`relative flex ${left ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-lav-300 bg-black shadow-[0_0_14px_rgba(157,120,255,0.8)] md:left-1/2" />
                    <div
                      className={`w-full pl-12 md:w-1/2 md:pl-0 ${
                        left ? 'md:pr-16 md:text-right' : 'md:pl-16'
                      }`}
                    >
                      <p className="font-serif text-4xl text-lav-400 md:text-5xl">{m.year}</p>
                      <h3 className="mt-3 text-xl font-medium text-lav-100 md:text-2xl">{m.title}</h3>
                      <p className="mt-3 leading-relaxed text-lav-100/60">{m.text}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
