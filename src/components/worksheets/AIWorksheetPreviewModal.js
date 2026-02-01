'use client'

import { useRef, useState, useEffect } from 'react'
import { X, Printer } from 'lucide-react'
import KaTeXRenderer from '@/components/KaTeXRenderer'
import { supabase } from '@/lib/supabaseClient'
import LoginModal from '@/components/auth/LoginModal'

export default function AIWorksheetPreviewModal({
  previewData,
  includeAnswers = false,
  setIncludeAnswers,
  includeChoices = true,
  setIncludeChoices,
  onClose
}) {
  const printableRef = useRef()
  const [pages, setPages] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)

  // Auth check on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!previewData || !previewData.questions) return

    const paginateQuestions = () => {
      const PAGE_HEIGHT = 950 // Approximate usable height in pixels for 11in page
      const HEADER_HEIGHT = 150
      const QUESTION_BASE_HEIGHT = 80
      const OPTION_HEIGHT = 30
      const BLANK_ANSWER_HEIGHT = 60

      let currentPage = []
      let currentHeight = HEADER_HEIGHT
      const allPages = []

      previewData.questions.forEach((q, idx) => {
        let questionHeight = QUESTION_BASE_HEIGHT
        
        if (includeChoices) {
          const optionCount = ['a', 'b', 'c', 'd'].filter(opt => q[`option_${opt}`]).length
          questionHeight += optionCount * OPTION_HEIGHT
        } else {
          questionHeight += BLANK_ANSWER_HEIGHT
        }

        if (currentHeight + questionHeight > PAGE_HEIGHT && currentPage.length > 0) {
          allPages.push([...currentPage])
          currentPage = [q]
          currentHeight = questionHeight
        } else {
          currentPage.push(q)
          currentHeight += questionHeight
        }
      })

      if (currentPage.length > 0) {
        allPages.push(currentPage)
      }

      setPages(allPages)
    }

    paginateQuestions()
  }, [previewData, includeChoices])

  if (!previewData) return null
  
  const { questions, subsectionTitle, sectionName, courseName, quizName, difficulty } = previewData

  const handlePrint = () => {
    // AUTH GATE: Block print if no user is found
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!printableRef.current) return
    printableRef.current.style.display = 'block'
    window.print()
    printableRef.current.style.display = 'none'
  }

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    setShowLoginModal(false)
  }

  return (
    <>
      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm no-print">
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {/* Preview Modal */}
      <div className="modal-root fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl lg:max-w-5xl h-[90vh] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{quizName}</h2>
              <p className="text-xs sm:text-sm text-gray-400">{subsectionTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Preview with Multiple Pages */}
          <div className="flex-1 overflow-auto bg-gray-800 p-8">
            {pages.map((pageQuestions, pageIdx) => {
              const startIdx = pages.slice(0, pageIdx).reduce((sum, p) => sum + p.length, 0)
              
              return (
                <div 
                  key={`page-${pageIdx}`}
                  className="max-w-[8.5in] mx-auto bg-white text-black p-12 rounded-lg shadow-2xl mb-8" 
                  style={{ minHeight: '11in', aspectRatio: '8.5 / 11' }}
                >
                  {pageIdx === 0 && (
                    <>
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">{subsectionTitle}</h1>
                        <p className="text-sm text-gray-600">{sectionName} • {courseName}</p>
                        <p className="text-sm text-gray-600">{quizName} — {difficulty}</p>
                      </div>

                      <hr className="border-gray-300 mb-6" />

                      <p className="text-sm mb-6">
                        {includeChoices 
                          ? 'Instructions: Choose the best answer for each question.' 
                          : 'Instructions: Answer each question. Show your work.'}
                      </p>
                    </>
                  )}

                  {pageQuestions.map((q, localIdx) => {
                    const globalIdx = startIdx + localIdx
                    return (
                      <div key={q.id || globalIdx} className="mb-8">
                        <div className="font-semibold mb-3">
                          <KaTeXRenderer content={`${globalIdx + 1}. ${q.question_text || ''}`} />
                        </div>

                        {includeChoices ? (
                          <div className="pl-6">
                            {['a', 'b', 'c', 'd'].map(opt => {
                              const optionText = q[`option_${opt}`]
                              return optionText ? (
                                <div key={opt} className="mb-2 flex items-start gap-2">
                                  <span className="font-semibold min-w-[28px] flex-shrink-0">{opt.toUpperCase()}.</span>
                                  <div className="flex-1">
                                    <KaTeXRenderer content={optionText} />
                                  </div>
                                </div>
                              ) : null
                            })}
                          </div>
                        ) : (
                          <div className="h-12 border-b border-dashed border-gray-300 mt-2" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {includeAnswers && (
              <div className="max-w-[8.5in] mx-auto bg-white text-black p-12 rounded-lg shadow-2xl" style={{ minHeight: '11in', aspectRatio: '8.5 / 11' }}>
                <h2 className="text-2xl font-bold mb-6 border-b-4 border-gray-800 pb-3">Answer Key</h2>
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="mb-4">
                    <div className="font-semibold">
                      {idx + 1}. Answer: {q.correct_option || 'N/A'}
                    </div>
                    {q.short_explanation && (
                      <div className="text-sm text-gray-600 mt-1 pl-4">
                        <KaTeXRenderer content={q.short_explanation} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <input 
                  type="checkbox" 
                  checked={includeChoices} 
                  onChange={e => setIncludeChoices(e.target.checked)} 
                  className="w-4 h-4 text-emerald-500 rounded" 
                />
                Include answer choices
              </label>
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <input 
                  type="checkbox" 
                  checked={includeAnswers} 
                  onChange={e => setIncludeAnswers(e.target.checked)} 
                  className="w-4 h-4 text-emerald-500 rounded" 
                />
                Include answer key
              </label>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
              <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition">Close</button>
              <button onClick={handlePrint} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN PRINTABLE COPY */}
      <div ref={printableRef} className="print-container" style={{ display: 'none' }}>
        <div style={{ padding: '20px', maxWidth: '8.5in', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{subsectionTitle}</h1>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{sectionName} • {courseName}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{quizName} — {difficulty}</p>
          </div>

          <p style={{ fontSize: '12px', marginBottom: '20px' }}>
            {includeChoices 
              ? 'Instructions: Choose the best answer for each question.' 
              : 'Instructions: Answer each question. Show your work.'}
          </p>

          {questions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                <KaTeXRenderer content={`${idx + 1}. ${q.question_text || ''}`} />
              </div>
              {includeChoices ? (
                <div style={{ paddingLeft: '24px' }}>
                  {['a','b','c','d'].map(opt => {
                    const optionText = q[`option_${opt}`]
                    return optionText ? (
                      <div key={opt} style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontWeight: '600', minWidth: '28px', flexShrink: 0 }}>{opt.toUpperCase()}.</span>
                        <div style={{ flex: 1 }}>
                          <KaTeXRenderer content={optionText} />
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <div style={{ height: '40px', borderBottom: '1px dashed #ccc', marginTop: '8px' }} />
              )}
            </div>
          ))}

          {includeAnswers && (
            <div style={{ pageBreakBefore: 'always', paddingTop: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '3px solid #333', paddingBottom: '8px' }}>
                Answer Key
              </h2>
              {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
                  <div style={{ fontWeight: '600' }}>
                    {idx + 1}. Answer: {q.correct_option || 'N/A'}
                  </div>
                  {q.short_explanation && (
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', paddingLeft: '16px' }}>
                      <KaTeXRenderer content={q.short_explanation} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 0.75in;
            size: letter;
          }
        }
      `}</style>
    </>
  )
}