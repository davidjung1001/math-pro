'use client'

import { useRef, useState, useEffect } from 'react'
import { X, Printer } from 'lucide-react'

// RENDERING TOOLS FROM THE "GOOD" MODAL
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex' 
import 'katex/dist/katex.min.css'

const MarkdownKaTeX = ({ content, className, style }) => (
  <div className={className} style={style}>
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        p: ({ node, ...props }) => <span {...props} />,
      }}
    >
      {preprocessForKaTeX(content)}
    </ReactMarkdown>
  </div>
);

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

  useEffect(() => {
    if (!previewData || !previewData.questions) return

    const paginateQuestions = () => {
      const PAGE_HEIGHT = 900 
      const HEADER_HEIGHT = 150
      const QUESTION_BASE_HEIGHT = 80
      const OPTION_HEIGHT = 30
      const BLANK_ANSWER_HEIGHT = 60

      let currentPage = []
      let currentHeight = HEADER_HEIGHT
      const allPages = []

      previewData.questions.forEach((q) => {
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

      if (currentPage.length > 0) allPages.push(currentPage)
      setPages(allPages)
    }

    paginateQuestions()
  }, [previewData, includeChoices])

  if (!previewData) return null
  const { questions, subsectionTitle, sectionName, courseName, quizName, difficulty } = previewData

  const handlePrint = () => {
    if (!printableRef.current) return
    printableRef.current.style.display = 'block'
    window.print()
    printableRef.current.style.display = 'none'
  }

  return (
    <>
      <div className="modal-root fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl lg:max-w-5xl h-[90vh] flex flex-col overflow-hidden">
          
          <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{quizName}</h2>
              <p className="text-xs sm:text-sm text-gray-400">{subsectionTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200"><X /></button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-800 p-8">
            {pages.map((pageQuestions, pageIdx) => {
              // Calculate the starting number for this specific page
              const startNumber = pages.slice(0, pageIdx).reduce((sum, p) => sum + p.length, 0) + 1;
              
              return (
                <div key={pageIdx} className="max-w-[8.5in] mx-auto bg-white text-black p-12 rounded-lg shadow-2xl mb-8" style={{ minHeight: '11in' }}>
                  {pageIdx === 0 && (
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold mb-2 uppercase">{subsectionTitle}</h1>
                      <p className="text-sm text-gray-600">{sectionName} • {courseName} • {difficulty}</p>
                      <hr className="border-gray-300 my-6" />
                    </div>
                  )}

                  {pageQuestions.map((q, localIdx) => (
                    <div key={localIdx} className="mb-8">
                      <div className="font-semibold mb-3">
                        {/* GLOBAL NUMBERING FIXED HERE */}
                        <MarkdownKaTeX content={`${startNumber + localIdx}. ${q.question_text}`} />
                      </div>
                      {includeChoices ? (
                        <div className="pl-6 space-y-2">
                          {['a', 'b', 'c', 'd'].map(opt => q[`option_${opt}`] && (
                            <div key={opt} className="flex gap-2">
                              <span className="font-semibold min-w-[28px]">{opt.toUpperCase()}.</span>
                              <MarkdownKaTeX content={q[`option_${opt}`]} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-12 border-b border-dashed border-gray-300 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )
            })}

            {includeAnswers && (
              <div className="max-w-[8.5in] mx-auto bg-white text-black p-12 rounded-lg shadow-2xl" style={{ minHeight: '11in' }}>
                <h2 className="text-2xl font-bold mb-6 border-b-4 border-black pb-2">Answer Key</h2>
                {questions.map((q, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="font-bold">{idx + 1}. Answer: {q.correct_option}</p>
                    {q.short_explanation && <MarkdownKaTeX className="text-sm text-gray-600 pl-4 mt-1" content={q.short_explanation} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-700 bg-gray-900 flex justify-between items-center">
             <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={includeChoices} onChange={e => setIncludeChoices(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                Include Choices
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={includeAnswers} onChange={e => setIncludeAnswers(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                Include Answers
              </label>
            </div>
            <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* --- HIDDEN PRINTABLE CONTAINER --- */}
      <div ref={printableRef} className="print-container" style={{ display: 'none' }}>
        {pages.map((pageQuestions, pageIdx) => {
          const startNumber = pages.slice(0, pageIdx).reduce((sum, p) => sum + p.length, 0) + 1;
          return (
            <div key={pageIdx} style={{ padding: '0.75in', pageBreakAfter: 'always', color: 'black', background: 'white' }}>
              {pageIdx === 0 && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '24pt', fontWeight: 'bold' }}>{subsectionTitle}</h1>
                  <p style={{ fontSize: '10pt' }}>{sectionName} • {courseName}</p>
                </div>
              )}

              {pageQuestions.map((q, localIdx) => (
                <div key={localIdx} style={{ marginBottom: '25px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {/* GLOBAL NUMBERING FIXED FOR PRINT HERE */}
                    <MarkdownKaTeX content={`${startNumber + localIdx}. ${q.question_text}`} />
                  </div>
                  {includeChoices && (
                    <div style={{ paddingLeft: '25px' }}>
                      {['a','b','c','d'].map(opt => q[`option_${opt}`] && (
                        <div key={opt} style={{ marginBottom: '5px', display: 'flex', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold' }}>{opt.toUpperCase()}.</span>
                          <MarkdownKaTeX content={q[`option_${opt}`]} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}

        {includeAnswers && (
          <div style={{ padding: '0.75in', pageBreakBefore: 'always', color: 'black' }}>
            <h2 style={{ fontSize: '18pt', fontWeight: 'bold', borderBottom: '2px solid black' }}>Answer Key</h2>
            {questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold' }}>{idx + 1}. Answer: {q.correct_option}</div>
                {q.short_explanation && <MarkdownKaTeX content={q.short_explanation} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </>
  )
}