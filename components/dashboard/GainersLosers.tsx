'use client'

import { stocksData } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function GainersLosers() {
  const sortedByGain = [...stocksData].sort((a, b) => b.changePercent - a.changePercent)
  const topGainers = sortedByGain.slice(0, 5)
  const topLosers = sortedByGain.slice(-5).reverse()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border-terminal-border bg-terminal-surface">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-success">Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Symbol</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topGainers.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-mono-numeric font-semibold text-xs">
                    {stock.symbol}
                  </TableCell>
                  <TableCell className="font-mono-numeric text-xs">
                    {formatCurrency(stock.lastPrice)}
                  </TableCell>
                  <TableCell>
                    <PriceChangeBadge change={stock.change} changePercent={stock.changePercent} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-terminal-border bg-terminal-surface">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-destructive">Top Losers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Symbol</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLosers.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-mono-numeric font-semibold text-xs">
                    {stock.symbol}
                  </TableCell>
                  <TableCell className="font-mono-numeric text-xs">
                    {formatCurrency(stock.lastPrice)}
                  </TableCell>
                  <TableCell>
                    <PriceChangeBadge change={stock.change} changePercent={stock.changePercent} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
