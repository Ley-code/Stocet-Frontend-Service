'use client'

import { useEffect, useState } from 'react'
import { stocksData } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'

export function TickerTape() {
  const [tickerItems, setTickerItems] = useState(stocksData)

  useEffect(() => {
    // Duplicate items for seamless scroll
    setTickerItems([...stocksData, ...stocksData])
  }, [])

  return (
    <div className="relative h-8 overflow-hidden border-b border-terminal-border bg-terminal-surface">
      <div className="absolute flex animate-ticker-scroll whitespace-nowrap">
        {tickerItems.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="mx-4 inline-flex items-center gap-3 px-4"
          >
            <span className="font-mono-numeric font-semibold text-foreground">
              {stock.symbol}
            </span>
            <span className="font-mono-numeric text-sm text-foreground">
              {formatCurrency(stock.lastPrice)}
            </span>
            <PriceChangeBadge change={stock.change} changePercent={stock.changePercent} />
          </div>
        ))}
      </div>
    </div>
  )
}
