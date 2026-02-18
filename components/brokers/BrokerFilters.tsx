'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BrokerFiltersProps {
  typeFilter: string
  clientTypeFilter: string
  onTypeFilterChange: (value: string) => void
  onClientTypeFilterChange: (value: string) => void
}

export function BrokerFilters({
  typeFilter,
  clientTypeFilter,
  onTypeFilterChange,
  onClientTypeFilterChange,
}: BrokerFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Full Service">Full Service</SelectItem>
          <SelectItem value="Discount">Discount</SelectItem>
        </SelectContent>
      </Select>
      <Select value={clientTypeFilter} onValueChange={onClientTypeFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by client type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          <SelectItem value="Retail">Retail</SelectItem>
          <SelectItem value="Institutional">Institutional</SelectItem>
          <SelectItem value="Both">Both</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
