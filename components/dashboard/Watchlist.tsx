'use client'

import { useStore } from '@/lib/store'
import { stocksData } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PriceChangeBadge } from '@/components/shared/PriceChangeBadge'
import { formatCurrency } from '@/lib/utils'
import { X, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

export function Watchlist() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useStore()
  const [selectedSymbol, setSelectedSymbol] = useState('')

  const watchlistStocks = stocksData.filter((stock) => watchlist.includes(stock.symbol))
  const availableStocks = stocksData.filter((stock) => !watchlist.includes(stock.symbol))

  const handleAdd = () => {
    if (selectedSymbol) {
      addToWatchlist(selectedSymbol)
      setSelectedSymbol('')
    }
  }

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="Add..." />
              </SelectTrigger>
              <SelectContent>
                {availableStocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAdd} disabled={!selectedSymbol}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {watchlistStocks.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No stocks in watchlist. Add stocks to track them here.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Symbol</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Change</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlistStocks.map((stock) => (
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
