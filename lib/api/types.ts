// Core-service API Response wrapper
export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface NewsArticle {
  title: string
  url: string
  source: string
  published_date: string
  content: string
  summary?: string
  tags: string[]
  image_url?: string | null
  category?: string
}

export interface NewsResponseData {
  articles: NewsArticle[]
  total: number
  limit: number
  skip: number
}

export type NewsResponse = APIResponse<NewsResponseData>

export interface NewsFilters {
  q?: string
  category?: string
  source?: string
  start_date?: string
  end_date?: string
  limit?: number
  skip?: number
}

export const NEWS_CATEGORIES = [
  'Treasury Bills',
  'Capital Markets',
  'Macroeconomics',
  'Politics',
] as const

export const NEWS_SOURCES = [
  'Addis Fortune',
  'Capital Ethiopia',
  'Reuters',
] as const

export type NewsCategory = typeof NEWS_CATEGORIES[number]
export type NewsSource = typeof NEWS_SOURCES[number]

// Market Prices API Types
export interface MarketPrice {
  ticker_symbol: string
  price: number
  percent_change: number
  variation: number
  timestamp: string
  source: string
}

export interface MarketPriceListResponseData {
  prices: MarketPrice[]
  total: number
}

export type MarketPriceListResponse = APIResponse<MarketPriceListResponseData>

export interface TickerListResponseData {
  tickers: string[]
  total: number
}

export type TickerListResponse = APIResponse<TickerListResponseData>

export interface PriceHistoryResponseData {
  ticker_symbol: string
  prices: MarketPrice[]
  total: number
}

export type PriceHistoryResponse = APIResponse<PriceHistoryResponseData>

export interface PriceHistoryFilters {
  start_date?: string
  end_date?: string
}

export interface TechnicalIndicatorsResponseData {
  ticker_symbol: string
  period_days: number
  data_points: number
  sma_20: number | null
  ema_20: number | null
  rsi_14: number | null
  rsi_signal: string | null // "overbought", "oversold", "neutral"
  latest_price: number | null
  price_change: number | null
  price_change_percent: number | null
}

export type TechnicalIndicatorsResponse = APIResponse<TechnicalIndicatorsResponseData>

// Authentication types
export interface User {
  id: string
  email: string
  role: string
  subscription_status?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export type AuthResponseWrapper = APIResponse<AuthResponse>

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
}

