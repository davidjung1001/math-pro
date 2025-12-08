import { Navigation } from 'lucide-react'

export default function TrafficSourcesChart({ sources }) {
  const maxCount = sources[0]?.count || 1

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Traffic Sources</h3>
      <div className="space-y-3">
        {sources.map((source, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{source.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(source.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold w-12 text-right">{source.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}