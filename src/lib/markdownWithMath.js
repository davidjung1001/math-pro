import { marked } from 'marked'
import DOMPurify from 'dompurify'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// small escape helper used only when KaTeX fails
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderContent(raw) {
  if (!raw) return { __html: '' }
  let s = String(raw)

  // 1) Render display math $$...$$
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false })
    } catch (e) {
      console.warn('KaTeX display error', e)
      return `<pre>${escapeHtml(math)}</pre>`
    }
  })

  // 2) Render inline math $...$ (avoid matching $$)
  s = s.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: false, throwOnError: false })
    } catch (e) {
      console.warn('KaTeX inline error', e)
      return `<code>${escapeHtml(math)}</code>`
    }
  })

  // 3) Convert Markdown -> HTML
  const htmlFromMarkdown = marked.parse(s || '')

  // 4) Sanitize final HTML
  const clean = DOMPurify.sanitize(htmlFromMarkdown, {
    ALLOWED_ATTR: ['class', 'id', 'href', 'name', 'target', 'rel', 'style'],
  })

  return { __html: clean }
}