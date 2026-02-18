'use client'

import { useState } from 'react'
import { stocksData } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AlertForm() {
  const { addAlert } = useStore()
  const [symbol, setSymbol] = useState('')
  const [type, setType] = useState<'price' | 'volume'>('price')
  const [condition, setCondition] = useState<'above' | 'below'>('above')
  const [threshold, setThreshold] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (symbol && threshold) {
      addAlert({
        symbol,
        type,
        condition,
        threshold: Number(threshold),
      })
      setSymbol('')
      setThreshold('')
    }
  }

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Create Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                {stocksData.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alert Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as 'price' | 'volume')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Condition</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as 'above' | 'below')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Threshold</Label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={type === 'price' ? 'Price threshold' : 'Volume threshold'}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Alert
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
