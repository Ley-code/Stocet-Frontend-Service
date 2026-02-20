'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function NewsSkeleton() {
  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-32 w-full bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted animate-pulse rounded" />
          <div className="h-3 w-full bg-muted animate-pulse rounded" />
          <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function NewsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsSkeleton key={i} />
      ))}
    </div>
  )
}
