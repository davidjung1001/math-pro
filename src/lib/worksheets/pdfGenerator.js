// FILE: lib/worksheets/pdfGenerator.js
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateWorksheetPDF({
  courseTitle,
  sectionTitle,
  subsectionTitle,
  quizName,
  difficulty,
  questions,
  includeAnswers = false,
  includeChoices = true,
  returnBlob = false
}) {
  // Create a temporary container
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '210mm' // A4 width
  container.style.backgroundColor = 'white'
  container.style.padding = '20mm'
  container.style.boxSizing = 'border-box'
  container.style.fontFamily = 'Georgia, serif'
  container.style.fontSize = '12pt'
  container.style.lineHeight = '1.6'
  document.body.appendChild(container)

  // Build the HTML content
  let html = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 20pt; margin: 0 0 8px 0; font-weight: bold;">${subsectionTitle}</h1>
      <p style="font-size: 10pt; color: #666; margin: 4px 0;">${sectionTitle} • ${courseTitle}</p>
      <p style="font-size: 10pt; color: #666; margin: 4px 0;">${quizName} — ${difficulty}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
    <p style="font-size: 10pt; margin-bottom: 20px;">
      ${includeChoices 
        ? 'Instructions: Choose the best answer for each question.' 
        : 'Instructions: Answer each question. Show your work.'}
    </p>
  `

  // Add questions
  questions.forEach((q, idx) => {
    html += `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <div style="font-weight: 600; margin-bottom: 8px;">
          ${idx + 1}. <span class="math-content">${q.question_text || ''}</span>
        </div>
    `

    if (includeChoices) {
      html += '<ul style="list-style: none; padding-left: 20px; margin: 8px 0;">'
      ;['a', 'b', 'c', 'd'].forEach(opt => {
        const optionText = q[`option_${opt}`]
        if (optionText) {
          html += `
            <li style="margin-bottom: 6px;">
              <span style="font-weight: 600; margin-right: 8px;">${opt.toUpperCase()}.</span>
              <span class="math-content">${optionText}</span>
            </li>
          `
        }
      })
      html += '</ul>'
    } else {
      html += `
        <div style="height: 60px; border-bottom: 1px dashed #ddd; margin-top: 8px;"></div>
      `
    }

    html += '</div>'
  })

  // Add answer key if requested
  if (includeAnswers) {
    html += `
      <div style="page-break-before: always; padding-top: 20px;">
        <h2 style="font-size: 16pt; margin: 0 0 16px 0; font-weight: bold;">Answer Key</h2>
    `

    questions.forEach((q, idx) => {
      html += `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600;">${idx + 1}. Answer: ${q.correct_option || ''}</div>
      `
      if (q.short_explanation) {
        html += `
          <div style="font-size: 10pt; color: #666; margin-top: 4px; padding-left: 12px;">
            <span class="math-content">${q.short_explanation}</span>
          </div>
        `
      }
      html += '</div>'
    })

    html += '</div>'
  }

  container.innerHTML = html

  // Process LaTeX with KaTeX
  const mathElements = container.querySelectorAll('.math-content')
  for (const el of mathElements) {
    const text = el.textContent
    try {
      // Import KaTeX dynamically
      const katex = (await import('katex')).default
      
      // Parse and render inline math
      let processed = text
      const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g
      let lastIndex = 0
      let newHTML = ''
      
      let match
      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        newHTML += escapeHtml(text.slice(lastIndex, match.index))
        
        // Render math
        const latex = match[1] || match[2]
        const displayMode = !!match[1]
        try {
          newHTML += katex.renderToString(latex, {
            throwOnError: false,
            displayMode
          })
        } catch (e) {
          newHTML += escapeHtml(match[0])
        }
        
        lastIndex = regex.lastIndex
      }
      
      // Add remaining text
      newHTML += escapeHtml(text.slice(lastIndex))
      el.innerHTML = newHTML
    } catch (e) {
      console.error('KaTeX render error:', e)
    }
  }

  // Wait for fonts and rendering
  await new Promise(resolve => setTimeout(resolve, 500))

  // Capture with html2canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: container.scrollWidth,
    windowHeight: container.scrollHeight
  })

  // Create PDF
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  })

  const imgData = canvas.toDataURL('image/png')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * pdfWidth) / canvas.width

  // Handle multiple pages if content is long
  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  } else {
    let heightLeft = imgHeight
    let position = 0
    let page = 0

    while (heightLeft > 0) {
      if (page > 0) pdf.addPage()
      
      const sourceY = page * pdfHeight * (canvas.width / pdfWidth)
      const sourceHeight = Math.min(
        pdfHeight * (canvas.width / pdfWidth),
        canvas.height - sourceY
      )
      
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sourceHeight
      
      const ctx = pageCanvas.getContext('2d')
      ctx.drawImage(
        canvas,
        0, sourceY,
        canvas.width, sourceHeight,
        0, 0,
        canvas.width, sourceHeight
      )
      
      const pageImgData = pageCanvas.toDataURL('image/png')
      const pageImgHeight = (sourceHeight * pdfWidth) / canvas.width
      
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight)
      
      heightLeft -= pdfHeight
      page++
    }
  }

  // Add page numbers
  const totalPages = pdf.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(150)
    pdf.text(
      `Generated by StillyMathPro • Page ${i} of ${totalPages}`,
      pdfWidth / 2,
      pdfHeight - 5,
      { align: 'center' }
    )
  }

  // Cleanup
  document.body.removeChild(container)

  // Return or download
  if (returnBlob) {
    return pdf.output('blob')
  } else {
    const fileName = `${subsectionTitle.replace(/\s+/g, '_')}_${quizName.replace(/\s+/g, '_')}.pdf`
    pdf.save(fileName)
    return true
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}