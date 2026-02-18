'use client'

import { useState } from 'react'
import { brokersData } from '@/lib/mock-data'
import { BrokerCard } from '@/components/brokers/BrokerCard'
import { BrokerFilters } from '@/components/brokers/BrokerFilters'
import { BrokerDetailModal } from '@/components/brokers/BrokerDetailModal'
import { Broker } from '@/lib/mock-data'

export default function BrokersPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [clientTypeFilter, setClientTypeFilter] = useState('all')
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredBrokers = brokersData.filter((broker) => {
    const matchesType = typeFilter === 'all' || broker.type === typeFilter
    const matchesClientType =
      clientTypeFilter === 'all' || broker.clientType === clientTypeFilter
    return matchesType && matchesClientType
  })

  const handleBrokerClick = (broker: Broker) => {
    setSelectedBroker(broker)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brokers</h1>
        <p className="text-muted-foreground">Find licensed brokers and trading services</p>
      </div>
      <BrokerFilters
        typeFilter={typeFilter}
        clientTypeFilter={clientTypeFilter}
        onTypeFilterChange={setTypeFilter}
        onClientTypeFilterChange={setClientTypeFilter}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBrokers.map((broker) => (
          <BrokerCard key={broker.id} broker={broker} onClick={() => handleBrokerClick(broker)} />
        ))}
      </div>
      <BrokerDetailModal
        broker={selectedBroker}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
