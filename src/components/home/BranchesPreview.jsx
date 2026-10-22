import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { BranchCard } from '@/components/common/BranchCard'
import { PhoneList } from '@/components/common/PhoneList'
import { Reveal } from '@/components/aceternity/Reveal'
import { BRANCHES } from '@/data/branches'
import { useLanguage } from '@/hooks/useLanguage'

export function BranchesPreview() {
  const { t } = useLanguage()
  return (
    <section className="section-y bg-white" aria-labelledby="home-branches-heading">
      <div className="container-page">
        <SectionHeading
          id="home-branches-heading"
          eyebrow={t('homeBranches.eyebrow')}
          title={t('homeBranches.title')}
          subtitle={t('homeBranches.subtitle')}
        />
        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {BRANCHES.map((branch, index) => (
            <Reveal as="li" key={branch.id} delay={index * 0.1}>
              <BranchCard branch={branch} index={index} />
            </Reveal>
          ))}
        </ul>
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4 rounded-2xl border bg-sand-50 p-5 text-center sm:p-6">
          <p className="font-semibold text-forest">{t('branches.contactTitle')}</p>
          <PhoneList layout="row" className="justify-center" />
          <Button asChild variant="link" className="text-forest">
            <Link to="/branches">
              {t('homeBranches.cta')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
