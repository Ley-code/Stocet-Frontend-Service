import stocksData from '@/data/stocks.json'
import brokersData from '@/data/brokers.json'
import lessonsData from '@/data/lessons.json'
import messagesData from '@/data/messages.json'
import alertsData from '@/data/alerts.json'

export type Stock = typeof stocksData[0]
export type Broker = typeof brokersData[0]
export type Course = typeof lessonsData.courses[0]
export type Lesson = typeof lessonsData.courses[0]['lessons'][0]
export type Message = typeof messagesData.channels[0]['messages'][0]
export type Alert = typeof alertsData[0]

// Generate mock price history data
export function generatePriceHistory(symbol: string, days: number = 30): Array<{ date: string; price: number; volume: number }> {
  const stock = stocksData.find(s => s.symbol === symbol)
  if (!stock) return []
  
  const history: Array<{ date: string; price: number; volume: number }> = []
  let currentPrice = stock.lastPrice * 0.9 // Start 10% below current
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.45) * 2
    currentPrice = Math.max(currentPrice + change, stock.low52w)
    currentPrice = Math.min(currentPrice, stock.high52w)
    
    const volume = Math.floor(stock.volume * (0.5 + Math.random()))
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      volume,
    })
  }
  
  return history
}

// Generate mock order book data
export function generateOrderBook(symbol: string) {
  const stock = stocksData.find(s => s.symbol === symbol)
  if (!stock) return { bids: [], asks: [] }
  
  const bids: Array<{ price: number; quantity: number }> = []
  const asks: Array<{ price: number; quantity: number }> = []
  
  const spread = stock.lastPrice * 0.001 // 0.1% spread
  
  // Generate bids (below current price)
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: Number((stock.lastPrice - spread * (i + 1)).toFixed(2)),
      quantity: Math.floor(Math.random() * 5000) + 1000,
    })
  }
  
  // Generate asks (above current price)
  for (let i = 0; i < 10; i++) {
    asks.push({
      price: Number((stock.lastPrice + spread * (i + 1)).toFixed(2)),
      quantity: Math.floor(Math.random() * 5000) + 1000,
    })
  }
  
  return { bids: bids.reverse(), asks }
}

// Generate mock news headlines
export function generateNews(symbol: string): Array<{ headline: string; time: string; source: string }> {
  const stock = stocksData.find(s => s.symbol === symbol)
  if (!stock) return []
  
  const news = [
    {
      headline: `${stock.name} Reports Strong Q4 Earnings`,
      time: '2 hours ago',
      source: 'ESX News',
    },
    {
      headline: `Analysts Upgrade ${stock.symbol} Price Target`,
      time: '5 hours ago',
      source: 'Market Watch',
    },
    {
      headline: `${stock.name} Announces Expansion Plans`,
      time: '1 day ago',
      source: 'Business Daily',
    },
  ]
  
  return news
}

// Calculate technical indicators (mock)
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = []
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    sma.push(sum / period)
  }
  return sma
}

export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  
  // Start with SMA
  const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  ema.push(sma)
  
  for (let i = period; i < prices.length; i++) {
    const value = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
    ema.push(value)
  }
  
  return ema
}

export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50
  
  const changes = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }
  
  const gains = changes.filter(c => c > 0)
  const losses = changes.filter(c => c < 0).map(c => Math.abs(c))
  
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0
  
  if (avgLoss === 0) return 100
  
  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))
  
  return Number(rsi.toFixed(2))
}

export { stocksData, brokersData, lessonsData, messagesData, alertsData }
