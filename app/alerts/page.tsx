import { AlertForm } from '@/components/alerts/AlertForm'
import { AlertsList } from '@/components/alerts/AlertsList'
import { TriggeredAlerts } from '@/components/alerts/TriggeredAlerts'

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground">Create and manage price and volume alerts</p>
      </div>
      <TriggeredAlerts />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AlertForm />
        </div>
        <div className="lg:col-span-2">
          <AlertsList />
        </div>
      </div>
    </div>
  )
}
