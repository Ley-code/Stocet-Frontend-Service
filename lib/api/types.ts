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

export interface NewsResponse {
  articles: NewsArticle[]
  total: number
  limit: number
  skip: number
}

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
