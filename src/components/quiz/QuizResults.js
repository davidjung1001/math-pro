// FILE: components/quiz/QuizResults.jsx
'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { renderContent } from '@/lib/renderContent'

export function QuizResults({ quiz, userAnswers, score, onReturnToLesson }) {
  const totalQuestions = quiz.questions.length
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(0) : 0
  const isExcellent = percentage >= 80

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-indigo-600">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
      <p className="text-lg text-gray-600 mb-6">{quiz.name}</p>

      <div className={`text-center p-6 sm:p-8 rounded-xl mb-8 shadow-sm ${
        isExcellent ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'
      }`}>
        <p className="text-5xl sm:text-7xl font-black mb-2" style={{ color: isExcellent ? '#10B981' : '#EF4444' }}>
          {percentage}%
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {score} out of {totalQuestions} Correct
        </p>
        <p className={`mt-2 font-medium text-sm sm:text-base ${isExcellent ? 'text-green-600' : 'text-red-600'}`}>
          {isExcellent ? "Great job! You've mastered this quiz." : "Keep practicing! Review the answers below."}
        </p>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 border-b pb-2">Review</h2>
      <div className="space-y-4 sm:space-y-6">
        {quiz.questions.map((q, index) => {
          const userAnswer = userAnswers[q.id]
          const isCorrect = userAnswer === q.correct_option
          const bgColor = isCorrect ? 'bg-green-50' : 'bg-red-50'
          const borderColor = isCorrect ? 'border-green-300' : 'border-red-300'

          return (
            <div key={q.id} className={`p-4 sm:p-5 rounded-lg border-2 ${borderColor} ${bgColor}`}>
              <div className="flex items-start mb-3">
                <span className="text-lg font-bold mr-3 text-indigo-700">Q{index + 1}.</span>
                <div className="prose max-w-none text-base font-medium text-gray-800" dangerouslySetInnerHTML={renderContent(q.question_text)} />
              </div>

              <ul className="space-y-2 pl-4 pt-3 border-t border-gray-300">
                {['A', 'B', 'C', 'D'].map(key => {
                  const value = q[`option_${key.toLowerCase()}`]
                  if (!value) return null

                  const isSelected = key === userAnswer
                  const isAnswer = key === q.correct_option
                  let optionClass = 'text-gray-700'

                  if (isAnswer) {
                    optionClass = 'font-bold text-green-700 bg-green-100 p-2 rounded'
                  } else if (isSelected) {
                    optionClass = 'font-bold text-red-700 bg-red-100 p-2 rounded'
                  }

                  return (
                    <li key={key} className={`flex items-start text-sm sm:text-base ${optionClass}`}>
                      {isAnswer && <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />}
                      {isSelected && !isAnswer && <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />}
                      {!isSelected && !isAnswer && <span className="w-5 h-5 mr-2"></span>}
                      <span className="font-semibold mr-2">{key}.</span>
                      <div dangerouslySetInnerHTML={renderContent(value)} />
                    </li>
                  )
                })}
              </ul>

              {q.short_explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Explanation:</p>
                  <div className="text-sm text-blue-700" dangerouslySetInnerHTML={renderContent(q.short_explanation)} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t text-center">
        <button
          onClick={onReturnToLesson}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white font-bold text-base sm:text-lg rounded-lg hover:bg-indigo-700 transition shadow-lg"
        >
          Return to Lesson
        </button>
      </div>
    </div>
  )
}