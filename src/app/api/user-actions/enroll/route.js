import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, courseId } = body

    if (!userId || !courseId) {
      return new Response(JSON.stringify({ error: 'Missing userId or courseId' }), { status: 400 })
    }

    // 1️⃣ Check user exists
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('uuid')
      .eq('uuid', userId)
      .single()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User does not exist' }), { status: 400 })
    }

    // 2️⃣ Check if already enrolled
    const { data: existing, error: existingError } = await supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      return new Response(JSON.stringify({ message: 'Already enrolled' }), { status: 200 })
    }

    // 3️⃣ Insert enrollment using upsert to avoid conflicts
    const { data, error } = await supabase
      .from('user_enrollments')
      .upsert(
        { user_id: userId, course_id: courseId, progress_percentage: 0 },
        { onConflict: ['user_id', 'course_id'], ignoreDuplicates: true }
      )
      .select()
      .single()

    if (error) {
      console.error('Error enrolling user:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, enrollment: data }), { status: 200 })

  } catch (err) {
    console.error('Unexpected error enrolling:', err)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 })
  }
}
