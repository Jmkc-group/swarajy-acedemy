import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('swa-logout', onLogout)
    if (getToken()) {
      api
        .get('/auth/me')
        .then((d) => setUser(d.user))
        .catch(() => setToken(null))
        .finally(() => setLoading(false))
    }
    return () => window.removeEventListener('swa-logout', onLogout)
  }, [])

  const login = useCallback(async (loginId, password) => {
    const d = await api.post('/auth/login', { loginId, password })
    setToken(d.token)
    setUser(d.user)
    return d.user
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
