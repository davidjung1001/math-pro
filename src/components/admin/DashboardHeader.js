'use client'

import { RefreshCw } from 'lucide-react'

export default function DashboardHeader({ 
  timeRange, 
  setTimeRange, 
  excludeMyself, 
  setExcludeMyself, 
  onRefresh 
}) {
  return (
    <div className="mb-6 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <button
          onClick={onRefresh}
          className="p-2 sm:p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Range Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          {/* Exclude Myself Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={excludeMyself}
                onChange={(e) => setExcludeMyself(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Exclude my visits
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate date from time range string
// Use this in your parent component when fetching data
export function getDateFromTimeRange(timeRange) {
  const now = new Date();
  
  switch (timeRange) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case 'all':
      return new Date(0); // Beginning of time
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
  }
}

// Helper to format the date for Supabase queries
export function formatDateForQuery(date) {
  return date.toISOString();
}