// FILE: components/quiz/QuizNavigation.jsx
'use client'

import { ChevronLeft } from 'lucide-react'

export function QuizNavigation({ 
  currentIndex, 
  totalQuestions, 
  selectedOption, 
  onPrevious, 
  onNext, 
  onSubmit 
}) {
  const isLastQuestion = currentIndex === totalQuestions - 1

  return (
    <div className="mt-8 sm:mt-10 flex justify-between gap-3">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg disabled:opacity-50 transition hover:bg-gray-300 text-sm sm:text-base"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Previous
      </button>

      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!selectedOption}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-green-700 transition shadow-md text-sm sm:text-base"
        >
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!selectedOption}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition shadow-md text-sm sm:text-base"
        >
          Next Question
        </button>
      )}
    </div>
  )
}