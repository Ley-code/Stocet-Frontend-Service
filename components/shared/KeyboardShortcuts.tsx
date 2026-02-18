'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Search, LayoutDashboard, BarChart3, BookOpen, Building2, MessageSquare, Bell } from 'lucide-react'

interface Shortcut {
  key: string
  description: string
  action: () => void
  icon?: React.ReactNode
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const shortcuts: Shortcut[] = [
    { key: 'G D', description: 'Go to Dashboard', action: () => router.push('/'), icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'G M', description: 'Go to Market Data', action: () => router.push('/market-data'), icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'G A', description: 'Go to Analytics', action: () => router.push('/analytics'), icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'G E', description: 'Go to Education', action: () => router.push('/education'), icon: <BookOpen className="h-4 w-4" /> },
    { key: 'G B', description: 'Go to Brokers', action: () => router.push('/brokers'), icon: <Building2 className="h-4 w-4" /> },
    { key: 'G C', description: 'Go to Chat', action: () => router.push('/chat'), icon: <MessageSquare className="h-4 w-4" /> },
    { key: 'G L', description: 'Go to Alerts', action: () => router.push('/alerts'), icon: <Bell className="h-4 w-4" /> },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }

      // G key for navigation
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        const handleSecondKey = (e2: KeyboardEvent) => {
          const key = e2.key.toLowerCase()
          const shortcut = shortcuts.find((s) => s.key.split(' ')[1]?.toLowerCase() === key)
          if (shortcut) {
            e2.preventDefault()
            shortcut.action()
            setOpen(false)
          }
          document.removeEventListener('keydown', handleSecondKey)
        }
        document.addEventListener('keydown', handleSecondKey)
      }

      // Escape to close
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                shortcut.action()
                setOpen(false)
              }}
            >
              <div className="flex items-center gap-3">
                {shortcut.icon}
                <span>{shortcut.description}</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                {shortcut.key.split(' ').map((k, i) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    {k}
                  </span>
                ))}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded border bg-muted">Esc</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  )
}
