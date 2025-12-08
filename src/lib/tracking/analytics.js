// FILE: lib/tracking/analytics.js
import { supabase } from '@/lib/supabaseClient'
import { getHybridTracking } from './sessionStrategies'

// ============================================
// SESSION MANAGEMENT
// ============================================

export async function initializeSession() {
  if (typeof window === 'undefined') return null
  if (window.location.hostname === 'localhost') return null

  const { visitorId, sessionId } = getHybridTracking()

  console.log('🔍 Session Debug:', {
    visitorId: visitorId?.substring(0, 20),
    sessionId: sessionId?.substring(0, 20),
    referrer: document.referrer || 'NONE',
    landingPage: window.location.href,
    hasUTM: new URLSearchParams(window.location.search).has('utm_source')
  })
  
  if (!visitorId || !sessionId) {
    console.error('❌ Missing visitor or session ID')
    return null
  }

  try {
    // Check if session already exists
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
      
      console.log('✅ Session updated:', sessionId.substring(0, 20))
      return { visitorId, sessionId }
    }
    
    // Create new session
    const deviceInfo = getDeviceInfo()
    const urlParams = new URLSearchParams(window.location.search)
    
    const { error } = await supabase
      .from('user_sessions')
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        referrer: document.referrer || null,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('❌ Failed to create session:', error)
      return null
    }

    console.log('✅ New session created:', sessionId.substring(0, 20))
    return { visitorId, sessionId }
  } catch (err) {
    console.error('❌ Session initialization error:', err)
    return null
  }
}

// ============================================
// PAGE VIEW TRACKING
// ============================================

let currentPageViewId = null
let pageLoadTime = Date.now()

export async function trackPageView(pageData = {}) {
  if (typeof window === 'undefined') return null
  if (window.location.hostname === 'localhost') return null

  const { visitorId, sessionId } = getHybridTracking()
  
  if (!visitorId || !sessionId) {
    console.error('❌ Cannot track page view: missing visitor/session ID')
    return null
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        user_id: user?.id || null,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        course_name: pageData?.courseTitle || null,
        section_name: pageData?.sectionTitle || null,
        subsection_name: pageData?.subsectionTitle || null,
        quiz_id: pageData?.quizId || null,
        viewed_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('❌ Failed to track page view:', error)
      return null
    }

    currentPageViewId = data?.id
    pageLoadTime = Date.now()
    
    console.log('✅ Page view tracked:', currentPageViewId)
    return currentPageViewId
  } catch (err) {
    console.error('❌ Page view tracking error:', err)
    return null
  }
}

export async function updatePageTimeSpent() {
  if (!currentPageViewId) return
  
  const timeSpentSeconds = Math.floor((Date.now() - pageLoadTime) / 1000)
  
  if (timeSpentSeconds < 1) return // Don't update if less than 1 second

  try {
    const { error } = await supabase
      .from('page_views')
      .update({ time_spent_seconds: timeSpentSeconds })
      .eq('id', currentPageViewId)
    
    if (error) {
      console.error('❌ Failed to update time spent:', error)
    } else {
      console.log(`✅ Time spent updated: ${timeSpentSeconds}s`)
    }
  } catch (err) {
    console.error('❌ Time spent update error:', err)
  }
}

// ============================================
// WORKSHEET INTERACTION TRACKING
// ============================================

export async function trackWorksheetInteraction(data) {
  if (typeof window === 'undefined') return null
  if (window.location.hostname === 'localhost') return null

  const { visitorId, sessionId } = getHybridTracking()
  
  if (!visitorId || !sessionId) {
    console.error('❌ Cannot track interaction: missing visitor/session ID')
    return null
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const timeToActionSeconds = Math.floor((Date.now() - pageLoadTime) / 1000)
    
    const { error } = await supabase
      .from('worksheet_interactions')
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        user_id: user?.id || null,
        quiz_id: data.quizId,
        action_type: data.actionType,
        include_answers: data.includeAnswers || null,
        include_choices: data.includeChoices || null,
        download_method: data.downloadMethod || null,
        page_path: window.location.pathname,
        time_to_action_seconds: timeToActionSeconds,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('❌ Failed to track interaction:', error)
      return null
    }

    console.log('✅ Interaction tracked:', data.actionType)
    return true
  } catch (err) {
    console.error('❌ Interaction tracking error:', err)
    return null
  }
}

// Track preview opened
export function trackPreviewOpened(quizId) {
  return trackWorksheetInteraction({
    quizId,
    actionType: 'preview_opened'
  })
}

