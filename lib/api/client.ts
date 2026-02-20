import { NewsResponse, NewsFilters } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://localhost:8000'
const API_VERSION = process.env.NEXT_PUBLIC_NEWS_API_VERSION || 'v1'

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
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new ApiError(
      errorText || `API Error: ${response.status}`,
      response.status,
      response.statusText
    )
  }

  return response.json()
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
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    return handleResponse<NewsResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
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
      headers: {
        'Accept': 'application/json',
      },
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
