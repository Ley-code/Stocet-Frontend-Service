'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  BookOpen,
  Building2,
  MessageSquare,
  Bell,
  Newspaper,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  LogOut,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/lib/providers/SidebarProvider'
import { useAuthContext } from '@/lib/providers/AuthProvider'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/market-data', label: 'Market Data', icon: BarChart3 },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/education', label: 'Education', icon: BookOpen },
  { href: '/brokers', label: 'Brokers', icon: Building2 },
  { href: '/chat', label: 'Community Chat', icon: MessageSquare },
  { href: '/alerts', label: 'Alerts', icon: Bell },
]

const adminNavItems = [
  { href: '/admin/users', label: 'User Management', icon: Users },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  return (
    <>
      {/* ===== Mobile hamburger button ===== */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-3 top-2.5 z-[60] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* ===== Desktop sidebar ===== */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-terminal-border bg-terminal-surface transition-all duration-300 ease-in-out',
          sidebarWidth,
          'hidden md:block'
        )}
      >
        <SidebarContent
          pathname={pathname}
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          showCollapseButton
        />
      </aside>

      {/* ===== Mobile overlay sidebar ===== */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300',
              mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside
            className={cn(
              'fixed left-0 top-0 z-[58] h-screen w-64 border-r border-terminal-border bg-terminal-surface shadow-2xl transition-transform duration-300 ease-in-out',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <SidebarContent
              pathname={pathname}
              collapsed={false}
              onItemClick={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  )
}

interface SidebarContentProps {
  pathname: string
  collapsed: boolean
  onCollapse?: () => void
  showCollapseButton?: boolean
  onItemClick?: () => void
}

function SidebarContent({ pathname, collapsed, onCollapse, showCollapseButton, onItemClick }: SidebarContentProps) {
  const { user, isAdmin, logout } = useAuthContext()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-terminal-border',
        collapsed ? 'justify-center px-2' : 'px-6'
      )}>
        {collapsed ? (
          <span className="text-lg font-bold text-primary">S</span>
        ) : (
          <h1 className="text-xl font-bold text-primary">STOCET</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 space-y-1 overflow-y-auto', collapsed ? 'p-2' : 'p-4')}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-md text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className={cn('my-4 border-t border-terminal-border', collapsed ? 'mx-2' : 'mx-0')} />
            <div className={cn('mb-2 px-3 text-xs font-semibold uppercase text-terminal-muted', collapsed && 'hidden')}>
              Administration
            </div>
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center rounded-md text-sm font-medium transition-colors',
                    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-terminal-border p-4 space-y-2">
        {/* User Info */}
        {!collapsed && user && (
          <div className="mb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-terminal-foreground truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              ) : (
                <Badge variant="outline" className="text-terminal-muted">
                  User
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full text-muted-foreground hover:text-foreground hover:bg-muted',
            collapsed ? 'px-0 justify-center' : 'justify-start'
          )}
          onClick={logout}
        >
          <LogOut className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-2')} />
          {!collapsed && <span className="text-xs">Logout</span>}
        </Button>

        {showCollapseButton && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full text-muted-foreground hover:text-foreground',
              collapsed ? 'px-0' : ''
            )}
            onClick={onCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </div>
            )}
          </Button>
        )}
        {!collapsed && (
          <div className="text-xs text-muted-foreground pt-2">
            <div>Ethiopian Capital Markets</div>
            <div className="mt-1">Data Terminal</div>
          </div>
        )}
      </div>
    </div>
  )
}
