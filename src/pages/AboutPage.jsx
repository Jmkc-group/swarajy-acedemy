import { BookOpen, CircleCheck, Compass, Eye, Flag, Footprints, GraduationCap, HeartHandshake, Target, Users } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { FeatureCard } from '@/components/common/FeatureCard'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { GuaranteeBanner } from '@/components/home/GuaranteeBanner'
import logoEmblem from '@/assets/logo-emblem.webp'
import { useLanguage } from '@/hooks/useLanguage'

const PHILOSOPHY_ICONS = [Flag, BookOpen, Footprints, HeartHandshake]
const PHILOSOPHY_ACCENTS = ['forest', 'navy', 'olive', 'saffron']

export default function AboutPage() {
  const { t } = useLanguage()
  const intro = t('about.intro')
  const philosophy = t('about.philosophy')
  const approach = t('about.approach')
  const pathway = t('about.pathway')
  const class8 = t('about.class8')
  const faculty = t('about.faculty')

  return (
    <>
      <Seo page="about" />
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.title')} subtitle={t('about.subtitle')} />

      {/* Introduction */}
      <section className="section-y bg-white" aria-labelledby="intro-heading">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <SectionHeading id="intro-heading" align="left" eyebrow={t('about.eyebrow')} title={t('about.introTitle')} />
            <div className="mt-5 space-y-4 text-base text-muted-ink sm:text-lg">
              {intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
            <div aria-hidden="true" className="absolute inset-6 rounded-full bg-gold/25 blur-3xl" />
            <div className="relative rounded-3xl bg-navy-950 bg-camo p-8 shadow-2xl">
              <img src={logoEmblem} alt={t('brand.logoAlt')} width="560" height="501" loading="lazy" className="w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-surface pb-16 sm:pb-20" aria-label={`${t('about.missionTitle')} / ${t('about.visionTitle')}`}>
        <div className="container-page grid gap-6 pt-16 md:grid-cols-2">
          {[
            { icon: Target, title: t('about.missionTitle'), text: t('about.mission') },
            { icon: Eye, title: t('about.visionTitle'), text: t('about.vision') },
          ].map(({ icon: Icon, title, text }) => (
            <Reveal key={title}>
              <SpotlightCard className="h-full rounded-2xl bg-gradient-to-br from-forest to-navy-950 p-8 text-white shadow-xl">
                <Icon aria-hidden="true" className="size-9 text-gold" />
                <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>
                <p className="mt-3 text-white/80 sm:text-lg">{text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Teaching philosophy */}
      <section className="section-y bg-white" aria-labelledby="philosophy-heading">
        <div className="container-page">
          <SectionHeading id="philosophy-heading" title={t('about.philosophyTitle')} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {philosophy.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 0.06}>
                <FeatureCard
                  icon={PHILOSOPHY_ICONS[index]}
                  accent={PHILOSOPHY_ACCENTS[index]}
                  title={item.title}
                  description={item.desc}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Educational approach */}
      <section className="section-y bg-surface" aria-labelledby="approach-heading">
        <div className="container-page">
          <SectionHeading id="approach-heading" title={t('about.approachTitle')} />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {approach.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-leaf" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Government job pathway */}
      <section className="section-y bg-white" aria-labelledby="pathway-heading">
        <div className="container-page">
          <SectionHeading id="pathway-heading" title={t('about.pathwayTitle')} subtitle={t('about.pathwaySubtitle')} />
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {pathway.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.07} className="relative">
                <div className="h-full rounded-2xl border bg-gradient-to-b from-white to-sand-50 p-5 text-center shadow-sm">
                  <span className="mx-auto inline-flex size-10 items-center justify-center rounded-full bg-forest font-heading font-bold text-gold ring-4 ring-gold/20">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-ink">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Class 8 onwards */}
      <section className="section-y relative overflow-hidden bg-navy-950 bg-camo" aria-labelledby="class8-heading">
        <div className="container-page relative">
          <SectionHeading id="class8-heading" tone="light" title={t('about.class8Title')} subtitle={t('about.class8Subtitle')} />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {class8.map((stage, index) => (
              <Reveal as="li" key={stage.stage} delay={index * 0.1}>
                <div className="h-full rounded-2xl border border-gold/30 bg-white/5 p-6 backdrop-blur-sm">
                  <GraduationCap aria-hidden="true" className="size-8 text-gold" />
                  <h3 className="mt-3 text-xl font-bold text-white">{stage.stage}</h3>
                  <p className="mt-2 text-white/75">{stage.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Guarantee */}
      <div className="bg-white pt-16 sm:pt-20">
        <GuaranteeBanner />
      </div>

      {/* Faculty subject categories — no individual names are published */}
      <section className="section-y bg-white" aria-labelledby="faculty-heading">
        <div className="container-page">
          <SectionHeading id="faculty-heading" title={t('about.facultyTitle')} subtitle={t('about.facultySubtitle')} />
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {faculty.map((subject, index) => (
              <li
                key={subject}
                className="inline-flex items-center gap-2 rounded-full border border-sand bg-sand-50 px-4 py-2 font-semibold text-forest"
              >
                {index % 2 === 0 ? (
                  <Users aria-hidden="true" className="size-4 text-khaki-deep" />
                ) : (
                  <Compass aria-hidden="true" className="size-4 text-khaki-deep" />
                )}
                {subject}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  )
}
