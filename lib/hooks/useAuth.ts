'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login as apiLogin, signup as apiSignup, logout as apiLogout, isAuthenticated as checkAuth } from '@/lib/api/auth'
import { getAuthToken } from '@/lib/api/client'
import type { AuthResponse, LoginRequest, SignupRequest } from '@/lib/api/types'

interface AuthState {
  user: AuthResponse['user'] | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check authentication status on mount
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      // Token exists, but we don't have user info yet
      // In a real app, you might want to fetch user info from a /me endpoint
      setAuthState({
        user: null, // Could fetch user info here
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiLogin(credentials)
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
      return response
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const signup = useCallback(async (credentials: SignupRequest) => {
    try {
      const response = await apiSignup(credentials)
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
      return response
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    router.push('/')
  }, [router])

  return {
    ...authState,
    login,
    signup,
    logout,
  }
}
