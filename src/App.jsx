import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LanguageProvider } from '@/context/LanguageContext'
import { Layout } from '@/components/layout/Layout'
import { LanguageModal } from '@/components/common/LanguageModal'
import { Toast } from '@/components/common/Toast'

// Route-level code splitting keeps the first load small.
const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const CoursesPage = lazy(() => import('@/pages/CoursesPage'))
const TrainingPage = lazy(() => import('@/pages/TrainingPage'))
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'))
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'))
const BranchesPage = lazy(() => import('@/pages/BranchesPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={200}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="training" element={<TrainingPage />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <LanguageModal />
          <Toast />
        </TooltipProvider>
      </MotionConfig>
    </LanguageProvider>
  )
}
