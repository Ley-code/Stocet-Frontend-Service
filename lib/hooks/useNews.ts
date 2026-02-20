import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { fetchNews, type NewsFilters, type NewsResponse } from '@/lib/api/news'

export function useNews(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => fetchNews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useNewsInfinite(filters: Omit<NewsFilters, 'skip'> = {}) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchNews({ ...filters, skip: pageParam, limit: filters.limit || 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.articles.length, 0)
      return totalLoaded < lastPage.total ? totalLoaded : undefined
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  })
}

export function useNewsCategories() {
  // Return static categories for now
  // In future, could fetch from API if available
  return {
    categories: ['Treasury Bills', 'Capital Markets', 'Macroeconomics', 'Politics'] as const,
  }
}

export function useNewsSources() {
  // Return static sources for now
  // In future, could fetch from API if available
  return {
    sources: ['Addis Fortune', 'Capital Ethiopia', 'Reuters'] as const,
  }
}
