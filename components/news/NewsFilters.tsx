'use client'

import { NewsFilters as NewsFiltersType } from '@/lib/api/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, Filter } from 'lucide-react'
import { NEWS_CATEGORIES, NEWS_SOURCES } from '@/lib/api/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NewsFiltersProps {
  filters: NewsFiltersType
  onChange: (filters: NewsFiltersType) => void
}

export function NewsFilters({ filters, onChange }: NewsFiltersProps) {
  const hasActiveFilters =
    !!filters.category || !!filters.source || !!filters.start_date || !!filters.end_date

  const handleFilterChange = (key: keyof NewsFiltersType, value: string | undefined) => {
    onChange({
      ...filters,
      [key]: value || undefined,
      skip: 0, // Reset pagination when filters change
    })
  }

  const clearFilters = () => {
    onChange({
      q: filters.q, // Keep search query
      limit: filters.limit,
      skip: 0,
    })
  }

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Category</Label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Source</Label>
            <Select
              value={filters.source || 'all'}
              onValueChange={(value) => handleFilterChange('source', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {NEWS_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Start Date</Label>
            <Input
              type="datetime-local"
              value={filters.start_date ? filters.start_date.substring(0, 16) : ''}
              onChange={(e) =>
                handleFilterChange('start_date', e.target.value ? `${e.target.value}:00` : undefined)
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">End Date</Label>
            <Input
              type="datetime-local"
              value={filters.end_date ? filters.end_date.substring(0, 16) : ''}
              onChange={(e) =>
                handleFilterChange('end_date', e.target.value ? `${e.target.value}:00` : undefined)
              }
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-terminal-border">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {filters.category && (
              <Badge variant="outline" className="text-xs">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.source && (
              <Badge variant="outline" className="text-xs">
                Source: {filters.source}
                <button
                  onClick={() => handleFilterChange('source', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.start_date && (
              <Badge variant="outline" className="text-xs">
                From: {new Date(filters.start_date).toLocaleDateString()}
                <button
                  onClick={() => handleFilterChange('start_date', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.end_date && (
              <Badge variant="outline" className="text-xs">
                To: {new Date(filters.end_date).toLocaleDateString()}
                <button
                  onClick={() => handleFilterChange('end_date', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
