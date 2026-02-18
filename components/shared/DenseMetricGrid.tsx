'use client'

import { cn } from '@/lib/utils'
import { StatCard } from './StatCard'

interface Metric {
  title: string
  value: number | string
  change?: number
  changePercent?: number
  format?: 'currency' | 'number' | 'large'
  icon?: React.ReactNode
}

interface DenseMetricGridProps {
  metrics: Metric[]
  columns?: 2 | 3 | 4
  className?: string
}

export function DenseMetricGrid({ metrics, columns = 4, className }: DenseMetricGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {metrics.map((metric, index) => (
        <StatCard key={index} {...metric} />
      ))}
    </div>
  )
}
