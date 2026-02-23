'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => { },
  toggleCollapsed: () => { },
})

export function useSidebar() {
  return useContext(SidebarContext)
}

/**
 * Breakpoints:
 * - < 768px  (md): mobile — sidebar is an overlay hamburger menu
 * - 768–1024px (md–lg): desktop — sidebar auto-collapses to icon-only
 * - > 1024px (lg): desktop — sidebar is full width with labels
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), [])

  // Auto-collapse/expand based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 768 && width < 1024) {
        // Intermediate desktop: auto-collapse
        setCollapsed(true)
      } else if (width >= 1024) {
        // Wide desktop: auto-expand
        setCollapsed(false)
      }
    }

    handleResize() // run on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
