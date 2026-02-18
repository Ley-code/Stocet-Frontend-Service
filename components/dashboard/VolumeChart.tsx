'use client'

import { stocksData } from '@/lib/mock-data'
import { ChartCard } from '@/components/shared/ChartCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function VolumeChart() {
  // Generate last 7 days of volume data
  const volumeData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const totalVolume = stocksData.reduce((sum, stock) => {
      // Simulate daily volume variation
      const variation = 0.7 + Math.random() * 0.6
      return sum + stock.volume * variation
    }, 0)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: Math.floor(totalVolume),
    }
  })

  return (
    <ChartCard title="Market Volume (7 Days)">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={volumeData}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#151a20',
              border: '1px solid #1f2937',
              borderRadius: '4px',
            }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#volumeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
