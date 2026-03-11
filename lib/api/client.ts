import {
  NewsResponse,
  NewsFilters,
  MarketPriceListResponse,
  TickerListResponse,
  MarketPrice,
  PriceHistoryResponse,
  PriceHistoryFilters,
  TechnicalIndicatorsResponse,
  APIResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8080'
const API_VERSION = process.env.NEXT_PUBLIC_CORE_API_VERSION || 'v1'

// Token storage key
const TOKEN_STORAGE_KEY = 'stocet_auth_token'

// Get stored auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

// Set auth token
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

// Clear auth token
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json()
  
  if (!response.ok) {
    // Handle structured error response from core-service
    const errorMessage = json.error || json.message || response.statusText
    throw new ApiError(
      errorMessage || `API Error: ${response.status}`,
      response.status,
      response.statusText
    )
  }

  // Core-service returns structured responses: {success, data, message}
  // For health check and other non-structured endpoints, return as-is
  if (response.url.includes('/health')) {
    return json as T
  }

  // For structured responses, validate and return the data
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    if (!json.success) {
      throw new ApiError(
        json.error || json.message || 'Request failed',
        response.status,
        response.statusText
      )
    }
    return json as T
  }

  // Fallback for non-structured responses
  return json as T
}

// Helper to get headers with auth token
function getHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

export async function fetchNews(filters: NewsFilters = {}): Promise<NewsResponse> {
  const params = new URLSearchParams()

  if (filters.q) params.append('q', filters.q)
  if (filters.category) params.append('category', filters.category)
  if (filters.source) params.append('source', filters.source)
  if (filters.start_date) params.append('start_date', filters.start_date)
  if (filters.end_date) params.append('end_date', filters.end_date)
  if (filters.limit) params.append('limit', filters.limit.toString())
  if (filters.skip) params.append('skip', filters.skip.toString())

  const url = `${API_BASE_URL}/api/${API_VERSION}/news${params.toString() ? `?${params.toString()}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true), // News endpoint requires authentication
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    return handleResponse<NewsResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle 401 Unauthorized - clear token and potentially redirect
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function fetchNewsHealth(): Promise<{ status: string }> {
  const url = `${API_BASE_URL}/health`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(false), // Health check doesn't require auth
    })

    return handleResponse<{ status: string }>(response)
  } catch (error) {
    throw new ApiError(
      `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Health Check Error'
    )
  }
}

// Market Prices API Functions
export async function fetchMarketPrices(): Promise<MarketPriceListResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/market-prices`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      next: { revalidate: 60 }, // Revalidate every minute (prices change frequently)
    })

    return handleResponse<MarketPriceListResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function fetchTickers(): Promise<TickerListResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/market-prices/tickers`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      next: { revalidate: 300 }, // Revalidate every 5 minutes (ticker list changes infrequently)
    })

    return handleResponse<TickerListResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function fetchTickerPrice(ticker: string): Promise<APIResponse<MarketPrice>> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/market-prices/${encodeURIComponent(ticker)}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      next: { revalidate: 60 }, // Revalidate every minute
    })

    return handleResponse<APIResponse<MarketPrice>>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function fetchPriceHistory(
  ticker: string,
  filters: PriceHistoryFilters = {}
): Promise<PriceHistoryResponse> {
  const params = new URLSearchParams()
  if (filters.start_date) params.append('start_date', filters.start_date)
  if (filters.end_date) params.append('end_date', filters.end_date)

  const url = `${API_BASE_URL}/api/${API_VERSION}/market-prices/${encodeURIComponent(ticker)}/history${params.toString() ? `?${params.toString()}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      next: { revalidate: 300 }, // Revalidate every 5 minutes (historical data changes less frequently)
    })

    return handleResponse<PriceHistoryResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function fetchTechnicalIndicators(
  ticker: string,
  periodDays: number = 30
): Promise<TechnicalIndicatorsResponse> {
  const params = new URLSearchParams()
  params.append('period_days', periodDays.toString())

  const url = `${API_BASE_URL}/api/${API_VERSION}/market-prices/${encodeURIComponent(ticker)}/indicators?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      next: { revalidate: 60 },
    })

    return handleResponse<TechnicalIndicatorsResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        clearAuthToken()
      }
      throw error
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

