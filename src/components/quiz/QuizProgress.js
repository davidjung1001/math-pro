// FILE: components/quiz/QuizProgress.jsx
'use client'

export function QuizProgress({ current, total }) {
  const percentage = (current / total) * 100

  return (
    <div className="mt-4">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        Question {current} of {total}
      </p>
    </div>
  )
}