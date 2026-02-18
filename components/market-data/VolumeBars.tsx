'use client'

import { generatePriceHistory } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '@/lib/utils'

interface VolumeBarsProps {
  symbol: string
}

export function VolumeBars({ symbol }: VolumeBarsProps) {
  const data = generatePriceHistory(symbol, 30)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
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
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => formatNumber(value)} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#151a20',
            border: '1px solid #1f2937',
            borderRadius: '4px',
          }}
          formatter={(value: number) => formatNumber(value)}
        />
        <Bar dataKey="volume" fill="#06b6d4" />
      </BarChart>
    </ResponsiveContainer>
  )
}
