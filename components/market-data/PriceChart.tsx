'use client'

import { usePriceHistory } from '@/lib/hooks/useMarketPrices'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'

interface PriceChartProps {
  symbol: string
}

export function PriceChart({ symbol }: PriceChartProps) {
  // Fetch last 30 days of price history
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  const { data: historyData, isLoading, error } = usePriceHistory(
    symbol,
    {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    }
  )

  // Transform API data to chart format
  const data = useMemo(() => {
    if (!historyData) return []

    return historyData.prices
      .map((price) => ({
        date: new Date(price.timestamp).toISOString().split('T')[0],
        price: price.price,
        timestamp: price.timestamp,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [historyData])

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error || !data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-terminal-border bg-terminal-surface">
        <div className="text-center">
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'No price history available'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#151a20',
            border: '1px solid #1f2937',
            borderRadius: '4px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#ff6b35"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
