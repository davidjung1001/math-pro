// FILE: components/quiz/QuizQuestion.jsx
'use client'

import { renderContent } from '@/lib/renderContent'

export function QuizQuestion({ question, questionNumber, selectedOption, onSelect }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg mb-6 border border-indigo-200">
        <p className="text-lg sm:text-xl font-bold text-indigo-800 mb-3">
          Question {questionNumber}
        </p>
        <div 
          className="prose max-w-none text-gray-900 text-base sm:text-lg" 
          dangerouslySetInnerHTML={renderContent(question.question_text)} 
        />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {['A', 'B', 'C', 'D'].map(key => {
          const value = question[`option_${key.toLowerCase()}`]
          if (!value) return null

          return (
            <div
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-start p-4 sm:p-5 rounded-lg border-2 cursor-pointer transition ${
                selectedOption === key
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-gray-300 hover:border-indigo-400 text-gray-800 hover:shadow-sm'
              }`}
            >
              <span className={`text-lg font-bold mr-3 sm:mr-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full flex-shrink-0 ${
                selectedOption === key ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {key}
              </span>
              <div 
                className={`text-sm sm:text-base ${selectedOption === key ? 'text-white' : 'text-gray-800'}`} 
                dangerouslySetInnerHTML={renderContent(value)} 
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
