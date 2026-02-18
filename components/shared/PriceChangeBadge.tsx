'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/utils'

interface PriceChangeBadgeProps {
  change: number
  changePercent: number
  className?: string
}

export function PriceChangeBadge({ change, changePercent, className }: PriceChangeBadgeProps) {
  const isPositive = change >= 0
  const isNegative = change < 0

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-mono-numeric text-sm',
        isPositive && 'text-success',
        isNegative && 'text-destructive',
        className
      )}
    >
      {isPositive && <ArrowUp className="h-3 w-3" />}
      {isNegative && <ArrowDown className="h-3 w-3" />}
      <span>{formatPercent(changePercent)}</span>
      <span className="text-muted-foreground">({change >= 0 ? '+' : ''}{change.toFixed(2)})</span>
    </div>
  )
}
