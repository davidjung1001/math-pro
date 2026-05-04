import { Users, Activity, Eye, TrendingUp, Navigation } from 'lucide-react'
import MetricCard from './MetricCard'
import TrafficSourcesChart from './TrafficSourcesChart'

export default function OverviewTab({ stats, trafficSources, deviceStats = [], utmStats = { sources: [], campaigns: [] } }) {
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

  const totalDevices = deviceStats.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {(deviceStats.length > 0 || utmStats.sources.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deviceStats.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Device Breakdown</h3>
              <div className="space-y-3">
                {deviceStats.map((d, i) => {
                  const pct = totalDevices ? Math.round((d.count / totalDevices) * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">{d.name || 'Unknown'}</span>
                        <span className="font-semibold text-gray-900">{d.count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {utmStats.sources.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {utmStats.campaigns.length > 0 ? 'UTM Campaigns' : 'UTM Sources'}
              </h3>
              <div className="space-y-2">
                {(utmStats.campaigns.length > 0 ? utmStats.campaigns : utmStats.sources).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-semibold text-indigo-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <TrafficSourcesChart sources={trafficSources} />
    </div>
  )
}