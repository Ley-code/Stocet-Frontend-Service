'use client'

import { NewsArticle } from '@/lib/api/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CategoryBadge } from './CategoryBadge'
import { SourceBadge } from './SourceBadge'
import { formatDate } from '@/lib/utils'
import { ExternalLink, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  article: NewsArticle
  onClick?: () => void
  className?: string
}

export function NewsCard({ article, onClick, className }: NewsCardProps) {
  const excerpt = article.summary || article.content.substring(0, 150) + '...'
  const publishedDate = new Date(article.published_date)

  return (
    <Card
      className={cn(
        'border-terminal-border bg-terminal-surface cursor-pointer transition-all hover:border-primary hover:bg-terminal-surface/80 hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      {article.image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.parentElement) {
                target.parentElement.style.display = 'none'
              }
            }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{article.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(publishedDate)}</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        </div>
        <div className="flex flex-wrap gap-2">
          {article.category && <CategoryBadge category={article.category} />}
          <SourceBadge source={article.source} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{excerpt}</p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
