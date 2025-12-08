import { supabase } from '@/lib/supabaseClient'

// Fetch all quizzes for a subsection with question count
export async function fetchQuizzesBySubsection(subsectionId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id,
      name,
      subsection_id,
      difficulty,
      is_premium,
      quiz_questions(count)
    `)
    .eq('subsection_id', subsectionId)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching quizzes:', error)
    return []
  }

  // Format to include question count
  return data.map(quiz => ({
    ...quiz,
    questionCount: quiz.quiz_questions?.[0]?.count || 0
  }))
}

// Fetch a single quiz with its questions in order
export async function fetchQuizWithQuestions(quizId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id,
      name,
      difficulty,
      is_premium,
      subsection_id,
      quiz_questions(
        id,
        question_id,
        sort_order,
        questions(
          id,
          question_text,
          difficulty,
          premium,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          short_explanation
        )
      )
    `)
    .eq('id', quizId)
    .single()

  if (error) {
    console.error('Error fetching quiz:', error)
    return null
  }

  // Sort questions by sort_order and flatten structure
  const questions = data.quiz_questions
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(qq => ({
      ...qq.questions,
      quizQuestionId: qq.id,
      sortOrder: qq.sort_order
    }))

  return {
    ...data,
    questions
  }
}

// Fetch user's attempts for a specific quiz
export async function fetchUserQuizAttempts(userId, quizId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      id,
      quiz_id,
      user_id,
      score,
      total_questions,
      completed_at,
      quiz_answers(
        id,
        question_id,
        selected_option,
        is_correct
      )
    `)
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('Error fetching quiz attempts:', error)
    return []
  }

  return data
}

// Fetch user's most recent attempt for a quiz
export async function fetchLatestQuizAttempt(userId, quizId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      id,
      quiz_id,
      user_id,
      score,
      total_questions,
      completed_at,
      quiz_answers(
        id,
        question_id,
        selected_option,
        is_correct
      )
    `)
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching latest attempt:', error)
    return null
  }

  return data
}

// Create a new quiz attempt
export async function createQuizAttempt(userId, quizId, totalQuestions) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score: 0,
      total_questions: totalQuestions,
      completed_at: null // Will be set when quiz is submitted
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating quiz attempt:', error)
    return null
  }

  return data
}

// Save a user's answer to a question
export async function saveQuizAnswer(attemptId, questionId, selectedOption, isCorrect) {
  const { data, error } = await supabase
    .from('quiz_answers')
    .upsert({
      quiz_attempt_id: attemptId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect
    }, {
      onConflict: 'quiz_attempt_id,question_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving answer:', error)
    return null
  }

  return data
}

// Complete a quiz attempt and calculate score
export async function completeQuizAttempt(attemptId) {
  // First, get all answers for this attempt
  const { data: answers, error: answersError } = await supabase
    .from('quiz_answers')
    .select('is_correct')
    .eq('quiz_attempt_id', attemptId)

  if (answersError) {
    console.error('Error fetching answers:', answersError)
    return null
  }

  const score = answers.filter(a => a.is_correct).length

  // Update the attempt with final score and completion time
  const { data, error } = await supabase
    .from('quiz_attempts')
    .update({
      score: score,
      completed_at: new Date().toISOString()
    })
    .eq('id', attemptId)
    .select()
    .single()

  if (error) {
    console.error('Error completing quiz attempt:', error)
    return null
  }

  return data
}