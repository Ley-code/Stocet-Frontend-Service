'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
}

const categoryColors: Record<string, string> = {
  'Treasury Bills': 'bg-primary/20 text-primary border-primary/30',
  'Capital Markets': 'bg-success/20 text-success border-success/30',
  'Macroeconomics': 'bg-accent/20 text-accent border-accent/30',
  'Politics': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || 'bg-muted text-muted-foreground border-terminal-border'

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', colorClass, className)}
    >
      {category}
    </Badge>
  )
}
