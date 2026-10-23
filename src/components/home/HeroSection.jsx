import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Phone, Quote } from 'lucide-react'
import { motion } from 'motion/react'
import logoEmblem from '@/assets/logo-emblem.webp'
import heroBg from '@/assets/hero/women-officers-parade.jpg'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MovingBorder } from '@/components/aceternity/MovingBorder'
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect'
import { PHONE_NUMBERS, SLOGANS } from '@/data/site'
import { telHref } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'

const HERO_BRANCHES = [
  {
    id: 'pcmc',
    name: {
      en: 'Pimpri-Chinchwad (PCMC) Branch',
      mr: 'पिंपरी-चिंचवड (PCMC) शाखा',
      hi: 'पिंपरी-चिंचवड (PCMC) शाखा',
    },
  },
  {
    id: 'baramati',
    name: { en: 'Supe (Baramati) Branch', mr: 'सुपे (बारामती) शाखा', hi: 'सुपे (बारामती) शाखा' },
  },
  { id: 'mumbai', name: { en: 'Mumbai Branch', mr: 'मुंबई शाखा', hi: 'मुंबई शाखा' } },
]

export function HeroSection() {
  const { t, lang, pick } = useLanguage()
  const [mainSlogan, ...otherSlogans] = SLOGANS

  return (
    <section className="relative isolate overflow-hidden bg-navy-950" aria-labelledby="hero-heading">
      {/* Background photo with a dark overlay so text and logo stay readable */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[center_70%]"
      />
      {/* Light neutral shade only, so white text stays readable on the bright sky */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/35" />

      <div className="container-page relative z-10 grid items-center gap-10 pt-6 pb-14 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
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
            className="text-[2rem] leading-tight font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.titleLead')} <span className="text-gradient-gold">{t('hero.titleHighlight')}</span>{' '}
            {t('hero.titleTail')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-lg lg:mx-0"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
          >
            <MovingBorder>
              <Button asChild variant="cta" size="xl" className="rounded-[10px]">
                <a href={telHref(PHONE_NUMBERS[0])}>
                  <Phone aria-hidden="true" />
                  {t('common.callNow')}
                </a>
              </Button>
            </MovingBorder>

            <nav aria-label={t('nav.branches')} className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/branches"
                className="inline-flex items-center gap-1.5 text-sm font-bold tracking-wide text-gold uppercase hover:underline"
              >
                <MapPin aria-hidden="true" className="size-4" />
                {t('nav.branches')}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <ul className="flex flex-wrap justify-center gap-2">
                {HERO_BRANCHES.map((branch) => (
                  <li
                    key={branch.id}
                    className="rounded-full border border-gold/60 bg-gold/15 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(212,165,55,0.25)]"
                  >
                    {pick(branch.name)}
                  </li>
                ))}
              </ul>
            </nav>
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
