'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceChangeBadge } from './PriceChangeBadge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber, formatLargeNumber } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  change?: number
  changePercent?: number
  format?: 'currency' | 'number' | 'large'
  className?: string
  icon?: React.ReactNode
}

export function StatCard({
  title,
  value,
  change,
  changePercent,
  format = 'number',
  className,
  icon,
}: StatCardProps) {
  const formattedValue =
    format === 'currency'
      ? formatCurrency(Number(value))
      : format === 'large'
      ? formatLargeNumber(Number(value))
      : formatNumber(Number(value))

  return (
    <Card className={cn('border-terminal-border bg-terminal-surface', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="font-mono-numeric text-2xl font-bold">{formattedValue}</div>
        {change !== undefined && changePercent !== undefined && (
          <div className="mt-2">
            <PriceChangeBadge change={change} changePercent={changePercent} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
