'use client'

import { stocksData } from '@/lib/mock-data'
import { StatCard } from '@/components/shared/StatCard'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function IndexSummary() {
  // Calculate ESX index
  const esxIndex = stocksData.reduce((sum, stock) => sum + stock.lastPrice, 0) / stocksData.length
  const esxChange = stocksData.reduce((sum, stock) => sum + stock.change, 0) / stocksData.length
  const esxChangePercent = (esxChange / (esxIndex - esxChange)) * 100

  // Calculate sector indices
  const sectors = ['Financial Services', 'Transportation', 'Telecommunications', 'Construction']
  const sectorIndices = sectors.map((sector) => {
    const sectorStocks = stocksData.filter((s) => s.sector === sector)
    if (sectorStocks.length === 0) return null
    const avgPrice = sectorStocks.reduce((sum, s) => sum + s.lastPrice, 0) / sectorStocks.length
    const avgChange = sectorStocks.reduce((sum, s) => sum + s.change, 0) / sectorStocks.length
    const avgChangePercent = (avgChange / (avgPrice - avgChange)) * 100
    return {
      name: sector,
      index: avgPrice,
      change: avgChange,
      changePercent: avgChangePercent,
    }
  }).filter(Boolean)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">ESX Index</h3>
        <StatCard
          title="ESX"
          value={esxIndex}
          change={esxChange}
          changePercent={esxChangePercent}
          format="currency"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Sector Indices</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sectorIndices.map((sector) => (
            <StatCard
              key={sector!.name}
              title={sector!.name}
              value={sector!.index}
              change={sector!.change}
              changePercent={sector!.changePercent}
              format="currency"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
