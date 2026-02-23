'use client'

import { ChartCard } from '@/components/shared/ChartCard'
import { formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useMarketPrices } from '@/lib/hooks/useMarketPrices'

export function MarketHeatmap() {
  const { data, isLoading, isError } = useMarketPrices()

  const getColor = (changePercent: number) => {
    if (changePercent > 2) return 'bg-success/80'
    if (changePercent > 0) return 'bg-success/40'
    if (changePercent > -2) return 'bg-destructive/40'
    return 'bg-destructive/80'
  }

  const prices = data?.prices || []

  return (
    <ChartCard title="Market Heatmap">
      {isLoading ? (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 animate-pulse flex-col items-center justify-center rounded bg-muted/30"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <span className="text-sm">Failed to load market data</span>
        </div>
      ) : prices.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <span className="text-sm">No market data available</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
          {prices.map((price) => (
            <div
              key={price.ticker_symbol}
              className={cn(
                'flex flex-col items-center justify-center rounded p-2 text-xs transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer',
                getColor(price.percent_change)
              )}
            >
              <div className="font-mono-numeric font-semibold">{price.ticker_symbol}</div>
              <div className={cn(
                'font-mono-numeric text-[10px]',
                price.percent_change >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatPercent(price.percent_change)}
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  )
}
