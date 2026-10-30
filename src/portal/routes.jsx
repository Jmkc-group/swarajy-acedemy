import { lazy } from 'react'
import { Route } from 'react-router-dom'
import {
  BookOpenCheck, CalendarCheck, FileText, IndianRupee, LayoutDashboard, ListChecks, Megaphone,
  PencilLine, Settings, Trophy, Users, Library,
} from 'lucide-react'
import PortalRoot from './PortalRoot'
import { PortalShell } from './PortalShell'

const PortalLogin = lazy(() => import('./PortalLogin'))
const SettingsPage = lazy(() => import('./SettingsPage'))

const AdminDashboard = lazy(() => import('./admin/Dashboard'))
const Students = lazy(() => import('./admin/Students'))
const StudentDetail = lazy(() => import('./admin/StudentDetail'))
const Attendance = lazy(() => import('./admin/Attendance'))
const Fees = lazy(() => import('./admin/Fees'))
const Notes = lazy(() => import('./admin/Notes'))
const Questions = lazy(() => import('./admin/Questions'))
const Tests = lazy(() => import('./admin/Tests'))
const TestResults = lazy(() => import('./admin/TestResults'))
const Announcements = lazy(() => import('./admin/Announcements'))
const Courses = lazy(() => import('./admin/Courses'))

const StudentDashboard = lazy(() => import('./student/Dashboard'))
const StudentNotes = lazy(() => import('./student/Notes'))
const Practice = lazy(() => import('./student/Practice'))
const StudentTests = lazy(() => import('./student/Tests'))
const TakeTest = lazy(() => import('./student/TakeTest'))
const ResultsList = lazy(() => import('./student/Results').then((m) => ({ default: m.ResultsList })))
const ResultDetail = lazy(() => import('./student/Results').then((m) => ({ default: m.ResultDetail })))
const MyAttendance = lazy(() => import('./student/AttendanceFees').then((m) => ({ default: m.MyAttendance })))
const MyFees = lazy(() => import('./student/AttendanceFees').then((m) => ({ default: m.MyFees })))

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/admin/fees', label: 'Fees', icon: IndianRupee },
  { to: '/admin/notes', label: 'Notes', icon: FileText },
  { to: '/admin/questions', label: 'Question bank', icon: PencilLine },
  { to: '/admin/tests', label: 'Tests', icon: BookOpenCheck },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/courses', label: 'Courses', icon: Library },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const STUDENT_NAV = [
  { to: '/student', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/student/notes', label: 'Notes', icon: FileText },
  { to: '/student/practice', label: 'Practice', icon: ListChecks },
  { to: '/student/tests', label: 'Tests', icon: BookOpenCheck },
  { to: '/student/results', label: 'Results', icon: Trophy },
  { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/student/fees', label: 'Fees', icon: IndianRupee },
  { to: '/student/settings', label: 'Settings', icon: Settings },
]

export const portalRoutes = (
  <Route element={<PortalRoot />}>
    <Route path="portal" element={<PortalLogin />} />
    <Route path="admin" element={<PortalShell role="admin" nav={ADMIN_NAV} />}>
      <Route index element={<AdminDashboard />} />
      <Route path="students" element={<Students />} />
      <Route path="students/:id" element={<StudentDetail />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="fees" element={<Fees />} />
      <Route path="notes" element={<Notes />} />
      <Route path="questions" element={<Questions />} />
      <Route path="tests" element={<Tests />} />
      <Route path="tests/:id/results" element={<TestResults />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="courses" element={<Courses />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="student" element={<PortalShell role="student" nav={STUDENT_NAV} />}>
      <Route index element={<StudentDashboard />} />
      <Route path="notes" element={<StudentNotes />} />
      <Route path="practice" element={<Practice />} />
      <Route path="tests" element={<StudentTests />} />
      <Route path="tests/:id" element={<TakeTest />} />
      <Route path="results" element={<ResultsList />} />
      <Route path="results/:id" element={<ResultDetail />} />
      <Route path="attendance" element={<MyAttendance />} />
      <Route path="fees" element={<MyFees />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>
)
