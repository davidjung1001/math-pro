'use client'

export default function PrintButton({ url }) {
  const handlePrintPDF = async () => {
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!res.ok) throw new Error('PDF generation failed.')

      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = 'worksheet.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error(err)
      alert('Failed to generate PDF.')
    }
  }

  return (
    <button
      onClick={handlePrintPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
    >
      Print PDF
    </button>
  )
}
