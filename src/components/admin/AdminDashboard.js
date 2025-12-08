'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { RefreshCw } from 'lucide-react'
import DashboardHeader from '@/components/admin/DashboardHeader'
import DashboardTabs from '@/components/admin/DashboardTabs'
import OverviewTab from '@/components/admin/OverviewTab'
import VisitorDetailsTab from '@/components/admin/VisitorDetailsTab'
import PopularPagesTab from '@/components/admin/PopularPagesTab'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import VisitorAnalytics from './VisitorAnalytics'
import BehavioralInsights from './BehavioralInsights'

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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <DashboardHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          excludeMyself={excludeMyself}
          setExcludeMyself={setExcludeMyself}
          onRefresh={refreshData}
        />

        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="overflow-x-auto">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} trafficSources={trafficSources} />
          )}

          {activeTab === 'visitors' && (
            <VisitorDetailsTab visitorDetails={visitorDetails} />
          )}

          {activeTab === 'pages' && (
            <PopularPagesTab popularPages={popularPages} />
          )}
          {activeTab === 'visitors' && <VisitorAnalytics />}
        {activeTab === 'insights' && <BehavioralInsights timeRange={timeRange} />}
        </div>
      </div>
    </div>
  )
}