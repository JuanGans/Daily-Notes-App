import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: number
  email: string
  role: 'ADMIN' | 'USER'
  iat: number
  exp: number
}

export function getCurrentUser(): DecodedToken | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded: DecodedToken = jwtDecode(token)
    return decoded
  } catch (err) {
    console.error('Invalid token:', err)
    return null
  }
}
