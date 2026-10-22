import { Seo } from '@/components/common/Seo'
import { CTASection } from '@/components/common/CTASection'
import { HeroSection } from '@/components/home/HeroSection'
import { GuaranteeBanner } from '@/components/home/GuaranteeBanner'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { PopularCourses } from '@/components/home/PopularCourses'
import { EligibilityChecker } from '@/components/home/EligibilityChecker'
import { TrainingPreview } from '@/components/home/TrainingPreview'
import { AchievementsPreview } from '@/components/home/AchievementsPreview'
import { BranchesPreview } from '@/components/home/BranchesPreview'
import { useQuickEnquiryOnScroll } from '@/components/home/QuickEnquiryPopup'

export default function HomePage() {
  useQuickEnquiryOnScroll()
  return (
    <>
      <Seo page="home" />
      <HeroSection />
      <WhyChooseUs />
      <GuaranteeBanner />
      <PopularCourses />
      <EligibilityChecker />
      <TrainingPreview />
      <AchievementsPreview />
      <BranchesPreview />
      <CTASection />
    </>
  )
}
