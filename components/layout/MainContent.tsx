'use client'

import { useSidebar } from '@/lib/providers/SidebarProvider'
import { cn } from '@/lib/utils'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        'flex flex-1 flex-col transition-all duration-300 ease-in-out',
        // No margin on mobile (sidebar is overlay), margin on desktop
        collapsed ? 'md:ml-16' : 'md:ml-64'
      )}
    >
      {children}
    </div>
  )
}
