'use client'

import { useEffect, useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { useMarketPrices } from '@/lib/hooks/useMarketPrices'
import { MarketPrice } from '@/lib/api/types'

interface TickerItem {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function TickerTape() {
  const [mounted, setMounted] = useState(false)
  const { data: marketPricesData, isLoading } = useMarketPrices()

  // Transform API data to ticker items
  const tickerItems = useMemo<TickerItem[]>(() => {
    if (!marketPricesData) return []

    // Group prices by ticker and get the latest one for each ticker
    const priceMap = new Map<string, MarketPrice>()
    marketPricesData.prices.forEach((mp) => {
      const existing = priceMap.get(mp.ticker_symbol)
      if (!existing || new Date(mp.timestamp) > new Date(existing.timestamp)) {
        priceMap.set(mp.ticker_symbol, mp)
      }
    })

    // Convert to ticker items
    return Array.from(priceMap.values()).map((price) => ({
      symbol: price.ticker_symbol,
      price: price.price,
      change: price.variation,
      changePercent: price.percent_change,
    }))
  }, [marketPricesData])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="relative h-8 overflow-hidden border-b border-terminal-border bg-terminal-surface">
        <div className="flex items-center justify-center h-full">
          <div className="text-xs text-muted-foreground">Loading ticker...</div>
        </div>
      </div>
    )
  }

  if (tickerItems.length === 0) {
    return (
      <div className="relative h-8 overflow-hidden border-b border-terminal-border bg-terminal-surface">
        <div className="flex items-center justify-center h-full">
          <div className="text-xs text-muted-foreground">No market data available</div>
        </div>
      </div>
    )
  }

  // Duplicate items for seamless scroll
  const duplicatedItems = [...tickerItems, ...tickerItems]

  return (
    <div className="relative h-8 overflow-hidden border-b border-terminal-border bg-terminal-surface">
      <div className="absolute flex animate-ticker-scroll whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="mx-4 inline-flex items-center gap-3 px-4"
          >
            <span className="font-mono-numeric font-semibold text-foreground">
              {item.symbol}
            </span>
            <span className="font-mono-numeric text-sm text-foreground">
              {formatCurrency(item.price)}
            </span>
            <PriceChangeBadge change={item.change} changePercent={item.changePercent} />
          </div>
        ))}
      </div>
    </div>
  )
}
