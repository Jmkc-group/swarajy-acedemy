import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Quote } from 'lucide-react'
import { motion } from 'motion/react'
import logoEmblem from '@/assets/logo-emblem.webp'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spotlight } from '@/components/aceternity/Spotlight'
import { GridBackground } from '@/components/aceternity/GridBackground'
import { MovingBorder } from '@/components/aceternity/MovingBorder'
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect'
import { PHONE_NUMBERS, SLOGANS } from '@/data/site'
import { telHref } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'

export function HeroSection() {
  const { t, lang } = useLanguage()
  const [mainSlogan, ...otherSlogans] = SLOGANS

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 bg-camo" aria-labelledby="hero-heading">
      <GridBackground />
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-56" fill="#d4a537" />
      <div aria-hidden="true" className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-leaf/25 blur-3xl" />

      <div className="container-page relative z-10 grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-5 border border-gold/40 bg-white/5 px-3 py-1 text-xs font-semibold whitespace-normal text-gold sm:text-sm">
              {t('hero.badge')}
            </Badge>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[2rem] leading-tight font-extrabold text-white sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.titleLead')} <span className="text-gradient-gold">{t('hero.titleHighlight')}</span>{' '}
            {t('hero.titleTail')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-white/80 sm:text-lg lg:mx-0"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MovingBorder>
              <Button asChild variant="cta" size="xl" className="rounded-[10px]">
                <Link to="/contact">
                  {t('common.admissionEnquiry')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </MovingBorder>
            <Button asChild variant="outline-light" size="xl">
              <a href={telHref(PHONE_NUMBERS[0])}>
                <Phone aria-hidden="true" />
                {t('common.callNow')}
              </a>
            </Button>
          </motion.div>

          {/* Official slogan — always shown in its original language */}
          <figure className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm lg:mx-0">
            <figcaption className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-gold uppercase">
              <Quote aria-hidden="true" className="size-4" />
              {t('hero.sloganLabel')}
            </figcaption>
            <blockquote lang={mainSlogan.lang}>
              <TextGenerateEffect
                key={lang}
                words={mainSlogan.original}
                delay={0.5}
                className="font-heading text-lg leading-relaxed font-semibold text-white sm:text-xl"
              />
            </blockquote>
            {lang !== mainSlogan.lang && mainSlogan.translation[lang] && (
              <p className="mt-2 text-sm text-white/65 italic">{mainSlogan.translation[lang]}</p>
            )}
          </figure>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          <div aria-hidden="true" className="absolute inset-8 rounded-full bg-gold/25 blur-3xl" />
          <img
            src={logoEmblem}
            alt={t('brand.logoAlt')}
            width="560"
            height="501"
            fetchPriority="high"
            className="relative w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
          />
          <ul className="relative mt-6 flex flex-col gap-2">
            {otherSlogans.map((slogan) => (
              <li
                key={slogan.id}
                className="rounded-xl border border-gold/25 bg-navy-900/70 px-4 py-2.5 text-center backdrop-blur-sm"
              >
                <span lang={slogan.lang} className="block font-heading text-sm font-semibold text-gold sm:text-base">
                  {slogan.original}
                </span>
                {lang !== slogan.lang && slogan.translation[lang] && (
                  <span className="block text-xs text-white/60">{slogan.translation[lang]}</span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      <div aria-hidden="true" className="relative z-10 h-1.5 bg-tricolor" />
    </section>
  )
}
