'use client'

import { useState } from 'react'
import { stocksData } from '@/lib/mock-data'
import { DataTable, Column } from '@/components/shared/DataTable'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stock } from '@/lib/mock-data'

interface StocksTableProps {
  onRowClick: (stock: Stock) => void
}

export function StocksTable({ onRowClick }: StocksTableProps) {
  const [sectorFilter, setSectorFilter] = useState<string>('all')

  const sectors = Array.from(new Set(stocksData.map((s) => s.sector)))
  const filteredData =
    sectorFilter === 'all'
      ? stocksData
      : stocksData.filter((s) => s.sector === sectorFilter)

  const columns: Column<Stock>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      render: (value) => <span className="font-mono-numeric font-semibold">{String(value)}</span>,
      sortable: true,
    },
    {
      key: 'name',
      header: 'Company',
      sortable: true,
    },
    {
      key: 'sector',
      header: 'Sector',
      sortable: true,
    },
    {
      key: 'lastPrice',
      header: 'Last Price',
      render: (value) => (
        <span className="font-mono-numeric">{formatCurrency(Number(value))}</span>
      ),
      sortable: true,
    },
    {
      key: 'changePercent',
      header: 'Change %',
      render: (_, row) => (
        <PriceChangeBadge change={row.change} changePercent={row.changePercent} />
      ),
      sortable: true,
    },
    {
      key: 'volume',
      header: 'Volume',
      render: (value) => <span className="font-mono-numeric">{formatNumber(Number(value))}</span>,
      sortable: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={filteredData}
        columns={columns}
        searchKey="name"
        onRowClick={onRowClick}
      />
    </div>
  )
}
