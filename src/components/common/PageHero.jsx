import { Spotlight } from '@/components/aceternity/Spotlight'
import { GridBackground } from '@/components/aceternity/GridBackground'

// Banner at the top of every inner page — one <h1> per page lives here.
export function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 bg-camo">
      <GridBackground />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-40" fill="#d4a537" />
      <div className="container-page relative z-10 py-14 text-center sm:py-20">
        {eyebrow && (
          <p className="mb-3 inline-flex rounded-full border border-gold/40 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.16em] text-gold uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{subtitle}</p>}
        {children}
      </div>
      <div aria-hidden="true" className="relative z-10 h-1.5 bg-tricolor" />
    </section>
  )
}
