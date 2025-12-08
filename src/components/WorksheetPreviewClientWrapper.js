'use client'

import { useState } from 'react'
import WorksheetPreviewModal from '@/components/worksheets/WorksheetPreviewModal'

export default function WorksheetPreviewClientWrapper({ previewData, isPremium }) {
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [includeChoices, setIncludeChoices] = useState(true)

  return (
    <WorksheetPreviewModal
      previewData={previewData}
      includeAnswers={includeAnswers}
      setIncludeAnswers={setIncludeAnswers}
      includeChoices={includeChoices}
      setIncludeChoices={setIncludeChoices}
      isPremium={isPremium}
      onClose={() => {}}
    />
  )
}
