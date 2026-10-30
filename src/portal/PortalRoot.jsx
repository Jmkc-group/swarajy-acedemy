import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { Spinner } from './ui'

// Wraps every /portal, /admin and /student route with auth, and keeps them out of search results.
export default function PortalRoot() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  )
}
