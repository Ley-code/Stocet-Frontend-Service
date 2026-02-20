'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SourceBadgeProps {
  source: string
  className?: string
}

const sourceColors: Record<string, string> = {
  'Addis Fortune': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Capital Ethiopia': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Reuters': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const colorClass = sourceColors[source] || 'bg-muted text-muted-foreground border-terminal-border'

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', colorClass, className)}
    >
      {source}
    </Badge>
  )
}
