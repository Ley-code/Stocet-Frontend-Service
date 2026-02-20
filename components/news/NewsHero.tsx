'use client'

import { NewsArticle } from '@/lib/api/types'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryBadge } from './CategoryBadge'
import { SourceBadge } from './SourceBadge'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NewsHeroProps {
  article: NewsArticle
  onClick?: () => void
  className?: string
}

export function NewsHero({ article, onClick, className }: NewsHeroProps) {
  const publishedDate = new Date(article.published_date)
  const excerpt = article.summary || article.content.substring(0, 200) + '...'

  return (
    <Card
      className={cn(
        'border-terminal-border bg-terminal-surface cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-xl',
        className
      )}
      onClick={onClick}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {article.image_url && (
          <div className="relative h-64 md:h-full min-h-[300px] bg-muted overflow-hidden">
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
        <CardContent className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {article.category && <CategoryBadge category={article.category} />}
              <SourceBadge source={article.source} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock className="h-3 w-3" />
                <span>{formatDate(publishedDate)}</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2">{article.title}</h2>
            <p className="text-muted-foreground line-clamp-3 mb-4">{excerpt}</p>
          </div>
          <Button variant="outline" className="w-fit">
            Read More
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
