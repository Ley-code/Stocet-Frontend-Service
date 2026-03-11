'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth as useAuthHook } from '@/lib/hooks/useAuth'
import type { User, LoginRequest, SignupRequest, AuthResponse } from '@/lib/api/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (credentials: LoginRequest) => Promise<AuthResponse>
  signup: (credentials: SignupRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const authHook = useAuthHook()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Update user state when auth hook state changes
  useEffect(() => {
    setUser(authHook.user)
    setIsAdmin(authHook.user?.role === 'admin')
  }, [authHook.user, authHook.token])

  const login = async (credentials: LoginRequest) => {
    const response = await authHook.login(credentials)
    setUser(response.user)
    setIsAdmin(response.user.role === 'admin')
    router.push('/')
    return response
  }

  const signup = async (credentials: SignupRequest) => {
    const response = await authHook.signup(credentials)
    setUser(response.user)
    setIsAdmin(response.user.role === 'admin')
    router.push('/')
    return response
  }

  const logout = async () => {
    await authHook.logout()
    setUser(null)
    setIsAdmin(false)
    router.push('/login')
  }

  const refreshUser = () => {
    // This can be used to refresh user data if needed
    // For now, we rely on the token being valid
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token: authHook.token,
        isAuthenticated: authHook.isAuthenticated,
        isLoading: authHook.isLoading,
        isAdmin,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
