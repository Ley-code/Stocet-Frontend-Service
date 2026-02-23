'use client'

import { useState, useMemo } from 'react'
import { ChartCard } from '@/components/shared/ChartCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useTickers, usePriceHistory } from '@/lib/hooks/useMarketPrices'
import {
  useTimeFilter,
  TIME_PERIODS,
  fillMissingDataPoints,
  tradingViewTickFormatter,
} from '@/lib/hooks/useTimeFilter'

export function ComparisonTool() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const { data: tickerData } = useTickers()
  const { period, setTimePeriod, dateRange } = useTimeFilter('1M')

  const tickers = tickerData?.tickers || []

  const handleAddStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol) && selectedStocks.length < 3) {
      setSelectedStocks([...selectedStocks, symbol])
    }
  }

  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol))
  }

  // Fetch price history for each selected stock
  const { data: history1, isLoading: loading1 } = usePriceHistory(
    selectedStocks[0] || null,
    { start_date: dateRange.start_date, end_date: dateRange.end_date },
    !!selectedStocks[0]
  )
  const { data: history2, isLoading: loading2 } = usePriceHistory(
    selectedStocks[1] || null,
    { start_date: dateRange.start_date, end_date: dateRange.end_date },
    !!selectedStocks[1]
  )
  const { data: history3, isLoading: loading3 } = usePriceHistory(
    selectedStocks[2] || null,
    { start_date: dateRange.start_date, end_date: dateRange.end_date },
    !!selectedStocks[2]
  )

  const isLoading = (selectedStocks[0] && loading1) || (selectedStocks[1] && loading2) || (selectedStocks[2] && loading3)

  // Fill missing data points for each stock, then merge by date
  const comparisonData = useMemo(() => {
    const histories = [history1, history2, history3]

    // Fill each stock independently
    const filledArrays = selectedStocks.map((_, idx) => {
      const raw = histories[idx]?.prices || []
      return fillMissingDataPoints(raw, period, dateRange)
    })

    if (filledArrays.length === 0) return []

    // Use the first stock's date array as the base (all should have same dates)
    const baseArray = filledArrays[0] || []
    return baseArray.map((point, i) => {
      const merged: Record<string, any> = { date: point.date }
      selectedStocks.forEach((symbol, idx) => {
        merged[symbol] = filledArrays[idx]?.[i]?.price ?? 0
      })
      return merged
    })
  }, [history1, history2, history3, selectedStocks, period, dateRange])

  const colors = ['#ff6b35', '#10b981', '#06b6d4']

  return (
    <ChartCard
      title="Stock Comparison"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {selectedStocks.length < 3 && (
            <Select onValueChange={handleAddStock}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Add stock" />
              </SelectTrigger>
              <SelectContent>
                {tickers
                  .filter((t) => !selectedStocks.includes(t))
                  .map((ticker) => (
                    <SelectItem key={ticker} value={ticker}>
                      {ticker}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          {selectedStocks.map((symbol) => (
            <div key={symbol} className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs">
              <span>{symbol}</span>
              <button
                onClick={() => handleRemoveStock(symbol)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      }
    >
      {selectedStocks.length > 0 && (
        <div className="mb-4 flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-1">
          {TIME_PERIODS.map((tp) => (
            <Button
              key={tp.value}
              variant={period === tp.value ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-3 text-xs font-medium ${period === tp.value
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setTimePeriod(tp.value)}
            >
              {tp.label}
            </Button>
          ))}
        </div>
      )}

      {selectedStocks.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Select up to 3 stocks to compare
        </div>
      ) : isLoading ? (
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm">Loading comparison data...</span>
          </div>
        </div>
      ) : comparisonData.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          <span className="text-sm">No data available for this period</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              stroke="#6b7280"
              fontSize={11}
              dataKey="date"
              tickFormatter={(value) => tradingViewTickFormatter(value, period, comparisonData as any)}
              interval="preserveEnd"
              minTickGap={50}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickFormatter={(value) => formatCurrency(value)}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#151a20',
                border: '1px solid #1f2937',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelFormatter={(value) => {
                const date = new Date(value)
                if (period === '1D') {
                  return date.toLocaleString('en-US', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                }
                return date.toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
            />
            <Legend />
            {selectedStocks.map((symbol, index) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                name={symbol}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
