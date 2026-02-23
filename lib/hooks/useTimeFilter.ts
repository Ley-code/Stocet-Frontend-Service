'use client'

import { useState, useCallback, useMemo } from 'react'
import type { MarketPrice } from '@/lib/api/types'

export type TimePeriod = '1D' | '5D' | '1M' | '6M' | '1Y'

export const TIME_PERIODS: { label: string; value: TimePeriod }[] = [
  { label: '1D', value: '1D' },
  { label: '5D', value: '5D' },
  { label: '1M', value: '1M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
]

export function getDateRange(period: TimePeriod): { start_date: string; end_date: string } {
  const now = new Date()
  const end = now.toISOString()

  const start = new Date(now)
  switch (period) {
    case '1D':
      start.setDate(start.getDate() - 1)
      break
    case '5D':
      start.setDate(start.getDate() - 5)
      break
    case '1M':
      start.setMonth(start.getMonth() - 1)
      break
    case '6M':
      start.setMonth(start.getMonth() - 6)
      break
    case '1Y':
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return { start_date: start.toISOString(), end_date: end }
}

/**
 * Format X-axis labels like TradingView / Yahoo Finance:
 * - 1D: show hours (09:00, 10:00, ...)
 * - 5D: show day abbreviations (Mon, Tue, ...)
 * - 1M: show day numbers, but label month boundaries
 * - 6M / 1Y: show month abbreviations (Jan, Feb, ...)
 */
export function formatXAxisLabel(value: string, period: TimePeriod): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return value

  switch (period) {
    case '1D':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    case '5D':
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    case '1M':
      // Show day number; month label handled via tick logic
      return date.getDate() === 1
        ? date.toLocaleDateString('en-US', { month: 'short' })
        : ''
    case '6M':
    case '1Y':
      // Label months only
      return date.toLocaleDateString('en-US', { month: 'short' })
    default:
      return ''
  }
}

/**
 * Determine whether to show a tick for this data point index.
 * We want uniform spacing, labelling months but not individual days.
 */
export function shouldShowTick(index: number, total: number, period: TimePeriod): boolean {
  if (period === '1D') {
    // Show every 2-3 hours
    return index % 3 === 0
  }
  if (period === '5D') {
    // One tick per day (~24 data points per day if hourly)
    return true
  }
  // For 1M, 6M, 1Y we just rely on interval / minTickGap
  return true
}

interface ChartDataPoint {
  date: string
  price: number
}

/**
 * Fill missing days with the last known price (or 0 if no data yet),
 * TradingView-style: one data point per day, all days in the range are present.
 *
 * For 1D: one data point per hour (24 points).
 * For other periods: one data point per day.
 */
export function fillMissingDataPoints(
  rawPrices: MarketPrice[],
  period: TimePeriod,
  dateRange: { start_date: string; end_date: string }
): ChartDataPoint[] {
  const start = new Date(dateRange.start_date)
  const end = new Date(dateRange.end_date)

  if (period === '1D') {
    return fillHourly(rawPrices, start, end)
  }
  return fillDaily(rawPrices, start, end)
}

function fillHourly(
  rawPrices: MarketPrice[],
  start: Date,
  end: Date
): ChartDataPoint[] {
  // Build a map: hour bucket → latest price in that hour
  const hourMap = new Map<string, number>()
  for (const p of rawPrices) {
    const d = new Date(p.timestamp)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`
    hourMap.set(key, p.price) // last write wins (latest in that hour)
  }

  const result: ChartDataPoint[] = []
  const cursor = new Date(start)
  cursor.setMinutes(0, 0, 0) // snap to hour
  let lastPrice = 0

  while (cursor <= end) {
    const key = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}T${pad(cursor.getHours())}:00`
    if (hourMap.has(key)) {
      lastPrice = hourMap.get(key)!
    }
    result.push({ date: cursor.toISOString(), price: lastPrice })
    cursor.setHours(cursor.getHours() + 1)
  }

  return result
}

function fillDaily(
  rawPrices: MarketPrice[],
  start: Date,
  end: Date
): ChartDataPoint[] {
  // Build a map: date string → latest price on that day
  const dayMap = new Map<string, number>()
  for (const p of rawPrices) {
    const d = new Date(p.timestamp)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    dayMap.set(key, p.price) // last write wins
  }

  const result: ChartDataPoint[] = []
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0) // snap to day start
  let lastPrice = 0

  while (cursor <= end) {
    const key = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`
    if (dayMap.has(key)) {
      lastPrice = dayMap.get(key)!
    }
    result.push({
      date: cursor.toISOString(),
      price: lastPrice,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/**
 * Format X-axis tick labels in TradingView style:
 * Only shows month names at month boundaries, everything else is blank.
 * For 1D, shows hours.
 */
export function tradingViewTickFormatter(value: string, period: TimePeriod, allData: ChartDataPoint[]): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''

  if (period === '1D') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  if (period === '5D') {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // For 1M, 6M, 1Y — only label month boundaries
  // Show the month name when the day is 1 or it's the first data point
  const idx = allData.findIndex((d) => d.date === value)
  if (idx === 0) {
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  if (idx > 0) {
    const prevDate = new Date(allData[idx - 1].date)
    if (date.getMonth() !== prevDate.getMonth()) {
      return date.toLocaleDateString('en-US', { month: 'short' })
    }
  }

  return ''
}

export function useTimeFilter(defaultPeriod: TimePeriod = '1M') {
  const [period, setPeriod] = useState<TimePeriod>(defaultPeriod)

  const dateRange = useMemo(() => getDateRange(period), [period])

  const setTimePeriod = useCallback((p: TimePeriod) => {
    setPeriod(p)
  }, [])

  return {
    period,
    setTimePeriod,
    dateRange,
  }
}
