import { useState } from 'react'
import { Quote, UserRound } from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SocialLinks } from '@/components/common/SocialLinks'
import { Reveal } from '@/components/aceternity/Reveal'
import { FOUNDER, SLOGANS } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'

// Founder photo + quote (an official academy slogan) + social profiles.
export function FounderSection() {
  const { t, lang, pick } = useLanguage()
  const [photoFailed, setPhotoFailed] = useState(false)
  const quote = SLOGANS.find((slogan) => slogan.id === FOUNDER.quoteSloganId)

  return (
    <section className="section-y relative overflow-hidden bg-navy-950 bg-camo" aria-labelledby="founder-heading">
      <div aria-hidden="true" className="absolute -left-32 top-0 size-[26rem] rounded-full bg-gold/15 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-xs sm:max-w-sm">
          <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-saffron to-leaf opacity-80 blur-sm" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border-4 border-gold/70 bg-navy-900 shadow-2xl">
            {photoFailed ? (
              <div className="flex size-full flex-col items-center justify-center gap-3 text-gold/70">
                <UserRound aria-hidden="true" className="size-28" strokeWidth={1.25} />
                <span className="sr-only">{t('about.founder.photoAlt')}</span>
              </div>
            ) : (
              <img
                src={FOUNDER.photo}
                alt={t('about.founder.photoAlt')}
                loading="lazy"
                onError={() => setPhotoFailed(true)}
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="relative -mt-7 mx-auto w-fit rounded-xl border border-gold/40 bg-navy-950/95 px-5 py-2.5 text-center shadow-xl backdrop-blur">
            {FOUNDER.name && <p className="font-heading text-lg font-bold text-white">{pick(FOUNDER.name)}</p>}
            <p className="text-sm font-semibold text-gold">{t('about.founder.role')}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SectionHeading
            id="founder-heading"
            align="left"
            tone="light"
            eyebrow={t('about.founder.eyebrow')}
            title={t('about.founder.title')}
          />

          {quote && (
            <figure className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
              <Quote aria-hidden="true" className="size-10 text-gold" />
              <blockquote lang={quote.lang} className="mt-4 font-heading text-2xl leading-snug font-bold text-white sm:text-3xl">
                “{quote.original}”
              </blockquote>
              {lang !== quote.lang && quote.translation[lang] && (
                <p className="mt-3 text-white/70 italic">{quote.translation[lang]}</p>
              )}
              <figcaption className="mt-5 text-sm font-semibold text-gold">
                — {FOUNDER.name ? `${pick(FOUNDER.name)}, ` : ''}
                {t('about.founder.role')}
              </figcaption>
            </figure>
          )}

          <div className="mt-8">
            <h3 className="text-sm font-bold tracking-[0.14em] text-gold uppercase">{t('about.founder.follow')}</h3>
            <SocialLinks tone="light" className="mt-3" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
