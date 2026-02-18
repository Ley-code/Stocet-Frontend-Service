'use client'

import { useStore } from '@/lib/store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AlertsList() {
  const { alerts, removeAlert } = useStore()

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No alerts created yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Symbol</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Condition</TableHead>
                <TableHead className="text-xs">Threshold</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-mono-numeric font-semibold text-xs">
                    {alert.symbol}
                  </TableCell>
                  <TableCell className="text-xs capitalize">{alert.type}</TableCell>
                  <TableCell className="text-xs capitalize">{alert.condition}</TableCell>
                  <TableCell className="font-mono-numeric text-xs">
                    {alert.type === 'price'
                      ? formatCurrency(alert.threshold)
                      : formatNumber(alert.threshold)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={alert.status === 'triggered' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeAlert(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
