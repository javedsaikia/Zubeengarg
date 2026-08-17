export default function Footer() {
  return (
    <footer className="border-t border-lav-100/10 px-6 pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-serif text-2xl text-lav-200">Zubeen Garg</p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-lav-100/40">
            The Voice of Assam · 1972 – 2025
          </p>
        </div>
        <div className="text-xs leading-relaxed text-lav-100/35">
          <p>A digital memorial, made with love.</p>
          <p className="mt-1">His music remains — listen, and remember.</p>
        </div>
      </div>
    </footer>
  )
}
