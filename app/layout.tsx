import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { TerminalHeader } from '@/components/layout/TerminalHeader'
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stocet - Ethiopian Capital Markets Terminal',
  description: 'Bloomberg-style Ethiopian capital markets data terminal and education platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <SidebarNav />
          <div className="flex flex-1 flex-col md:ml-64">
            <TerminalHeader />
            <main className="flex-1 overflow-y-auto bg-terminal-bg p-6">
              {children}
            </main>
          </div>
        </div>
        <KeyboardShortcuts />
      </body>
    </html>
  )
}
