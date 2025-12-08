import { Users, Activity, Eye, TrendingUp, Navigation } from 'lucide-react'
import MetricCard from './MetricCard'
import TrafficSourcesChart from './TrafficSourcesChart'

export default function OverviewTab({ stats, trafficSources }) {
  const metrics = [
    {
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: stats.totalVisitors,
      label: 'Unique Visitors'
    },
    {
      icon: Activity,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      value: stats.totalSessions,
      label: 'Total Sessions'
    },
    {
      icon: Eye,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: stats.avgPagesPerSession,
      label: 'Avg Pages/Session'
    },
    {
      icon: TrendingUp,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: stats.returningVisitors,
      label: 'Returning Visitors'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      <TrafficSourcesChart sources={trafficSources} />
    </div>
  )
}