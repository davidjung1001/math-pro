import { supabase } from '@/lib/supabaseClient'

// Fetch the current logged-in user's profile
// lib/auth/supabaseUserData.js (fetchUserProfile)

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    // Select the columns you need, including the UUID column named 'id'
    .select('id, display_name, plan, created_at, email, is_admin') 
    // Query the 'id' column with the user's UUID
    .eq('id', userId) 
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  return data
}

// Fetch user's enrolled courses with progress info
// lib/auth/supabaseUserData.js (fetchUserEnrollments - REVISED)

export async function fetchUserEnrollments(userId) {
  const { data, error } = await supabase
    .from('user_enrollments')
    .select(`
      id,
      user_id,
      course_id ( 
        id, 
        title, 
        slug, 
        description 
      ),
      progress_percentage,
      last_accessed
    `)
    // ... (rest of the query remains the same)
    .eq('user_id', userId)
    .order('last_accessed', { ascending: false })

  // ... (error handling) ...

  // Mapping remains the same, but the resulting object won't have 'difficulty'
  return data.map(e => ({
    enrollmentId: e.id, 
    ...e.course_id, 
    progress_percentage: e.progress_percentage,
    last_accessed: e.last_accessed
  }))
}