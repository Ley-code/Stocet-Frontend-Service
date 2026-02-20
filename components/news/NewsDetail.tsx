'use client'

import { NewsArticle } from '@/lib/api/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CategoryBadge } from './CategoryBadge'
import { SourceBadge } from './SourceBadge'
import { formatDate } from '@/lib/utils'
import { ExternalLink, Clock, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NewsDetailProps {
  article: NewsArticle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewsDetail({ article, open, onOpenChange }: NewsDetailProps) {
  if (!article) return null

  const publishedDate = new Date(article.published_date)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.content.substring(0, 200),
          url: article.url,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{article.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(publishedDate)}</span>
                </div>
                {article.category && <CategoryBadge category={article.category} />}
                <SourceBadge source={article.source} />
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(article.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-4">
            {article.image_url && (
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
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

            {article.summary && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Summary</p>
                <p className="text-sm text-muted-foreground">{article.summary}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{article.content}</div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-terminal-border">
                <span className="text-xs text-muted-foreground">Tags:</span>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-terminal-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(article.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Article on {article.source}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
