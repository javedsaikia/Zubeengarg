import Reveal from './Reveal'

export default function Intro() {
  return (
    <section id="intro" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em] text-lav-500">
            In Memoriam
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            Some voices are born of a place — <em className="text-lav-300">his</em> was the voice of
            a river, a valley, and a people.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-10 text-base leading-relaxed text-lav-100/70 md:text-lg">
            Zubeen Garg didn't just sing for Assam — he carried it with him everywhere he went. In
            every note, every language, every stage, he was home. For decades he gave words to the
            feelings of millions, turning ordinary moments into something eternal.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-6 text-base leading-relaxed text-lav-100/50 md:text-lg">
            Today, the music remains. As long as anyone hums his songs, the voice of Assam is still
            singing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