// Track preview closed
export function trackPreviewClosed(quizId) {
  return trackWorksheetInteraction({
    quizId,
    actionType: 'preview_closed'
  })
}

// Track download button click
export function trackDownloadClick(quizId, includeAnswers, includeChoices) {
  return trackWorksheetInteraction({
    quizId,
    actionType: 'download_clicked',
    includeAnswers,
    includeChoices,
    downloadMethod: 'button'
  })
}

// Track iframe download
export function trackIframeDownload(quizId) {
  return trackWorksheetInteraction({
    quizId,
    actionType: 'iframe_download',
    downloadMethod: 'iframe'
  })
}

// ============================================
// CONVERSION TRACKING
// ============================================

export async function trackSignup(userId) {
  if (typeof window === 'undefined') return null
  
  const { visitorId, sessionId } = getHybridTracking()
  
  if (!visitorId || !sessionId) return null

  try {
    // Update all sessions for this visitor with user_id
    await supabase
      .from('user_sessions')
      .update({ user_id: userId })
      .eq('visitor_id', visitorId)

    // Update all page views for this visitor with user_id
    await supabase
      .from('page_views')
      .update({ user_id: userId })
      .eq('visitor_id', visitorId)

    console.log('✅ Linked visitor to user:', userId)
  } catch (err) {
    console.error('❌ Signup tracking error:', err)
  }
}

export async function trackFirstDownload(userId) {
  const { sessionId } = getHybridTracking()
  if (!sessionId) return null

  try {
    await supabase
      .from('conversion_events')
      .insert({
        session_id: sessionId,
        user_id: userId,
        event_type: 'first_download',
        created_at: new Date().toISOString()
      })
    
    console.log('✅ First download tracked')
  } catch (err) {
    console.error('❌ First download tracking error:', err)
  }
}

export async function trackPremiumUpgrade(userId) {
  const { sessionId } = getHybridTracking()
  if (!sessionId) return null

  try {
    await supabase
      .from('conversion_events')
      .insert({
        session_id: sessionId,
        user_id: userId,
        event_type: 'upgrade_to_premium',
        created_at: new Date().toISOString()
      })
    
    console.log('✅ Premium upgrade tracked')
  } catch (err) {
    console.error('❌ Premium upgrade tracking error:', err)
  }
}

// ============================================
// IFRAME DOWNLOAD DETECTION
// ============================================

export function setupIframeDownloadTracking(iframeElement, quizId) {
  let clickDetected = false
  
  iframeElement.addEventListener('mouseenter', () => {
    clickDetected = false
  })
  
  iframeElement.addEventListener('mouseleave', () => {
    if (clickDetected) {
      trackIframeDownload(quizId)
    }
  })
  
  iframeElement.addEventListener('load', () => {
    try {
      const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document
      
      if (iframeDoc) {
        iframeDoc.addEventListener('mousedown', () => {
          clickDetected = true
          setTimeout(() => {
            if (clickDetected) {
              trackIframeDownload(quizId)
            }
          }, 1000)
        })
      }
    } catch (e) {
      console.log('Cannot access iframe content (expected for blob URLs)')
    }
  })
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getDeviceInfo() {
  const ua = navigator.userAgent
  
  let deviceType = 'Desktop'
  if (/Mobile|Android|iP(hone|od)|BlackBerry|IEMobile/.test(ua)) {
    deviceType = 'Mobile'
  } else if (/Tablet|iPad/.test(ua)) {
    deviceType = 'Tablet'
  }
  
  let browser = 'Unknown'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'MacOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS')) os = 'iOS'
  
  return { deviceType, browser, os }
}

// ============================================
// AUTO-TRACKING SETUP
// ============================================

export function setupAutoTracking(pageData = {}) {
  if (typeof window === 'undefined') return
  if (window.location.hostname === 'localhost') {
    console.log('📍 Skipping auto-tracking on localhost')
    return
  }

  console.log('🚀 Setting up auto-tracking')

  // Initialize session
  initializeSession()
  
  // Track initial page view
  trackPageView(pageData)
  
  // Update time spent on page unload
  window.addEventListener('beforeunload', () => {
    updatePageTimeSpent()
  })
  
  // Update time spent every 30 seconds
  const intervalId = setInterval(() => {
    updatePageTimeSpent()
  }, 30000)
  
  // Cleanup
  return () => {
    clearInterval(intervalId)
  }
}