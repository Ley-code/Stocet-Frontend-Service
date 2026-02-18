'use client'

import { stocksData } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PriceChart } from './PriceChart'
import { VolumeBars } from './VolumeBars'
import { OrderBook } from './OrderBook'
import { NewsPanel } from './NewsPanel'
import { StatCard } from '@/components/shared/StatCard'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StockDetailPanelProps {
  symbol: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockDetailPanel({ symbol, open, onOpenChange }: StockDetailPanelProps) {
  const stock = stocksData.find((s) => s.symbol === symbol)

  if (!stock) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono-numeric text-xl">{stock.symbol}</span>
            <span className="text-muted-foreground">{stock.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              title="52W High"
              value={stock.high52w}
              format="currency"
            />
            <StatCard
              title="52W Low"
              value={stock.low52w}
              format="currency"
            />
            <StatCard
              title="P/E Ratio"
              value={stock.pe}
              format="number"
            />
            <StatCard
              title="Market Cap"
              value={stock.marketCap}
              format="large"
            />
          </div>

          {/* Charts and Data */}
          <Tabs defaultValue="chart" className="w-full">
            <TabsList>
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <PriceChart symbol={stock.symbol} />
            </TabsContent>
            <TabsContent value="volume" className="mt-4">
              <VolumeBars symbol={stock.symbol} />
            </TabsContent>
            <TabsContent value="orderbook" className="mt-4">
              <OrderBook symbol={stock.symbol} />
            </TabsContent>
            <TabsContent value="news" className="mt-4">
              <NewsPanel symbol={stock.symbol} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
