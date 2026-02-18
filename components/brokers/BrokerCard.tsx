'use client'

import { Broker } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Building2, CheckCircle2 } from 'lucide-react'

interface BrokerCardProps {
  broker: Broker
  onClick: () => void
}

export function BrokerCard({ broker, onClick }: BrokerCardProps) {
  return (
    <Card
      className="cursor-pointer border-terminal-border bg-terminal-surface transition-colors hover:border-primary hover:bg-terminal-surface/80"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{broker.name}</CardTitle>
          </div>
          <Badge
            variant={broker.license === 'Active' ? 'default' : 'outline'}
            className="flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            {broker.license}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Type</div>
          <div className="text-sm font-medium">{broker.type}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Client Type</div>
          <div className="text-sm font-medium">{broker.clientType}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Minimum Account</div>
          <div className="font-mono-numeric text-sm font-medium">
            {formatCurrency(broker.minAccount)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Services</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {broker.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {broker.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{broker.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
