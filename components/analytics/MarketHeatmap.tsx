'use client'

import { stocksData } from '@/lib/mock-data'
import { ChartCard } from '@/components/shared/ChartCard'
import { formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function MarketHeatmap() {
  const getColor = (changePercent: number) => {
    if (changePercent > 2) return 'bg-success/80'
    if (changePercent > 0) return 'bg-success/40'
    if (changePercent > -2) return 'bg-destructive/40'
    return 'bg-destructive/80'
  }

  return (
    <ChartCard title="Market Heatmap">
      <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
        {stocksData.map((stock) => (
          <div
            key={stock.symbol}
            className={cn(
              'flex flex-col items-center justify-center rounded p-2 text-xs transition-transform hover:scale-110',
              getColor(stock.changePercent)
            )}
          >
            <div className="font-mono-numeric font-semibold">{stock.symbol}</div>
            <div className={cn(
              'font-mono-numeric text-[10px]',
              stock.changePercent >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {formatPercent(stock.changePercent)}
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
