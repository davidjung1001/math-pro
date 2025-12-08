'use client'

import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Download, Zap } from 'lucide-react'
import { WorksheetModalContext } from '@/context/WorksheetModalContext'
import { supabase } from '@/lib/supabaseClient'
import { getHybridTracking } from '@/lib/tracking/sessionStrategies'

export default function RightSidebar({
  quizzes,
  currentSetNumber,
  slug,
  moduleSlug,
  subsectionSlug,
  currentQuiz,
  subsectionTitle,
  sectionTitle,
  courseTitle,
  questions,
  includeChoices,
  setIncludeChoices,
  isPremium
}) {
  const [showChoices, setShowChoices] = useState(includeChoices)
  const { openModal } = useContext(WorksheetModalContext)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    setShowChoices(includeChoices)
  }, [includeChoices])

  const trackEvent = async (eventName, metadata = {}) => {
    if (typeof window === 'undefined') return
    if (window.location.hostname === 'localhost') return

    try {
      const { visitorId, sessionId } = getHybridTracking()
      if (!visitorId || !sessionId) return

      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from('user_events').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        user_id: user?.id || null,
        event_name: eventName,
        event_metadata: {
          ...metadata,
          course: courseTitle,
          section: sectionTitle,
          subsection: subsectionTitle,
          quiz_id: currentQuiz?.id,
          quiz_name: currentQuiz?.name,
          pathname: window.location.pathname
        },
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }

  const handleToggle = () => {
    setShowChoices(prev => {
      const next = !prev
      if (setIncludeChoices) setIncludeChoices(next)
      
      // Track toggle
      trackEvent('toggle_answer_choices', {
        show_choices: next
      })
      
      return next
    })
  }

  const handleOpenModal = () => {
    if (!currentQuiz) return
    
    // Track download click
    trackEvent('click_download_pdf', {
      set_number: currentSetNumber,
      difficulty: currentQuiz.difficulty
    })
    
    openModal({
      courseName: courseTitle,
      sectionName: sectionTitle,
      subsectionTitle,
      quizName: currentQuiz.name,
      quizId: currentQuiz.id,
      difficulty: currentQuiz.difficulty,
      questions,
      isPremium
    })
  }

  const handleSetClick = (quiz, setNumber) => {
    trackEvent('click_other_set', {
      set_number: setNumber,
      quiz_name: quiz.name,
      difficulty: quiz.difficulty
    })
  }

  const handleCustomWorksheetClick = () => {
    trackEvent('click_custom_worksheet')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-l border-gray-200 bg-white">
        <h2 className="text-lg font-semibold p-4 pb-2">Other Sets</h2>

        <div className="px-4 pb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showChoices}
              onChange={handleToggle}
              className="h-4 w-4 accent-indigo-600"
            />
            Show answer choices
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {quizzes.map((quiz, idx) => {
            const setNumber = idx + 1
            const isCurrent = setNumber === currentSetNumber
            return (
              <Link
                key={quiz.id}
                href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/${setNumber}`}
                onClick={() => handleSetClick(quiz, setNumber)}
                className={`flex items-center justify-between mb-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isCurrent
                    ? 'bg-indigo-100 text-indigo-900 font-semibold ring-1 ring-indigo-300'
                    : 'hover:bg-gray-50 text-gray-800'
                  }`}
              >
                <span>{quiz.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{quiz.difficulty}</span>
              </Link>
            )
          })}

          {/* Custom Worksheet Button */}
          <Link
            href="/ai-tools"
            onClick={handleCustomWorksheetClick}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            Custom Worksheet
          </Link>
        </div>

        {/* Desktop Print Button */}
        <div className="fixed bottom-4 w-64 px-4">
          <button
            onClick={handleOpenModal}
            disabled={!currentQuiz}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium shadow-sm transition-colors w-full"
          >
            <Download className="w-4 h-4" />
            Download or Print Current Set
          </button>
        </div>
      </div>

      {/* Mobile Slide-In Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 bg-white shadow-lg transform transition-transform duration-300 lg:hidden
          ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Other Sets</h2>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showChoices}
              onChange={handleToggle}
              className="h-4 w-4 accent-indigo-600"
            />
            Show answer choices
          </label>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100%-120px)]">
          {quizzes.map((quiz, idx) => {
            const setNumber = idx + 1
            const isCurrent = setNumber === currentSetNumber
            return (
              <Link
                key={quiz.id}
                onClick={() => {
                  handleSetClick(quiz, setNumber)
                  setShowMobileMenu(false)
                }}
                href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/${setNumber}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isCurrent
                    ? 'bg-indigo-100 text-indigo-900 font-semibold ring-1 ring-indigo-300'
                    : 'hover:bg-gray-50 text-gray-800'
                  }`}
              >
                <span>{quiz.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{quiz.difficulty}</span>
              </Link>
            )
          })}

          {/* Custom Worksheet Button for mobile */}
          <Link
            href="/ai-tools"
            onClick={() => {
              handleCustomWorksheetClick()
              setShowMobileMenu(false)
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors mt-2"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            Custom Worksheet
          </Link>
        </div>
      </div>

      {/* Mobile Floating Buttons */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {/* Other Sets Button */}
        <button
          onClick={() => setShowMobileMenu(prev => !prev)}
          className="flex items-center justify-center p-3 rounded-full bg-gray-100 text-gray-800 shadow-md hover:bg-gray-200"
          title="View Other Sets"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Print Button */}
        <button
          onClick={handleOpenModal}
          disabled={!currentQuiz}
          className="flex items-center justify-center p-3 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
          title="Download Current Set"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}