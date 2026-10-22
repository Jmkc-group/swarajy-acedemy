import { Seo } from '@/components/common/Seo'
import { CTASection } from '@/components/common/CTASection'
import { HeroSection } from '@/components/home/HeroSection'
import { HighlightsSection } from '@/components/home/HighlightsSection'
import { GuaranteeBanner } from '@/components/home/GuaranteeBanner'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { PopularCourses } from '@/components/home/PopularCourses'
import { EligibilityChecker } from '@/components/home/EligibilityChecker'
import { TrainingPreview } from '@/components/home/TrainingPreview'
import { AchievementsPreview } from '@/components/home/AchievementsPreview'
import { BranchesPreview } from '@/components/home/BranchesPreview'

export default function HomePage() {
  return (
    <>
      <Seo page="home" />
      <HeroSection />
      <HighlightsSection />
      <GuaranteeBanner />
      <WhyChooseUs />
      <PopularCourses />
      <EligibilityChecker />
      <TrainingPreview />
      <AchievementsPreview />
      <BranchesPreview />
      <CTASection />
    </>
  )
}
