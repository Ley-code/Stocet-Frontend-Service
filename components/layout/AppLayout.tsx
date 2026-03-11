'use client'

import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/lib/providers/AuthProvider'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { TerminalHeader } from '@/components/layout/TerminalHeader'
import { MainContent } from '@/components/layout/MainContent'
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuthContext()

  // Don't show sidebar/header on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
        <div className="text-terminal-muted">Loading...</div>
      </div>
    )
  }

  if (isAuthPage || !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SidebarNav />
        <MainContent>
          <TerminalHeader />
          <main className="flex-1 overflow-y-auto bg-terminal-bg p-4 md:p-6">
            {children}
          </main>
        </MainContent>
      </div>
      <KeyboardShortcuts />
    </>
  )
}
