'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTickers, useTechnicalIndicators } from '@/lib/hooks/useMarketPrices'
import { cn } from '@/lib/utils'

export function TechnicalIndicators() {
  const { data: tickerData } = useTickers()
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')
  const [showSMA, setShowSMA] = useState(true)
  const [showEMA, setShowEMA] = useState(true)
  const [showRSI, setShowRSI] = useState(true)

  const tickers = tickerData?.tickers || []
  const activeSymbol = selectedSymbol || tickers[0] || ''

  const { data: indicators, isLoading, isError } = useTechnicalIndicators(
    activeSymbol || null,
    30,
    !!activeSymbol
  )

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Technical Indicators</CardTitle>
          <Select
            value={activeSymbol}
            onValueChange={(val) => setSelectedSymbol(val)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ticker" />
            </SelectTrigger>
            <SelectContent>
              {tickers.map((ticker) => (
                <SelectItem key={ticker} value={ticker}>
                  {ticker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 animate-spin rounded-full border border-accent border-t-transparent" />
            Loading indicator data...
          </div>
        ) : isError ? (
          <div className="text-xs text-muted-foreground">Failed to load indicators</div>
        ) : !indicators || indicators.data_points === 0 ? (
          <div className="text-xs text-muted-foreground">No price data available for indicators</div>
        ) : (
          <div className="space-y-2">
            {/* Price summary */}
            {indicators.latest_price != null && (
              <div className="flex items-center justify-between rounded bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Latest Price</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-numeric font-semibold">
                    {indicators.latest_price.toFixed(2)} ETB
                  </span>
                  {indicators.price_change != null && (
                    <span className={cn(
                      'font-mono-numeric text-[10px]',
                      indicators.price_change >= 0 ? 'text-success' : 'text-destructive'
                    )}>
                      {indicators.price_change >= 0 ? '+' : ''}{indicators.price_change.toFixed(2)}
                      ({indicators.price_change_percent?.toFixed(2)}%)
                    </span>
                  )}
                </div>
              </div>
            )}

            {showSMA && (
              <div className="flex items-center justify-between rounded bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">SMA (20)</span>
                <span className="font-mono-numeric font-medium">
                  {indicators.sma_20 != null ? indicators.sma_20.toFixed(2) : 'Insufficient data'}
                </span>
              </div>
            )}
            {showEMA && (
              <div className="flex items-center justify-between rounded bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">EMA (20)</span>
                <span className="font-mono-numeric font-medium">
                  {indicators.ema_20 != null ? indicators.ema_20.toFixed(2) : 'Insufficient data'}
                </span>
              </div>
            )}
            {showRSI && (
              <div className="flex items-center justify-between rounded bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">RSI (14)</span>
                <span className="font-mono-numeric font-medium">
                  {indicators.rsi_14 != null ? (
                    <>
                      {indicators.rsi_14.toFixed(2)}
                      {indicators.rsi_signal === 'overbought' && (
                        <span className="ml-2 text-destructive">(Overbought)</span>
                      )}
                      {indicators.rsi_signal === 'oversold' && (
                        <span className="ml-2 text-success">(Oversold)</span>
                      )}
                      {indicators.rsi_signal === 'neutral' && (
                        <span className="ml-2 text-muted-foreground">(Neutral)</span>
                      )}
                    </>
                  ) : 'Insufficient data'}
                </span>
              </div>
            )}

            <div className="pt-1 text-[10px] text-muted-foreground/50">
              Based on {indicators.data_points} data points over {indicators.period_days} days
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
