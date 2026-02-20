'use client'

import { useState, useEffect } from 'react'
import { useNews } from '@/lib/hooks/useNews'
import { NewsArticle, NewsFilters } from '@/lib/api/types'
import { NewsHero } from '@/components/news/NewsHero'
import { NewsList } from '@/components/news/NewsList'
import { NewsSearch } from '@/components/news/NewsSearch'
import { NewsFilters as NewsFiltersComponent } from '@/components/news/NewsFilters'
import { NewsDetail } from '@/components/news/NewsDetail'
import { NewsPagination } from '@/components/news/NewsPagination'
import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function NewsPage() {
  const { newsFilters, setNewsFilters, newsViewMode, setNewsViewMode } = useStore()
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filters: NewsFilters = {
    ...newsFilters,
    limit: newsFilters?.limit || 12,
    skip: newsFilters?.skip || 0,
  }

  const { data, isLoading, refetch, isRefetching } = useNews(filters)

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [refetch])

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setDetailOpen(true)
  }

  const handleSearchChange = (query: string) => {
    setNewsFilters({
      ...(newsFilters || {}),
      q: query || undefined,
      skip: 0,
    })
  }

  const handleFiltersChange = (newFilters: NewsFilters) => {
    setNewsFilters(newFilters)
  }

  const handlePaginationChange = (newFilters: NewsFilters) => {
    setNewsFilters(newFilters)
  }

  const featuredArticle = data?.articles[0]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Financial News</h1>
          <p className="text-muted-foreground">
            Stay informed with the latest Ethiopian capital markets news
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial News</h1>
          <p className="text-muted-foreground">
            Stay informed with the latest Ethiopian capital markets news
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            title="Refresh news"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={newsViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNewsViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={newsViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNewsViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <NewsSearch value={newsFilters?.q || ''} onChange={handleSearchChange} />

      {/* Featured Article */}
      {featuredArticle && !newsFilters?.q && !newsFilters?.category && (
        <NewsHero article={featuredArticle} onClick={() => handleArticleClick(featuredArticle)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <NewsFiltersComponent filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* News List */}
        <div className="lg:col-span-3 space-y-4">
          {data && data.total > 0 && (
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                {data.total} articles found
              </Badge>
              {isRefetching && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Updating...
                </span>
              )}
            </div>
          )}

          <NewsList
            filters={filters}
            onArticleClick={handleArticleClick}
            viewMode={newsViewMode}
          />

          {data && data.total > (filters.limit || 12) && (
            <NewsPagination
              filters={filters}
              total={data.total}
              onChange={handlePaginationChange}
            />
          )}
        </div>
      </div>

      {/* News Detail Modal */}
      <NewsDetail
        article={selectedArticle}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
