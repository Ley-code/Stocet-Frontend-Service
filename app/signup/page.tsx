'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SignupForm } from '@/components/auth/SignupForm'
import { useAuthContext } from '@/lib/providers/AuthProvider'

export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
        <div className="text-terminal-muted">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-terminal-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">STOCET</h1>
          <p className="text-terminal-muted">Ethiopian Capital Markets Terminal</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
