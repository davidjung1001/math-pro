// FILE: lib/utils/analyticsQueries.js
import { supabase } from '@/lib/supabaseClient'
import { getTrafficSource } from './analytics' // make sure this exists

// ---------------------------------------------------------------------------
// 1. fetchStats (RPC)
// ---------------------------------------------------------------------------
export async function fetchStats(supabase, startDate, excludeVisitorId) {
  const { data, error } = await supabase.rpc('analytics_stats', {
    start_ts: startDate,
    excl_visitor: excludeVisitorId || null
  })

  if (error) {
    console.error('fetchStats RPC error:', error)
    return {
      totalVisitors: 0,
      totalSessions: 0,
      avgPagesPerSession: 0,
      returningVisitors: 0
    }
  }

  return data?.[0] || {
    totalVisitors: 0,
    totalSessions: 0,
    avgPagesPerSession: 0,
    returningVisitors: 0
  }
}

// ---------------------------------------------------------------------------
// 2. fetchVisitorDetails (RPC)
// ---------------------------------------------------------------------------
export async function fetchVisitorDetails(supabase, startDate, excludeVisitorId) {
  const { data, error } = await supabase.rpc('analytics_visitor_details', {
    start_ts: startDate,
    excl_visitor: excludeVisitorId || null
  })

  if (error) {
    console.error('fetchVisitorDetails RPC error:', error)
    return []
  }

  return data || []
}

// ---------------------------------------------------------------------------
// 3. fetchVisitorJourneys (RPC)
// ---------------------------------------------------------------------------
export async function fetchVisitorJourneys(supabase, startDate, excludeVisitorId) {
  const { data, error } = await supabase.rpc('analytics_journeys', {
    start_ts: startDate,
    excl_visitor: excludeVisitorId || null
  })

  if (error) {
    console.error('fetchVisitorJourneys RPC error:', error)
    return []
  }

  return data || []
}

// ---------------------------------------------------------------------------
// 4. fetchPopularPages (non-RPC)
// ---------------------------------------------------------------------------
export async function fetchPopularPages(supabase, startDate, excludeVisitorId) {
  let query = supabase
    .from('page_views')
    .select('page_path, page_title')
    .gte('viewed_at', startDate)

  if (excludeVisitorId) {
    query = query.neq('visitor_id', excludeVisitorId)
  }

  const { data, error } = await query

  if (error) {
    console.error('fetchPopularPages error:', error)
    return []
  }

  // Count pages
  const counts = {}
  data?.forEach(p => {
    const key = p.page_path || 'unknown'
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// 5. fetchTrafficSources (non-RPC)
// ---------------------------------------------------------------------------
export async function fetchTrafficSources(supabase, startDate, excludeVisitorId) {
  let query = supabase
    .from('user_sessions')
    .select('referrer')
    .gte('first_visit_at', startDate)

  if (excludeVisitorId) {
    query = query.neq('visitor_id', excludeVisitorId)
  }

  const { data, error } = await query
  if (error) {
    console.error('fetchTrafficSources error:', error)
    return []
  }

  const counts = {}
  data?.forEach(s => {
    const src = getTrafficSource(s.referrer)
    counts[src] = (counts[src] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// 6. fetchDeviceStats
// ---------------------------------------------------------------------------
export async function fetchDeviceStats(supabase, startDate, excludeVisitorId) {
  let query = supabase
    .from('user_sessions')
    .select('device_type')
    .gte('created_at', startDate)
  if (excludeVisitorId) query = query.neq('visitor_id', excludeVisitorId)
  const { data, error } = await query
  if (error) { console.error('fetchDeviceStats error:', error); return [] }
  const counts = {}
  data?.forEach(s => {
    const type = s.device_type || 'Unknown'
    counts[type] = (counts[type] || 0) + 1
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// 7. fetchUTMStats
// ---------------------------------------------------------------------------
export async function fetchUTMStats(supabase, startDate, excludeVisitorId) {
  let query = supabase
    .from('user_sessions')
    .select('utm_source, utm_medium, utm_campaign')
    .gte('created_at', startDate)
    .not('utm_source', 'is', null)
  if (excludeVisitorId) query = query.neq('visitor_id', excludeVisitorId)
  const { data, error } = await query
  if (error) { console.error('fetchUTMStats error:', error); return { sources: [], campaigns: [] } }
  const sourceCounts = {}
  const campaignCounts = {}
  data?.forEach(s => {
    if (s.utm_source) sourceCounts[s.utm_source] = (sourceCounts[s.utm_source] || 0) + 1
    if (s.utm_campaign) campaignCounts[s.utm_campaign] = (campaignCounts[s.utm_campaign] || 0) + 1
  })
  return {
    sources: Object.entries(sourceCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    campaigns: Object.entries(campaignCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  }
}

// ---------------------------------------------------------------------------
// EXPORT ALL
// ---------------------------------------------------------------------------

