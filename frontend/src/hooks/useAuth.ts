'use client'
// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { api, setSession, clearSession } from '@/lib/api'
import type { User, AuthResponse } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = Cookies.get('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    setSession(data.accessToken, data.refreshToken, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, institution?: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, institution })
    setSession(data.accessToken, data.refreshToken, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = Cookies.get('refreshToken')
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => {})
    }
    clearSession()
    setUser(null)
    router.push('/auth/login')
  }, [router])

  const isAdmin = user?.role === 'ADMIN'
  const isModerator = user?.role === 'MODERATOR' || user?.role === 'ADMIN'

  return { user, loading, login, register, logout, isAdmin, isModerator }
}
