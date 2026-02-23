'use client'

import { ChartCard } from '@/components/shared/ChartCard'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useMarketPrices } from '@/lib/hooks/useMarketPrices'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#ff6b35', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6']

export function SectorPieChart() {
  const { data, isLoading, isError } = useMarketPrices()

  const prices = data?.prices || []

  // Create price distribution data sorted by price descending
  const priceData = prices
    .map((p) => ({
      name: p.ticker_symbol,
      value: p.price,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <ChartCard title="Price Distribution by Ticker">
      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      ) : isError || priceData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          <span className="text-sm">No market data available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <XAxis
              type="number"
              stroke="#6b7280"
              fontSize={11}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              fontSize={11}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#151a20',
                border: '1px solid #1f2937',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
              }}

              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {priceData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
