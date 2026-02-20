import { useQuery } from '@tanstack/react-query'
import {
  fetchMarketPrices,
  fetchTickers,
  fetchTickerPrice,
  fetchPriceHistory,
  type PriceHistoryFilters,
} from '@/lib/api/marketPrices'

const MARKET_PRICE_STALE_TIME = 1 * 60 * 1000 // 1 minute (prices change frequently)
const TICKER_LIST_STALE_TIME = 5 * 60 * 1000 // 5 minutes (ticker list changes infrequently)
const PRICE_HISTORY_STALE_TIME = 5 * 60 * 1000 // 5 minutes (historical data changes less frequently)

/**
 * Hook to fetch all market prices
 * Auto-refreshes every minute to keep prices up-to-date
 */
export function useMarketPrices() {
  return useQuery({
    queryKey: ['marketPrices'],
    queryFn: () => fetchMarketPrices(),
    staleTime: MARKET_PRICE_STALE_TIME,
    refetchInterval: MARKET_PRICE_STALE_TIME, // Auto-refresh every minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

/**
 * Hook to fetch list of all ticker symbols
 */
export function useTickers() {
  return useQuery({
    queryKey: ['tickers'],
    queryFn: () => fetchTickers(),
    staleTime: TICKER_LIST_STALE_TIME,
    refetchInterval: TICKER_LIST_STALE_TIME,
  })
}

/**
 * Hook to fetch latest price for a specific ticker
 * @param ticker - The ticker symbol to fetch price for
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function useTickerPrice(ticker: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['tickerPrice', ticker],
    queryFn: () => fetchTickerPrice(ticker!),
    enabled: enabled && !!ticker,
    staleTime: MARKET_PRICE_STALE_TIME,
    refetchInterval: MARKET_PRICE_STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

/**
 * Hook to fetch price history for a specific ticker
 * @param ticker - The ticker symbol to fetch history for
 * @param filters - Optional date range filters
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function usePriceHistory(
  ticker: string | null,
  filters: PriceHistoryFilters = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['priceHistory', ticker, filters],
    queryFn: () => fetchPriceHistory(ticker!, filters),
    enabled: enabled && !!ticker,
    staleTime: PRICE_HISTORY_STALE_TIME,
    refetchInterval: PRICE_HISTORY_STALE_TIME,
  })
}
