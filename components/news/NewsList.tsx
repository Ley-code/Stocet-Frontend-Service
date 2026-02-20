'use client'

import { useNews } from '@/lib/hooks/useNews'
import { NewsCard } from './NewsCard'
import { NewsListSkeleton } from './NewsSkeleton'
import { NewsFilters } from '@/lib/api/types'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface NewsListProps {
  filters: NewsFilters
  onArticleClick?: (article: any) => void
  viewMode?: 'grid' | 'list'
}

export function NewsList({ filters, onArticleClick, viewMode = 'grid' }: NewsListProps) {
  const { data, isLoading, error, refetch } = useNews(filters)

  if (isLoading) {
    return <NewsListSkeleton count={filters.limit || 12} />
  }

  if (error) {
    return (
      <Card className="border-terminal-border bg-terminal-surface">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load news</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.articles.length === 0) {
    return (
      <Card className="border-terminal-border bg-terminal-surface">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No news articles found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
      }
    >
      {data.articles.map((article, index) => (
        <NewsCard
          key={`${article.url}-${index}`}
          article={article}
          onClick={() => onArticleClick?.(article)}
        />
      ))}
    </div>
  )
}
