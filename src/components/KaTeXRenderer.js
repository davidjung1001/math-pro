'use client'

import { useEffect, useRef } from 'react'
import 'katex/dist/katex.min.css'
import renderMathInElement from 'katex/contrib/auto-render'
import { preprocessForKaTeX } from '@/lib/utils/katexUtils'

export default function KaTeXRenderer({ content }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && content) {
      try {
        // Preprocess text (strip HTML, apply subscripts, remove \( \) and \text{})
        const cleanContent = preprocessForKaTeX(content)
        
        // Set the text content
        ref.current.textContent = cleanContent
        
        // Auto-render math using KaTeX delimiters
        renderMathInElement(ref.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false
        })
        
        // After KaTeX renders, replace the placeholder with actual $
        ref.current.innerHTML = ref.current.innerHTML.replace(/\\textdollar\s*/g, '$')
      } catch (err) {
        console.error('KaTeX render error:', err)
        ref.current.textContent = content // fallback
      }
    }
  }, [content])

  return <span ref={ref} suppressHydrationWarning />
}