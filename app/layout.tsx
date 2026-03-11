import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { SidebarProvider } from '@/lib/providers/SidebarProvider'
import { AuthProvider } from '@/lib/providers/AuthProvider'
import { AppLayout } from '@/components/layout/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stocet - Ethiopian Capital Markets Terminal',
  description: 'Ethiopian capital markets data terminal and education platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider>
              <AppLayout>{children}</AppLayout>
            </SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
