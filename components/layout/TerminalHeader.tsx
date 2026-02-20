'use client'

import { useEffect, useState } from 'react'
import { TickerTape } from './TickerTape'
import { formatTime } from '@/lib/utils'
import { stocksData } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function TerminalHeader() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Date | null>(null)
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed'>('open')

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setTime(now)
    const hour = now.getHours()
    setMarketStatus(hour >= 9 && hour < 16 ? 'open' : 'closed')

    const timer = setInterval(() => {
      const currentTime = new Date()
      setTime(currentTime)
      const currentHour = currentTime.getHours()
      setMarketStatus(currentHour >= 9 && currentHour < 16 ? 'open' : 'closed')
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate ESX index (simple average of top stocks)
  const esxIndex = stocksData.reduce((sum, stock) => sum + stock.lastPrice, 0) / stocksData.length
  const esxChange = stocksData.reduce((sum, stock) => sum + stock.change, 0) / stocksData.length
  const esxChangePercent = (esxChange / (esxIndex - esxChange)) * 100

  return (
    <div className="sticky top-0 z-50 border-b border-terminal-border bg-terminal-bg">
      <div className="flex h-12 items-center justify-between border-b border-terminal-border bg-terminal-surface px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                marketStatus === 'open' ? 'bg-success animate-pulse' : 'bg-muted-foreground'
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              Market {marketStatus === 'open' ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-muted-foreground">ESX Index: </span>
              <span className="font-mono-numeric font-semibold">{formatCurrency(esxIndex)}</span>
              <span
                className={`ml-2 font-mono-numeric text-xs ${
                  esxChange >= 0 ? 'text-success' : 'text-destructive'
                }`}
              >
                {esxChange >= 0 ? '+' : ''}
                {formatPercent(esxChangePercent)}
              </span>
            </div>
          </div>
        </div>
        <div className="font-mono-numeric text-xs text-muted-foreground">
          {mounted && time ? formatTime(time) : '--:--:--'}
        </div>
      </div>
      <TickerTape />
    </div>
  )
}
