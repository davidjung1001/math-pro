'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Clock, BookOpen, Award, TrendingUp } from 'lucide-react'

export default function QuizStartPage() {
  const { slug: courseSlug, moduleSlug, subsectionSlug, quizId } = useParams()
  const router = useRouter()

  const [session, setSession] = useState(undefined)
  const [quiz, setQuiz] = useState(null)
  const [previousAttempts, setPreviousAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  // Auth listener
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      if (!quizId) return

      // Fetch quiz details with question count
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          id,
          name,
          difficulty,
          is_premium,
          subsection_id,
          quiz_questions(count)
        `)
        .eq('id', quizId)
        .single()

      if (quizError || !quizData) {
        console.error('Quiz not found:', quizError)
        router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`)
        return
      }

      // Fetch subsection title separately
      let subsectionTitle = 'Unknown'
      if (quizData.subsection_id) {
        const { data: subsectionData } = await supabase
          .from('subsections')
          .select('subsection_title')
          .eq('id', quizData.subsection_id)
          .single()
        
        if (subsectionData) {
          subsectionTitle = subsectionData.title
        }
      }

      setQuiz({
        ...quizData,
        questionCount: quizData.quiz_questions?.[0]?.count || 0,
        subsectionTitle
      })

      // Fetch previous attempts if logged in
      if (session?.user) {
        const { data: attemptsData, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('id, score, completed_at')
          .eq('quiz_id', quizId)
          .eq('user_id', session.user.id)
          .order('completed_at', { ascending: false })
          .limit(5)

        if (!attemptsError && attemptsData) {
          setPreviousAttempts(attemptsData)
        }
      }

      setLoading(false)
    }

    loadQuizData()
  }, [quizId, session, courseSlug, moduleSlug, subsectionSlug, router])

  const handleStartQuiz = () => {
    router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}/quiz/${quizId}`)
  }

  if (loading || session === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-indigo-600 animate-pulse">Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center border border-red-400">
          <p className="text-2xl font-bold text-red-600">Quiz not found</p>
        </div>
      </div>
    )
  }

  const bestScore = previousAttempts.length > 0 && quiz.questionCount > 0
    ? Math.max(...previousAttempts.map(a => (a.score / quiz.questionCount) * 100))
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href={`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`}
          className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-block transition font-medium"
        >
          ← Back to {quiz.subsectionTitle}
        </Link>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {quiz.name}
            </h1>
            <p className="text-gray-600">Test your knowledge with this practice quiz</p>
          </div>

          {/* Quiz info cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <BookOpen className="text-indigo-600 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{quiz.questionCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Award className="text-indigo-600 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{quiz.difficulty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Previous attempts */}
          {previousAttempts.length > 0 && (
            <div className="mb-8 p-5 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-green-600 w-5 h-5" />
                <h3 className="text-lg font-semibold text-green-800">Your Progress</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Best Score</p>
                <p className="text-3xl font-bold text-gray-900">{bestScore?.toFixed(0)}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Recent Attempts:</p>
                <div className="space-y-2">
                  {previousAttempts.slice(0, 3).map((attempt, idx) => {
                    const percentage = quiz.questionCount > 0 
                      ? ((attempt.score / quiz.questionCount) * 100).toFixed(0)
                      : 0
                    return (
                      <div key={attempt.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Attempt {previousAttempts.length - idx}
                        </span>
                        <span className={`font-semibold ${percentage >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {percentage}% ({attempt.score}/{quiz.questionCount})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Answer all {quiz.questionCount} questions to complete the quiz</li>
              <li>• You can review and change your answers before submitting</li>
              <li>• Your progress will be saved automatically</li>
              <li>• You can retake this quiz as many times as you want</li>
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            {previousAttempts.length > 0 ? 'Start New Attempt' : 'Start Quiz'} →
          </button>

          {previousAttempts.length > 0 && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Attempt #{previousAttempts.length + 1}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}