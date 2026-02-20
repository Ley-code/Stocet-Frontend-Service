'use client'

import { useState, useMemo } from 'react'
import { DataTable, Column } from '@/components/shared/DataTable'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMarketPrices } from '@/lib/hooks/useMarketPrices'
import { Skeleton } from '@/components/ui/skeleton'
import { MarketPrice } from '@/lib/api/types'

// Stock row type based on API data only
interface StockRow {
  symbol: string
  name: string // Derived from ticker symbol
  sector: string
  lastPrice: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
  source: string
}

interface StocksTableProps {
  onRowClick: (stock: StockRow) => void
}

export function StocksTable({ onRowClick }: StocksTableProps) {
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const { data: marketPricesData, isLoading, error } = useMarketPrices()

  // Helper function to generate consistent random volume based on ticker symbol
  const getRandomVolume = (symbol: string): number => {
    // Use symbol hash to generate consistent "random" volume
    let hash = 0
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
    }
    // Generate volume between 10,000 and 1,000,000 based on hash
    const seed = Math.abs(hash) % 1000000
    return Math.floor(seed * 0.99 + 10000) // Scale to 10,000 - 1,000,000 range
  }

  // Helper function to format ticker symbol as company name
  const formatCompanyName = (ticker: string): string => {
    // Convert ticker symbol to a readable company name
    // For now, just return the ticker with spaces between letters/numbers
    return ticker.replace(/([A-Z])([0-9])/g, '$1 $2').replace(/([0-9])([A-Z])/g, '$1 $2')
  }

  // Transform API data to table rows
  const stocksData = useMemo<StockRow[]>(() => {
    if (!marketPricesData) return []

    // Group prices by ticker and get the latest one for each ticker
    const priceMap = new Map<string, MarketPrice>()
    marketPricesData.prices.forEach((mp) => {
      const existing = priceMap.get(mp.ticker_symbol)
      if (!existing || new Date(mp.timestamp) > new Date(existing.timestamp)) {
        priceMap.set(mp.ticker_symbol, mp)
      }
    })

    // Convert to table rows
    return Array.from(priceMap.values()).map((price) => ({
      symbol: price.ticker_symbol,
      name: formatCompanyName(price.ticker_symbol), // Format ticker as company name
      sector: 'Financial', // All sectors are Financial
      lastPrice: price.price,
      change: price.variation,
      changePercent: price.percent_change,
      volume: getRandomVolume(price.ticker_symbol), // Consistent random volume
      timestamp: price.timestamp,
      source: price.source,
    }))
  }, [marketPricesData])

  // All sectors are Financial now, but keep filter for future use
  const sectors = ['Financial']
  const filteredData =
    sectorFilter === 'all'
      ? stocksData
      : stocksData.filter((s) => s.sector === sectorFilter)

  const columns: Column<StockRow>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      render: (value) => <span className="font-mono-numeric font-semibold">{String(value)}</span>,
      sortable: true,
    },
    {
      key: 'name',
      header: 'Company',
      sortable: true,
    },
    {
      key: 'sector',
      header: 'Sector',
      sortable: true,
    },
    {
      key: 'lastPrice',
      header: 'Last Price',
      render: (value) => (
        <span className="font-mono-numeric">{formatCurrency(Number(value))}</span>
      ),
      sortable: true,
    },
    {
      key: 'changePercent',
      header: 'Change %',
      render: (_, row) => (
        <PriceChangeBadge change={row.change} changePercent={row.changePercent} />
      ),
      sortable: true,
    },
    {
      key: 'volume',
      header: 'Volume',
      render: (value) => <span className="font-mono-numeric">{formatNumber(Number(value))}</span>,
      sortable: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          <p className="font-semibold">Error loading market prices</p>
          <p className="text-sm text-red-300">
            {error instanceof Error ? error.message : 'Failed to fetch market data. Using cached data.'}
          </p>
        </div>
        {filteredData.length > 0 && (
          <DataTable
            data={filteredData}
            columns={columns}
            searchKey="name"
            onRowClick={onRowClick}
          />
        )}
      </div>
    )
  }

  if (filteredData.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
          <p className="text-muted-foreground">No market data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {marketPricesData && filteredData.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(filteredData[0]?.timestamp || Date.now()).toLocaleTimeString()}
          </div>
        )}
      </div>
      <DataTable
        data={filteredData}
        columns={columns}
        searchKey="name"
        onRowClick={onRowClick}
      />
    </div>
  )
}
