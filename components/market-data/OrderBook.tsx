'use client'

import { generateOrderBook } from '@/lib/mock-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OrderBookProps {
  symbol: string
}

export function OrderBook({ symbol }: OrderBookProps) {
  const { bids, asks } = generateOrderBook(symbol)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border-terminal-border bg-terminal-surface">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-success">Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono-numeric text-xs text-success">
                    {formatCurrency(bid.price)}
                  </TableCell>
                  <TableCell className="font-mono-numeric text-xs">
                    {formatNumber(bid.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-terminal-border bg-terminal-surface">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-destructive">Asks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asks.map((ask, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono-numeric text-xs text-destructive">
                    {formatCurrency(ask.price)}
                  </TableCell>
                  <TableCell className="font-mono-numeric text-xs">
                    {formatNumber(ask.quantity)}
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
