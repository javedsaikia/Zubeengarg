import Reveal from './Reveal'

const MILESTONES = [
  {
    year: '1972',
    title: 'Born in Tura, Meghalaya',
    text: 'Son of the poet Kapil Thakur and the classical singer Ily Borthakur, named after conductor Zubin Mehta — a voice, and a name, chosen with music in mind.',
  },
  {
    year: '1992',
    title: 'Anamika · the new era of Assamese music',
    text: 'Debut album released at nineteen, fusing folk with rock, pop, and electronic sound — and a gold medal for western solo at the Gauhati University youth festival.',
  },
  {
    year: '1998',
    title: 'Bollywood begins',
    text: 'After the Indipop debut Chandni Raat, his voice enters Hindi cinema with Dil Se and Doli Saja Ke Rakhna.',
  },
  {
    year: '2000',
    title: 'First feature film · Tumi Mur Mathu Mur',
    text: 'A milestone for Assamese cinema — he acts, directs, composes, and co-produces a film that re-energises the regional industry.',
  },
  {
    year: '2002',
    title: 'Wedding to Garima Saikia',
    text: 'A homesick student in Mumbai, a letter written to the singer she found comfort in, and a love story that lasts a lifetime.',
  },
  {
    year: '2006',
    title: 'Ya Ali · across the nation',
    text: 'One song from Gangster carries his voice into every home in India and wins him the GIFA Best Playback Singer award.',
  },
  {
    year: '2008',
    title: 'National Film Award',
    text: 'Honoured by the President of India for Best Music Direction for Echoes of Silence at the 55th National Film Awards.',
  },
  {
    year: '2010s',
    title: '20,000+ songs · nearly every Indian language',
    text: 'A dominant force from Assamese cinema to Bengali Tollywood, with anthem after anthem in Mon Jaai, Mission China, and Kanchanjangha.',
  },
  {
    year: '2025',
    title: 'Rest in peace',
    text: 'An entire state stood still to say farewell. His last dream, Roi Roi Binaale — Assam’s first musical — was released in October, as he wished.',
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
