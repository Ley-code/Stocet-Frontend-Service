import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { IndexSummary } from '@/components/dashboard/IndexSummary'
import { GainersLosers } from '@/components/dashboard/GainersLosers'
import { VolumeChart } from '@/components/dashboard/VolumeChart'
import { Watchlist } from '@/components/dashboard/Watchlist'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Market overview and key metrics</p>
      </div>
      <MarketOverview />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VolumeChart />
        </div>
        <div>
          <Watchlist />
        </div>
      </div>
      <IndexSummary />
      <GainersLosers />
    </div>
  )
}
