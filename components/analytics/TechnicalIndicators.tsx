'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generatePriceHistory, calculateSMA, calculateEMA, calculateRSI } from '@/lib/mock-data'

interface TechnicalIndicatorsProps {
  symbol: string
}

export function TechnicalIndicators({ symbol }: TechnicalIndicatorsProps) {
  const [showSMA, setShowSMA] = useState(false)
  const [showEMA, setShowEMA] = useState(false)
  const [showRSI, setShowRSI] = useState(false)

  const priceHistory = generatePriceHistory(symbol, 30)
  const prices = priceHistory.map((d) => d.price)
  const sma20 = calculateSMA(prices, 20)
  const ema20 = calculateEMA(prices, 20)
  const rsi = calculateRSI(prices, 14)

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showSMA ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowSMA(!showSMA)}
          >
            SMA (20)
          </Button>
          <Button
            variant={showEMA ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowEMA(!showEMA)}
          >
            EMA (20)
          </Button>
          <Button
            variant={showRSI ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowRSI(!showRSI)}
          >
            RSI (14)
          </Button>
        </div>
        {showSMA && (
          <div className="text-xs text-muted-foreground">
            SMA (20): {sma20.length > 0 ? sma20[sma20.length - 1].toFixed(2) : 'N/A'}
          </div>
        )}
        {showEMA && (
          <div className="text-xs text-muted-foreground">
            EMA (20): {ema20.length > 0 ? ema20[ema20.length - 1].toFixed(2) : 'N/A'}
          </div>
        )}
        {showRSI && (
          <div className="text-xs text-muted-foreground">
            RSI (14): {rsi.toFixed(2)}
            {rsi > 70 && <span className="ml-2 text-destructive">(Overbought)</span>}
            {rsi < 30 && <span className="ml-2 text-success">(Oversold)</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
