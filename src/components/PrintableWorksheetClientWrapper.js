'use client'

import { useState } from 'react'
import PrintableWorksheet from '@/components/worksheets/PrintableWorksheet'

export default function PrintableWorksheetClientWrapper({ subsection, quiz, questions, quizzes, slug, moduleSlug, subsectionSlug, quizIndex }) {
  const [includeChoices, setIncludeChoices] = useState(true)
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const openPreview = (quiz) => {
    setPreviewData(quiz)
    setShowPreview(true)
  }

  return (
    <PrintableWorksheet
      subsection={subsection}
      quiz={quiz}
      questions={questions}
      quizzes={quizzes}
      slug={slug}
      moduleSlug={moduleSlug}
      subsectionSlug={subsectionSlug}
      quizIndex={quizIndex}
      includeChoices={includeChoices}
      setIncludeChoices={setIncludeChoices}
      includeAnswers={includeAnswers}
      setIncludeAnswers={setIncludeAnswers}
      previewData={previewData}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      openPreview={openPreview}
    />
  )
}
