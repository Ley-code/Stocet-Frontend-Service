'use client'

import { Broker } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle2, Phone, Mail, Globe } from 'lucide-react'

interface BrokerDetailModalProps {
  broker: Broker | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrokerDetailModal({ broker, open, onOpenChange }: BrokerDetailModalProps) {
  if (!broker) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-2xl">{broker.name}</DialogTitle>
            <Badge
              variant={broker.license === 'Active' ? 'default' : 'outline'}
              className="flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              {broker.license}
            </Badge>
          </div>
          <DialogDescription>{broker.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-2">Services Offered</div>
            <div className="flex flex-wrap gap-2">
              {broker.services.map((service, index) => (
                <Badge key={index} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-2">Contact Information</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{broker.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{broker.contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{broker.contact.website}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
