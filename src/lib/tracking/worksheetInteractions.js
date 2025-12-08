import { supabase } from '@/lib/supabaseClient'
import { getHybridTracking } from '@/lib/tracking/sessionStrategies'

export async function logWorksheetInteraction({
  quizId,
  courseName,
  sectionName,
  subsectionName,
  actionType,
  timeSpentSeconds = null,
  includeAnswers = null,
  includeChoices = null
}) {
  try {
    const { visitorId, sessionId } = getHybridTracking()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null
    const userEmail = session?.user?.email || null

    await supabase.from('worksheet_interactions').insert({
      user_id: userId,
      user_email: userEmail,
      session_id: sessionId,
      visitor_id: visitorId,
      quiz_id: quizId,
      course_name: courseName,
      section_name: sectionName,
      subsection_name: subsectionName,
      action_type: actionType,
      time_spent_seconds: timeSpentSeconds,
      include_answers: includeAnswers,
      include_choices: includeChoices
    })
  } catch (err) {
    console.error('Failed to log worksheet interaction', err)
  }
}
