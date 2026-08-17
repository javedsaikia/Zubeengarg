import Reveal from './Reveal'

export default function Intro() {
  return (
    <section id="intro" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">
            A Life of Creation and Compassion
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            Born in Tura, raised across a valley of voices — <em className="text-lav-300">he</em> was
            Assam's to keep.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-10 text-base leading-relaxed text-lav-100/70 md:text-lg">
            On 18 November 1972, Zubeen Borthakur was born in Tura, Meghalaya — son of Mohini Mohon
            Borthakur, a poet who wrote as Kapil Thakur, and Ily Borthakur, a classical singer. His
            father named him after the conductor Zubin Mehta; his mother taught him his first ragas.
            Postings moved the family from the Barak valley to the Brahmaputra, and every stop left
            him another language, another rhythm, another song waiting to be sung.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-6 text-base leading-relaxed text-lav-100/50 md:text-lg">
            From Bihu to Borgeet to the pop of Bombay, he carried it all home — and the music never
            left. As long as anyone hums his songs, the voice of Assam is still singing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
