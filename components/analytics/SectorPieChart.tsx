'use client'

import { stocksData } from '@/lib/mock-data'
import { ChartCard } from '@/components/shared/ChartCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#ff6b35', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6', '#f59e0b']

export function SectorPieChart() {
  const sectorData = stocksData.reduce((acc, stock) => {
    const existing = acc.find((s) => s.name === stock.sector)
    if (existing) {
      existing.value += stock.marketCap
    } else {
      acc.push({ name: stock.sector, value: stock.marketCap })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)

  return (
    <ChartCard title="Sector Distribution by Market Cap">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {sectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#151a20',
              border: '1px solid #1f2937',
              borderRadius: '4px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
