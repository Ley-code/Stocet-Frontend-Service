'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NewsFilters } from '@/lib/api/types'

interface NewsPaginationProps {
  filters: NewsFilters
  total: number
  onChange: (filters: NewsFilters) => void
}

export function NewsPagination({ filters, total, onChange }: NewsPaginationProps) {
  const limit = filters.limit || 12
  const skip = filters.skip || 0
  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const goToPage = (page: number) => {
    onChange({
      ...filters,
      skip: (page - 1) * limit,
    })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} articles
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToPage(pageNum)}
                className="w-10"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
