// FILE: app/courses/[slug]/[moduleSlug]/[subsectionSlug]/quiz/[quizId]/page.jsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { fetchQuizWithQuestions, createQuizAttempt, saveQuizAnswer, completeQuizAttempt } from '@/lib/quizzes/supabaseQuizData'
import { supabase } from '@/lib/supabaseClient'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { QuizProgress } from '@/components/quiz/QuizProgress'
import { QuizNavigation } from '@/components/quiz/QuizNavigation'
import { QuizResults } from '@/components/quiz/QuizResults'

export default function QuizPage() {
  const { slug: courseSlug, moduleSlug, subsectionSlug, quizId } = useParams()
  const router = useRouter()

  const [session, setSession] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [attemptId, setAttemptId] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [quizState, setQuizState] = useState('loading')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [])

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId || !session) return

      const quizData = await fetchQuizWithQuestions(quizId)
      if (!quizData) {
        router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`)
        return
      }

      setQuiz(quizData)
      const attempt = await createQuizAttempt(session.user.id, quizId, quizData.questions.length)
      
      if (attempt) {
        setAttemptId(attempt.id)
        setQuizState('active')
      }

      setLoading(false)
    }

    loadQuiz()
  }, [quizId, session, router, courseSlug, moduleSlug, subsectionSlug])

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const totalQuestions = quiz?.questions.length || 0

  const handleAnswerSelect = useCallback(async (optionKey) => {
    if (!currentQuestion || !attemptId) return

    const isCorrect = optionKey === currentQuestion.correct_option
    await saveQuizAnswer(attemptId, currentQuestion.id, optionKey, isCorrect)

    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optionKey }))
  }, [currentQuestion, attemptId])

  const handleNavigation = useCallback((direction) => {
    if (direction === 'next' && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex, totalQuestions])

  const handleSubmit = useCallback(async () => {
    if (!attemptId) return
    await completeQuizAttempt(attemptId)
    setQuizState('finished')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [attemptId])

  const score = useMemo(() => {
    if (!quiz) return 0
    return quiz.questions.filter(q => userAnswers[q.id] === q.correct_option).length
  }, [quiz, userAnswers])

  if (loading || quizState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center border border-red-400">
          <p className="text-2xl font-bold text-red-600 mb-4">Quiz Not Found</p>
          <button
            onClick={() => router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`)}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <ChevronLeft className="w-5 h-5 inline mr-2" /> Back to Lesson
          </button>
        </div>
      </div>
    )
  }

  if (quizState === 'finished') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            score={score}
            onReturnToLesson={() => router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-indigo-600 mb-6">
          <button
            onClick={() => router.push(`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}`)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition text-sm sm:text-base mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Lesson
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{quiz.name}</h1>
          
          <QuizProgress current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>

        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedOption={userAnswers[currentQuestion.id]}
          onSelect={handleAnswerSelect}
        />

        <QuizNavigation
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedOption={userAnswers[currentQuestion.id]}
          onPrevious={() => handleNavigation('prev')}
          onNext={() => handleNavigation('next')}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}