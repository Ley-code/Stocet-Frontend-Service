'use client'

import { useState } from 'react'
import { stocksData, generatePriceHistory } from '@/lib/mock-data'
import { ChartCard } from '@/components/shared/ChartCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

export function ComparisonTool() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])

  const handleAddStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol) && selectedStocks.length < 3) {
      setSelectedStocks([...selectedStocks, symbol])
    }
  }

  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol))
  }

  // Generate comparison data
  const comparisonData: Array<Record<string, any>> = []
  const maxLength = Math.max(...selectedStocks.map((s) => generatePriceHistory(s, 30).length))

  for (let i = 0; i < maxLength; i++) {
    const dataPoint: Record<string, any> = { date: i }
    selectedStocks.forEach((symbol) => {
      const history = generatePriceHistory(symbol, 30)
      if (history[i]) {
        dataPoint[symbol] = history[i].price
      }
    })
    comparisonData.push(dataPoint)
  }

  const colors = ['#ff6b35', '#10b981', '#06b6d4']

  return (
    <ChartCard
      title="Stock Comparison"
      actions={
        <div className="flex items-center gap-2">
          {selectedStocks.length < 3 && (
            <Select onValueChange={handleAddStock}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Add stock" />
              </SelectTrigger>
              <SelectContent>
                {stocksData
                  .filter((s) => !selectedStocks.includes(s.symbol))
                  .map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      {stock.symbol}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          {selectedStocks.map((symbol, index) => (
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
      {selectedStocks.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Select up to 3 stocks to compare
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis stroke="#6b7280" fontSize={12} dataKey="date" />
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
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
