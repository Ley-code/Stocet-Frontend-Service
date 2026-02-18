'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { Bell } from 'lucide-react'

export function TriggeredAlerts() {
  const { alerts } = useStore()
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered')

  if (triggeredAlerts.length === 0) {
    return null
  }

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Triggered Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {triggeredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-md border border-primary/20 bg-terminal-surface p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono-numeric font-semibold">{alert.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {alert.type} {alert.condition} {alert.type === 'price' ? formatCurrency(alert.threshold) : formatNumber(alert.threshold)}
                </div>
                {alert.triggeredAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Triggered: {formatDate(alert.triggeredAt)}
                  </div>
                )}
              </div>
              <Badge variant="default" className="bg-primary">
                Triggered
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
