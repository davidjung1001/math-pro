import { supabase } from '@/lib/supabaseClient'
import { getHybridTracking } from '@/lib/tracking/sessionStrategies'

export async function trackAIToolUsage({ toolType, inputData, success, errorMessage = null }) {
  try {
    const { visitorId, sessionId } = getHybridTracking()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    await supabase.from('ai_tool_usage').insert({
      user_id: userId,
      session_id: sessionId,
      visitor_id: visitorId,
      tool_type: toolType,
      input_data: inputData,
      success,
      error_message: errorMessage,
      used_at: new Date().toISOString()
    })

    console.log('✅ AI tool usage logged', { toolType, visitorId, sessionId, userId })
  } catch (err) {
    console.error('❌ Failed to log AI tool usage', err)
  }
}

export async function trackAIToolClick(toolType) {
  try {
    const { visitorId, sessionId } = getHybridTracking()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    await supabase.from('ai_tool_clicks').insert({
      user_id: userId,
      session_id: sessionId,
      visitor_id: visitorId,
      tool_type: toolType,
      clicked_at: new Date().toISOString()
    })

    console.log('🖱️ AI tool click logged', { toolType, visitorId, sessionId, userId })
  } catch (err) {
    console.error('❌ Failed to log AI tool click', err)
  }
}

export async function trackAIToolTabSwitch(fromTab, toTab) {
  try {
    const { visitorId, sessionId } = getHybridTracking()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null
    const userEmail = session?.user?.email || null

    await supabase.from('ai_tool_tab_switches').insert({
      user_id: userId,
      session_id: sessionId,
      visitor_id: visitorId,
      from_tab: fromTab,
      to_tab: toTab,
      switched_at: new Date().toISOString()
    })

    console.log('🔄 AI tool tab switch logged', { fromTab, toTab, visitorId, sessionId, userId })
  } catch (err) {
    console.error('❌ Failed to log AI tool tab switch', err)
  }
}
