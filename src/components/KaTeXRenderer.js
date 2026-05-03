'use client'

import { useEffect, useRef } from 'react'
import 'katex/dist/katex.min.css'
import renderMathInElement from 'katex/contrib/auto-render'

// Minimal preprocessing: normalize delimiters, strip HTML/markdown artifacts.
// Deliberately does NOT wrap bare LaTeX commands in $...$  since content from
// the AI route already arrives with proper $...$ / $$...$$ delimiters and
// double-wrapping breaks KaTeX rendering.
function preprocessContent(text) {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/\*\*(.*?)\*\*/g, '$1')   // strip bold markers
    .replace(/\\\(/g, '$')             // \( → $
    .replace(/\\\)/g, '$')             // \) → $
    .replace(/\\\[/g, '$$')            // \[ → $$
    .replace(/\\\]/g, '$$')            // \] → $$
    .replace(/\\\$/g, '\\textdollar ') // escape literal \$
    .trim()
}

export default function KaTeXRenderer({ content }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && content) {
      try {
        ref.current.textContent = preprocessContent(content)
        renderMathInElement(ref.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        })
        ref.current.innerHTML = ref.current.innerHTML.replace(/\\textdollar\s*/g, '$')
      } catch (err) {
        console.error('KaTeX render error:', err)
        ref.current.textContent = content
      }
    }
  }, [content])

  return <span ref={ref} suppressHydrationWarning />
}