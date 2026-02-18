'use client'

import { useState } from 'react'
import { StocksTable } from '@/components/market-data/StocksTable'
import { StockDetailPanel } from '@/components/market-data/StockDetailPanel'
import { useStore } from '@/lib/store'
import { Stock } from '@/lib/mock-data'

export default function MarketDataPage() {
  const { selectedStock, setSelectedStock } = useStore()
  const [detailOpen, setDetailOpen] = useState(false)

  const handleRowClick = (stock: Stock) => {
    setSelectedStock(stock.symbol)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Data</h1>
        <p className="text-muted-foreground">Browse all listed companies and stocks</p>
      </div>
      <StocksTable onRowClick={handleRowClick} />
      <StockDetailPanel
        symbol={selectedStock}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
