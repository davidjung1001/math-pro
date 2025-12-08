import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  fetchStats, 
  fetchVisitorDetails, 
  fetchVisitorJourneys, 
  fetchPopularPages, 
  fetchTrafficSources 
} from '@/lib/utils/analyticsQueries'

export function useAnalyticsData(timeRange = 7, excludeMyself = true) {
  const [loading, setLoading] = useState(true)
  const [visitorId, setVisitorId] = useState(null)
  const [stats, setStats] = useState({})
  const [visitorDetails, setVisitorDetails] = useState([])
  const [visitorJourneys, setVisitorJourneys] = useState([])
  const [popularPages, setPopularPages] = useState([])
  const [trafficSources, setTrafficSources] = useState([])

  useEffect(() => {
    const id = localStorage.getItem('visitor_id')
    setVisitorId(id)
  }, [])

  const getStartDate = (days) => {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const excludeId = excludeMyself ? visitorId : null
      const startDate = getStartDate(timeRange)

      const [
        statsData,
        visitorDetailsData,
        journeysData,
        popularPagesData,
        trafficSourcesData
      ] = await Promise.all([
        fetchStats(supabase, startDate, excludeId),
        fetchVisitorDetails(supabase, startDate, excludeId),
        fetchVisitorJourneys(supabase, startDate, excludeId),
        fetchPopularPages(supabase, startDate, excludeId),
        fetchTrafficSources(supabase, startDate, excludeId)
      ])

      setStats(statsData)
      setVisitorDetails(visitorDetailsData)
      setVisitorJourneys(journeysData)
      setPopularPages(popularPagesData)
      setTrafficSources(trafficSourcesData)
    } catch (err) {
      console.error('Error loading analytics data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (excludeMyself && visitorId === null) return
    loadAllData()
  }, [timeRange, excludeMyself, visitorId])

  return {
    loading,
    stats,
    visitorDetails,
    visitorJourneys,
    popularPages,
    trafficSources,
    refreshData: loadAllData
  }
}
