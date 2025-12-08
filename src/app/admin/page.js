'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import DashboardHeader from '@/components/admin/DashboardHeader'
import DashboardTabs from '@/components/admin/DashboardTabs'
import OverviewTab from '@/components/admin/OverviewTab'
import VisitorAnalytics from '@/components/admin/VisitorAnalytics'
import BehavioralInsights from '@/components/admin/BehavioralInsights'
import PopularPagesTab from '@/components/admin/PopularPagesTab'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState(30)
  const [excludeMyself, setExcludeMyself] = useState(true)
  
  const {
    loading,
    stats,
    visitorDetails,
    popularPages,
    trafficSources,
    refreshData
  } = useAnalyticsData(timeRange, excludeMyself)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <RefreshCw className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Quick Navigation Links */}
        <div className="mb-6 flex gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Main Dashboard
          </Link>
          <Link
            href="/admin/returning"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Returning Visitors
          </Link>
          <Link
            href="/admin/worksheet-analytics"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Worksheet Analytics
          </Link>
        </div>

        <DashboardHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          excludeMyself={excludeMyself}
          setExcludeMyself={setExcludeMyself}
          onRefresh={refreshData}
        />

        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'overview' && (
          <OverviewTab stats={stats} trafficSources={trafficSources} />
        )}

        {activeTab === 'pages' && (
          <PopularPagesTab popularPages={popularPages} />
        )}
        {activeTab === 'visitors' && <VisitorAnalytics visitorDetails={visitorDetails} />}

        {activeTab === 'behavior' && <BehavioralInsights timeRange={timeRange} />}
      </div>
    </div>
  )
}