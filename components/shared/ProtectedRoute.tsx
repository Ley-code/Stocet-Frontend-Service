'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/lib/providers/AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isAdmin } = useAuthContext()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requireAdmin && !isAdmin) {
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, requireAdmin, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
        <div className="text-terminal-muted">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terminal-foreground mb-2">Access Denied</h1>
          <p className="text-terminal-muted">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
