// lib/renderContentWithMath.js
import katex from 'katex'
import 'katex/dist/katex.min.css'

export const fixMathSymbols = (text) => {
  if (!text) return ''
  return text
    // NOTE: For the web preview, you might consider removing these replacements
    // for symbols like \times, \div, \frac, etc., IF they only appear inside
    // math blocks. The KaTeX renderer handles the original LaTeX commands much better.
    .replace(/\\time/g, '×')
    .replace(/\\cdot/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\tfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\pi/g, 'π')
    .replace(/\\pm/g, '±')
    .replace(/\\times/g, '×')
    .replace(/\\neq/g, '≠')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\infty/g, '∞')
    .replace(/\\approx/g, '≈')
}

export const renderContent = (content) => {
  if (!content) return { __html: '' }

  const fixed = fixMathSymbols(content)
  let html = fixed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 🚀 FIX: Convert the common raw data format ( math ) into $math$
  // This looks for content in literal parentheses that contains a math symbol (now replaced with Unicode)
  // and wraps it in dollar signs for KaTeX to render.
  html = html.replace(
      // The regex looks for a literal '(' followed by content,
      // and checks if that content contains a common math symbol (×, ÷, etc.)
      // and then the closing ')'.
      /\((.*?([×÷√±≤≥≠∞≈]).*?)\)/g, 
      // The replacement wraps the captured content ($1) in dollar signs.
      '$$$$1$$'
  );
  // ----------------------------------------------------------------------

  // Handle display math $$...$$
  html = html.replace(/\$\$(.*?)\$\$/gs, (_, math) => {
    try { return katex.renderToString(math, { displayMode: true, throwOnError: false }) }
    catch { return math }
  })

  // Handle inline math $...$ (This will now catch the expressions we just wrapped)
  html = html.replace(/\$(.*?)\$/g, (_, math) => {
    try { return katex.renderToString(math, { displayMode: false, throwOnError: false }) }
    catch { return math }
  })

  // --- Handle \( ... \) inline math ---
  html = html.replace(/\\\((.*?)\\\)/g, (_, math) => {
    try { return katex.renderToString(math, { displayMode: false, throwOnError: false }) }
    catch { return math }
  })

  // --- Handle \[ ... \] display math ---
  html = html.replace(/\\\[(.*?)\\\]/g, (_, math) => {
    try { return katex.renderToString(math, { displayMode: true, throwOnError: false }) }
    catch { return math }
  })

  return { __html: html }
}