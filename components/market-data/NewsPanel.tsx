'use client'

import { generateNews } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NewsPanelProps {
  symbol: string
}

export function NewsPanel({ symbol }: NewsPanelProps) {
  const news = generateNews(symbol)

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b border-terminal-border pb-4 last:border-0">
            <h4 className="text-sm font-medium mb-1">{item.headline}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
