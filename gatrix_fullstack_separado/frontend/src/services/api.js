const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.message || 'Ocurrió un error al procesar la solicitud.')
    error.status = response.status
    error.details = payload.details
    throw error
  }
  return payload
}
