// FILE: lib/tracking/sessionStrategies.js

// ============================================
// STRATEGY 1: PERSISTENT SESSION (Current)
// ============================================
// Best for: Long-term user tracking, understanding user journey over time
// Session persists across browser closes, only resets if they clear data

export function getPersistentSessionId() {
  let sessionId = localStorage.getItem('session_id')
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('session_id', sessionId)
  }
  
  return sessionId
}

// ============================================
// STRATEGY 2: BROWSER SESSION (Resets on close)
// ============================================
// Best for: True "session" tracking - each browser session is separate
// New session when they close browser and come back

export function getBrowserSessionId() {
  let sessionId = sessionStorage.getItem('session_id')
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  
  return sessionId
}

// ============================================
// STRATEGY 3: TIME-BASED SESSION (30 min timeout)
// ============================================
// Best for: Analytics similar to Google Analytics
// New session after 30 minutes of inactivity

export function getTimedSessionId() {
  const TIMEOUT_MINUTES = 30
  const now = Date.now()
  
  let sessionData = localStorage.getItem('session_data')
  
  if (sessionData) {
    const { sessionId, lastActivity } = JSON.parse(sessionData)
    const timeSinceActivity = now - lastActivity
    const timeoutMs = TIMEOUT_MINUTES * 60 * 1000
    
    if (timeSinceActivity < timeoutMs) {
      // Update last activity time
      localStorage.setItem('session_data', JSON.stringify({
        sessionId,
        lastActivity: now
      }))
      return sessionId
    }
  }
  
  // Create new session
  const newSessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('session_data', JSON.stringify({
    sessionId: newSessionId,
    lastActivity: now
  }))
  
  return newSessionId
}

// ============================================
// STRATEGY 4: HYBRID (Recommended)
// ============================================
// Tracks both "visits" and "sessions"
// Visit = unique user (persistent)
// Session = period of activity (30 min timeout)

export function getHybridTracking() {
  // Visitor ID - persistent across all visits
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_id', visitorId)
  }
  
  // Session ID - resets after inactivity
  const sessionId = getTimedSessionId()
  
  return { visitorId, sessionId }
}

// ============================================
// UPDATED DATABASE SCHEMA FOR HYBRID
// ============================================

/*
If using hybrid approach, update your user_sessions table:

ALTER TABLE user_sessions ADD COLUMN visitor_id TEXT;
CREATE INDEX idx_user_sessions_visitor_id ON user_sessions(visitor_id);

-- Now you can track:
-- 1. Unique visitors (visitor_id)
-- 2. Multiple sessions per visitor (session_id)
-- 3. Pages per session
-- 4. Time between sessions (return visits)
*/

// ============================================
// USAGE IN YOUR APP
// ============================================

import { supabase } from '@/lib/supabaseClient'

export async function initializeTracking() {
  const { visitorId, sessionId } = getHybridTracking()
  
  // Check if this session already exists
  const { data: existingSession } = await supabase
    .from('user_sessions')
    .select('id')
    .eq('session_id', sessionId)
    .single()
  
  if (existingSession) {
    // Update last activity
    await supabase
      .from('user_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('session_id', sessionId)
    
    return { visitorId, sessionId }
  }
  
  // Create new session
  const deviceInfo = getDeviceInfo()
  const urlParams = new URLSearchParams(window.location.search)
  
  await supabase
    .from('user_sessions')
    .upsert({
      session_id: sessionId,
      visitor_id: visitorId, // Track the visitor across sessions
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      referrer: document.referrer || null,
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign')
    })

const pagePath = window.location.pathname + window.location.search
  const pageTitle = document.title

  await supabase.from('page_views').insert({
    session_id: sessionId,
    visitor_id: visitorId,
    user_id: null, // optionally fill if logged-in
    page_path: pagePath,
    page_title: pageTitle,
    referrer: document.referrer || null,
    viewed_at: new Date().toISOString()
  })

  
  return { visitorId, sessionId }
}

// ============================================
// ANALYTICS QUERIES WITH HYBRID TRACKING
// ============================================

// Get unique visitors
export async function getUniqueVisitors(days = 30) {
  const { count } = await supabase
    .from('user_sessions')
    .select('visitor_id', { count: 'exact', head: true })
    .gte('first_visit_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  // This counts duplicate visitor_ids, so we need distinct:
  const { data } = await supabase
    .from('user_sessions')
    .select('visitor_id')
    .gte('first_visit_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  const uniqueVisitors = new Set(data.map(s => s.visitor_id))
  return uniqueVisitors.size
}

// Get returning visitors (visitors with multiple sessions)
export async function getReturningVisitors(days = 30) {
  const { data } = await supabase
    .from('user_sessions')
    .select('visitor_id')
    .gte('first_visit_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  // Count visitors who appear more than once
  const visitorCounts = {}
  data.forEach(s => {
    visitorCounts[s.visitor_id] = (visitorCounts[s.visitor_id] || 0) + 1
  })
  
  const returningCount = Object.values(visitorCounts).filter(count => count > 1).length
  return returningCount
}

// Get average sessions per visitor
export async function getAvgSessionsPerVisitor(days = 30) {
  const { data } = await supabase
    .from('user_sessions')
    .select('visitor_id')
    .gte('first_visit_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  const uniqueVisitors = new Set(data.map(s => s.visitor_id)).size
  const totalSessions = data.length
  
  return (totalSessions / uniqueVisitors).toFixed(2)
}

function getDeviceInfo() {
  const ua = navigator.userAgent
  
  let deviceType = 'desktop'
  if (/Mobile|Android|iP(hone|od)|BlackBerry|IEMobile/.test(ua)) {
    deviceType = 'mobile'
  } else if (/Tablet|iPad/.test(ua)) {
    deviceType = 'tablet'
  }
  
  let browser = 'unknown'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  let os = 'unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'MacOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS')) os = 'iOS'
  
  return { deviceType, browser, os }
}

// ============================================
// COMPARISON TABLE
// ============================================

/*
┌─────────────────────┬──────────────┬───────────────┬──────────────┬───────────┐
│ Strategy            │ Storage      │ New on Close? │ Timeout?     │ Best For  │
├─────────────────────┼──────────────┼───────────────┼──────────────┼───────────┤
│ Persistent          │ localStorage │ No            │ No           │ Long-term │
│ Browser Session     │ sessionStorage│ Yes           │ No           │ True sess │
│ Timed Session       │ localStorage │ No            │ 30 min       │ Analytics │
│ Hybrid (Recommended)│ localStorage │ No            │ 30 min       │ Both      │
└─────────────────────┴──────────────┴───────────────┴──────────────┴───────────┘

RECOMMENDATION: Use Hybrid Strategy
- Tracks unique visitors over time (visitor_id)
- Tracks individual browsing sessions (session_id with 30-min timeout)
- Best of both worlds for analytics
- Similar to how Google Analytics works
*/