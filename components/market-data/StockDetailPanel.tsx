'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PriceChart } from './PriceChart'
import { VolumeBars } from './VolumeBars'
import { OrderBook } from './OrderBook'
import { NewsPanel } from './NewsPanel'
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTickerPrice } from '@/lib/hooks/useMarketPrices'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { Skeleton } from '@/components/ui/skeleton'

interface StockDetailPanelProps {
  symbol: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper function to format ticker symbol as company name
const formatCompanyName = (ticker: string): string => {
  return ticker.replace(/([A-Z])([0-9])/g, '$1 $2').replace(/([0-9])([A-Z])/g, '$1 $2')
}

export function StockDetailPanel({ symbol, open, onOpenChange }: StockDetailPanelProps) {
  const { data: tickerPrice, isLoading: priceLoading } = useTickerPrice(symbol, open && !!symbol)

  if (!symbol) return null

  // Use API data
  const currentPrice = tickerPrice?.price ?? 0
  const priceChange = tickerPrice?.variation ?? 0
  const priceChangePercent = tickerPrice?.percent_change ?? 0
  const companyName = formatCompanyName(symbol)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono-numeric text-xl">{symbol}</span>
              <span className="text-muted-foreground">{companyName}</span>
            </div>
            <div className="flex items-center gap-4">
              {priceLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <span className="font-mono-numeric text-2xl font-bold">
                    {formatCurrency(currentPrice)}
                  </span>
                  <PriceChangeBadge change={priceChange} changePercent={priceChangePercent} />
                </>
              )}
            </div>
          </DialogTitle>
          {tickerPrice && (
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(tickerPrice.timestamp).toLocaleString()} • Source: {tickerPrice.source}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Charts and Data */}
          <Tabs defaultValue="chart" className="w-full">
            <TabsList>
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <PriceChart symbol={symbol} />
            </TabsContent>
            <TabsContent value="volume" className="mt-4">
              <VolumeBars symbol={symbol} />
            </TabsContent>
            <TabsContent value="orderbook" className="mt-4">
              <OrderBook symbol={symbol} />
            </TabsContent>
            <TabsContent value="news" className="mt-4">
              <NewsPanel symbol={symbol} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
