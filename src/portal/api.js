const KEY = 'swa_portal_token'

export const getToken = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    /* storage blocked — session just won't persist */
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function request(method, url, { body, raw, headers } = {}) {
  const token = getToken()
  const res = await fetch(`/api${url}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined && !raw ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token && !url.startsWith('/auth/login')) {
      setToken(null)
      window.dispatchEvent(new Event('swa-logout'))
    }
    throw new ApiError(res.status, data.error || 'Request failed.')
  }
  return data
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body = {}) => request('POST', url, { body }),
  put: (url, body = {}) => request('PUT', url, { body }),
  patch: (url, body = {}) => request('PATCH', url, { body }),
  del: (url) => request('DELETE', url),
  upload: (url, file) =>
    request('POST', url, { body: file, raw: true, headers: { 'x-file-name': encodeURIComponent(file.name) } }),
}

export const fileUrl = (name) => `/api/files/${encodeURIComponent(name)}?t=${encodeURIComponent(getToken() ?? '')}`
