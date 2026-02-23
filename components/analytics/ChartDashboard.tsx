'use client'

import { useState, useMemo } from 'react'
import { ChartCard } from '@/components/shared/ChartCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

export function ChartDashboard() {
  const { data: tickerData, isLoading: tickersLoading } = useTickers()
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')

  const { period, setTimePeriod, dateRange } = useTimeFilter('1M')

  const tickers = tickerData?.tickers || []
  const activeSymbol = selectedSymbol || tickers[0] || ''

  const { data: historyData, isLoading: historyLoading } = usePriceHistory(
    activeSymbol || null,
    { start_date: dateRange.start_date, end_date: dateRange.end_date },
    !!activeSymbol
  )

  // Fill missing days/hours with last known price (TradingView style)
  const chartData = useMemo(() => {
    const raw = historyData?.prices || []
    return fillMissingDataPoints(raw, period, dateRange)
  }, [historyData, period, dateRange])

  // Determine chart color based on price direction
  const isPositive = chartData.length >= 2
    ? chartData[chartData.length - 1].price >= chartData[0].price
    : true
  const chartColor = isPositive ? '#10b981' : '#ef4444'

  const isLoading = tickersLoading || historyLoading

  // Compute tick interval — for 1M/6M/1Y we show every N-th tick
  const tickInterval = useMemo(() => {
    if (period === '1D') return 2           // every 2 hours
    if (period === '5D') return 0           // show all (5 ticks)
    if (period === '1M') return 'preserveEnd'
    if (period === '6M') return 'preserveEnd'
    if (period === '1Y') return 'preserveEnd'
    return 'preserveStartEnd'
  }, [period])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={activeSymbol}
          onValueChange={(val) => setSelectedSymbol(val)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={tickersLoading ? 'Loading...' : 'Select stock'} />
          </SelectTrigger>
          <SelectContent>
            {tickers.map((ticker) => (
              <SelectItem key={ticker} value={ticker}>
                {ticker}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-surface p-1">
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
      </div>

      <ChartCard title={`${activeSymbol || 'Stock'} — Price History`}>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-sm">Loading chart data...</span>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            <span className="text-sm">No data available for this period</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => tradingViewTickFormatter(value, period, chartData)}
                interval={tickInterval as any}
                minTickGap={period === '1D' ? 30 : 50}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => formatCurrency(value)}
                domain={['auto', 'auto']}
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
                formatter={(value: number) => [formatCurrency(value), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, fill: chartColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  )
}
