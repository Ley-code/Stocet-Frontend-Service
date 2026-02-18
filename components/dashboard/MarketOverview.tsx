'use client'

import { stocksData } from '@/lib/mock-data'
import { DenseMetricGrid } from '@/components/shared/DenseMetricGrid'
import { TrendingUp, DollarSign, Activity } from 'lucide-react'

export function MarketOverview() {
  const totalMarketCap = stocksData.reduce((sum, stock) => sum + stock.marketCap, 0)
  const totalVolume = stocksData.reduce((sum, stock) => sum + stock.volume, 0)
  const activeStocks = stocksData.length
  const avgChange = stocksData.reduce((sum, stock) => sum + stock.changePercent, 0) / stocksData.length

  const metrics = [
    {
      title: 'Total Market Cap',
      value: totalMarketCap,
      format: 'large' as const,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Total Volume',
      value: totalVolume,
      format: 'large' as const,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Active Stocks',
      value: activeStocks,
      format: 'number' as const,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Avg Change',
      value: 0,
      change: 0,
      changePercent: avgChange,
      format: 'number' as const,
    },
  ]

  return <DenseMetricGrid metrics={metrics} columns={4} />
}
