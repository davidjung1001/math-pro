import { supabase } from './supabaseClient';

// Fetch all courses a user is enrolled in
export async function fetchUserEnrollments(userId) {
  const { data, error } = await supabase
    .from('user_enrollments')
    .select(`
      course_id,
      courses (id, title, slug)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
  return data;
}

// Fetch progress for a specific user
export async function fetchUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      subsection_id,
      progress_percentage,
      completed,
      subsections (id, subsection_title, section_id)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
  return data;
}

// Fetch quiz scores for a user
export async function fetchUserScores(userId) {
  const { data, error } = await supabase
    .from('user_scores')
    .select(`
      question_id,
      correct,
      answered_at,
      questions (id, question_text, subsection_id)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
  return data;
}

// Fetch subscription level
export async function fetchUserPlan(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user plan:', error);
    return 'free';
  }
  return data?.plan || 'free';
}
