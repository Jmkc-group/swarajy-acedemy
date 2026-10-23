import { lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LanguageProvider } from '@/context/LanguageContext'
import { Layout } from '@/components/layout/Layout'
import { LanguageModal } from '@/components/common/LanguageModal'
import { Toast } from '@/components/common/Toast'

// Route-level code splitting keeps the first load small.
const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AcademicsPage = lazy(() => import('@/pages/AcademicsPage'))
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'))
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'))
const BranchesPage = lazy(() => import('@/pages/BranchesPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Keeps ?course=<id> so old deep links still open the course dialog.
function LegacyRedirect({ hash }) {
  const { search } = useLocation()
  return <Navigate replace to={{ pathname: '/academics', search, hash }} />
}

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={200}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="academics" element={<AcademicsPage />} />
              {/* Old URLs now live on the combined Academics page */}
              <Route path="courses" element={<LegacyRedirect hash="#courses" />} />
              <Route path="training" element={<LegacyRedirect hash="#training" />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="alumni" element={<AchievementsPage />} />
              <Route path="achievements" element={<Navigate replace to="/alumni" />} />
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
