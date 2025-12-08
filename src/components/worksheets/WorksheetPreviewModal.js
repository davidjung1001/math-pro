'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2, FileDown, X, Lock, Printer } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { getHybridTracking } from '@/lib/tracking/sessionStrategies'
import LoginModal from '@/components/auth/LoginModal'
// REMOVED: import KaTeXRenderer from '@/components/KaTeXRenderer' 

// NEW IMPORTS for Math Rendering (assuming these paths are correct for your project structure)
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex'; // Path must be correct

// --- Reusable KaTeX/Markdown Renderer Component for client-side ---
// This component replaces the functionality of KaTeXRenderer.
const MarkdownKaTeX = ({ content, className, style }) => (
  <div className={className} style={style}>
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      // Optional: Prevent wrapping if content is simple math
      components={{
        // Use a span for single lines or inline content to prevent extra <p> tags
        p: ({ node, ...props }) => <span {...props} />,
      }}
    >
      {preprocessForKaTeX(content)}
    </ReactMarkdown>
  </div>
);


export default function WorksheetPreviewModal({
  previewData,
  includeAnswers,
  setIncludeAnswers,
  includeChoices,
  setIncludeChoices,
  generating,
  onClose,
  onDownload,
  isPremium
}) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)
  const [startTime] = useState(Date.now())
  const printableRef = useRef()

  // Fetch current session
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    fetchUser()
  }, [])

  // Log interactions
  const logWorksheetInteraction = async ({ actionType }) => {
    if (!previewData) return
    const { visitorId, sessionId } = getHybridTracking()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000)

    try {
      await supabase.from('worksheet_interactions').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        user_id: userId,
        quiz_id: previewData.quizId,
        course_name: previewData.courseName,
        section_name: previewData.sectionName,
        subsection_name: previewData.subsectionTitle,
        action_type: actionType,
        time_to_action_seconds: actionType === 'preview' ? timeSpentSeconds : null,
        include_answers: includeAnswers,
        include_choices: includeChoices
      })
    } catch (err) {
      console.error('Logging failed', err)
    }
  }

  useEffect(() => {
    if (previewData) logWorksheetInteraction({ actionType: 'preview' })
  }, [previewData, includeAnswers, includeChoices])

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    setShowLoginModal(false)
  }

  if (!previewData) return null
  const { questions, subsectionTitle, sectionName, courseName, quizName, difficulty } = previewData

  console.log('User status after fetch:', user);
  console.log('isPremium prop value:', isPremium);

  // Print / Download
  const handlePrint = () => {
    console.log('Print button clicked. Checking login status...');
    console.log('isPremium:', isPremium, ' User:', user);

    if (isPremium && !user) {
    setShowLoginModal(true)
    return
  }

    if (!printableRef.current) return
    printableRef.current.style.display = 'block' // show printable area
    window.print()
    printableRef.current.style.display = 'none' // hide again
    logWorksheetInteraction({ actionType: 'print' })
  }

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm no-print">
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {/* Preview Modal */}
      <div className="modal-root fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 no-print">
        <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-3xl lg:max-w-5xl h-[90vh] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center no-print">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{quizName}</h2>
              <p className="text-xs sm:text-sm text-gray-400">{subsectionTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Preview */}
          <div className="flex-1 overflow-auto bg-gray-800 p-4 no-print">
            <div className="max-w-4xl mx-auto bg-white text-black p-8 rounded-lg shadow-lg">

              {/* Screen Preview */}
              <div>
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

                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="mb-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="font-semibold mb-3">
                      {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                      <MarkdownKaTeX content={`${idx + 1}. ${q.question_text || ''}`} />
                    </div>

                    {includeChoices ? (
                      <ul style={{ listStyle: 'none', paddingLeft: '0', margin: '8px 0' }}>
                        {['a', 'b', 'c', 'd'].map(opt => {
                          const optionText = q[`option_${opt}`]
                          return optionText ? (
                            <li key={opt} style={{ marginBottom: '6px', display: 'flex', gap: '8px' }}>
                              <span style={{ fontWeight: '600', minWidth: '24px' }}>{opt.toUpperCase()}.</span>
                              <span>
                                {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                                <MarkdownKaTeX content={optionText} style={{ display: 'inline' }} />
                              </span>
                            </li>
                          ) : null
                        })}
                      </ul>
                    ) : (
                      <div style={{ height: '50px', borderBottom: '1px dashed #ccc', marginTop: '8px' }} />
                    )}
                  </div>
                ))}

                {includeAnswers && (
                  <div className="mt-12 pt-8 border-t-4 border-gray-300 preview-page-break">
                    <h2 className="text-xl font-bold mb-6">Answer Key</h2>
                    {questions.map((q, idx) => (
                      <div key={q.id || idx} className="mb-4">
                        <div className="font-semibold">
                          {idx + 1}. Answer: {q.correct_option || 'N/A'}
                        </div>
                        {q.short_explanation && (
                          <div className="text-sm text-gray-600 mt-1 pl-4">
                            {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                            <MarkdownKaTeX content={q.short_explanation} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col gap-3 no-print">
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
                  disabled={!isPremium} 
                  className={`w-4 h-4 rounded ${isPremium ? 'text-emerald-500' : 'opacity-60 cursor-not-allowed'}`} 
                />
                Include answer key
                {!isPremium && <Lock className="w-4 h-4 text-gray-400" />}
              </label>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
              <button 
                onClick={onClose} 
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
              >
                Close
              </button>
              <button 
                onClick={handlePrint} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN PRINTABLE COPY */}
      <div ref={printableRef} className="print-container" style={{ display: 'none' }}>
        <div style={{ width: '100%', margin: '0 auto', padding: '5mm 5mm' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '30pt', fontWeight: 'bold', margin: '0 0 8px 0' }}>{subsectionTitle}</h1>
            <p style={{ fontSize: '10pt', color: '#666', margin: '4px 0' }}>{sectionName} • {courseName}</p>
            <p style={{ fontSize: '10pt', color: '#666', margin: '4px 0' }}>{quizName} — {difficulty}</p>
          </div>

          <p style={{ fontSize: '11pt', marginBottom: '20px' }}>
            {includeChoices 
              ? 'Instructions: Choose the best answer for each question.' 
              : 'Instructions: Answer each question. Show your work.'}
          </p>

          {questions.map((q, idx) => (
            <div key={idx} className="question-block" style={{ marginBottom: '20px', margin: '0 0 8px 0' }}>
              <div style={{ fontWeight: '600', marginBottom: '10px' }}>
                {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                <MarkdownKaTeX content={`${idx + 1}. ${q.question_text || ''}`} />
              </div>
              {includeChoices ? (
                <ul style={{ listStyle: 'none', paddingLeft: '0', margin: '8px 0' }}>
                  {['a','b','c','d'].map(opt => {
                    const optionText = q[`option_${opt}`]
                    return optionText ? (
                      <li key={opt} style={{ marginBottom: '6px', display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '600', minWidth: '24px' }}>{opt.toUpperCase()}.</span>
                        <span>
                            {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                            <MarkdownKaTeX content={optionText} style={{ display: 'inline' }} />
                        </span>
                      </li>
                    ) : null
                  })}
                </ul>
              ) : (
                <div style={{ height: '50px', borderBottom: '1px dashed #ccc', marginTop: '8px' }} />
              )}
            </div>
          ))}

          {includeAnswers && (
            // PAGE BREAK RESTORED HERE
            <div className="page-break" style={{ pageBreakBefore: 'always', paddingTop: '40mm' }}>
              <h2 style={{ fontSize: '18pt', fontWeight: 'bold', marginBottom: '20px' }}>Answer Key</h2>
              {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: '600' }}>{idx + 1}. Answer: {q.correct_option || 'N/A'}</div>
                  {q.short_explanation && (
                    <div style={{ fontSize: '10pt', color: '#666', marginTop: '4px', paddingLeft: '12px' }}>
                      {/* REPLACED KaTeXRenderer with MarkdownKaTeX */}
                      <MarkdownKaTeX content={q.short_explanation} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .preview-page-break {
          position: relative;
        }
        
        .preview-page-break::before {
          content: '';
          display: block;
          height: 40px;
          background: repeating-linear-gradient(
            to right,
            #e5e7eb 0px,
            #e5e7eb 10px,
            transparent 10px,
            transparent 20px
          );
          margin: 20px -32px 20px -32px;
        }
      `}</style>
    </>
  )
}