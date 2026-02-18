import { ChartDashboard } from '@/components/analytics/ChartDashboard'
import { SectorPieChart } from '@/components/analytics/SectorPieChart'
import { MarketHeatmap } from '@/components/analytics/MarketHeatmap'
import { TechnicalIndicators } from '@/components/analytics/TechnicalIndicators'
import { ComparisonTool } from '@/components/analytics/ComparisonTool'
import { stocksData } from '@/lib/mock-data'

export default function AnalyticsPage() {
  const defaultSymbol = stocksData[0]?.symbol || ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Charts, technical indicators, and market analysis</p>
      </div>
      <ChartDashboard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectorPieChart />
        <TechnicalIndicators symbol={defaultSymbol} />
      </div>
      <MarketHeatmap />
      <ComparisonTool />
    </div>
  )
}
