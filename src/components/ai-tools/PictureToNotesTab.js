'use client'

import { useState, useRef } from "react"
import { Upload, Image as ImageIcon, Sparkles, FileText, AlertCircle, Camera, CheckCircle, Download, X } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { getHybridTracking } from "@/lib/tracking/sessionStrategies"
import { jsPDF } from "jspdf"

export default function PictureToNotesTab() {
  const [imageFiles, setImageFiles] = useState([]) // Changed to array
  const [imagePreviews, setImagePreviews] = useState([]) // Changed to array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [generatedNotes, setGeneratedNotes] = useState(null)
  const [outputFormat, setOutputFormat] = useState("organized")
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate each file
    const validFiles = []
    const newPreviews = []

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError("Please upload only valid image files (JPG, PNG, etc.)")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be less than 10MB")
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setImageFiles(prev => [...prev, ...validFiles])
    setError("")
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (imageFiles.length === 0) {
      setError("Please upload at least one image")
      return
    }

    setError("")
    setLoading(true)
    setProgress(0)
    
    try {
      const { visitorId } = getHybridTracking()
      await supabase.from('ai_generations').insert({
        visitor_id: visitorId,
        topic: 'Picture to Notes',
        num_questions: imageFiles.length
      })
    } catch (err) {
      console.error('Tracking error:', err)
    }
    
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 5))
    }, 500)

    try {
      // Convert all images to base64
      const base64Images = await Promise.all(
        imageFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(file)
          })
        })
      )

      const res = await fetch("/api/ai-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "PictureToNotes",
          inputData: { 
            images: base64Images, // Changed to array
            outputFormat 
          }
        }),
      })

      if (!res.ok) throw new Error("Failed to generate notes")

      const data = await res.json()
      setProgress(100)
      clearInterval(progressInterval)
      
      setTimeout(() => {
        setGeneratedNotes(data.notes)
        setLoading(false)
        setProgress(0)
      }, 500)
      
    } catch (err) {
      clearInterval(progressInterval)
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate notes. Please try again.")
      setLoading(false)
      setProgress(0)
    }
  }

  const handleDownloadPDF = () => {
    if (!generatedNotes) return
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - (margin * 2)
    let y = margin

    // Title
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text("Study Notes", margin, y)
    y += 15

    // Process markdown content
    const lines = generatedNotes.content.split('\n')
    
    lines.forEach(line => {
      // Check if we need a new page
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }

      // Headers
      if (line.startsWith('## ')) {
        doc.setFontSize(16)
        doc.setFont(undefined, 'bold')
        const text = line.replace('## ', '')
        doc.text(text, margin, y)
        y += 10
      } else if (line.startsWith('### ')) {
        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        const text = line.replace('### ', '')
        doc.text(text, margin, y)
        y += 8
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text
        doc.setFontSize(12)
        doc.setFont(undefined, 'bold')
        const text = line.replace(/\*\*/g, '')
        const splitText = doc.splitTextToSize(text, maxWidth)
        doc.text(splitText, margin, y)
        y += splitText.length * 6
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        // Bullet points
        doc.setFontSize(11)
        doc.setFont(undefined, 'normal')
        const text = line.replace(/^[-•]\s*/, '')
        const splitText = doc.splitTextToSize(text, maxWidth - 10)
        doc.text('•', margin + 5, y)
        doc.text(splitText, margin + 15, y)
        y += splitText.length * 6
      } else if (line.trim() === '---') {
        // Horizontal line
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageWidth - margin, y)
        y += 8
      } else if (line.trim() !== '') {
        // Normal text
        doc.setFontSize(11)
        doc.setFont(undefined, 'normal')
        // Remove markdown formatting
        const cleanText = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
        const splitText = doc.splitTextToSize(cleanText, maxWidth)
        doc.text(splitText, margin, y)
        y += splitText.length * 6
      } else {
        // Empty line
        y += 4
      }
    })

    doc.save(`notes-${Date.now()}.pdf`)
  }

  const handleCopyToClipboard = () => {
    if (!generatedNotes) return
    
    // Convert markdown to plain text for clipboard
    const plainText = generatedNotes.content
      .replace(/^##\s+/gm, '')
      .replace(/^###\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
    
    navigator.clipboard.writeText(plainText)
    alert('Notes copied to clipboard!')
  }

  const resetTool = () => {
    setImageFiles([])
    setImagePreviews([])
    setGeneratedNotes(null)
    setError("")
  }

  // Simple markdown-to-HTML renderer
  const renderMarkdown = (text) => {
    if (!text) return ''
    
    return text
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-purple-300 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-pink-300 mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-indigo-300">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^---$/gm, '<hr class="border-gray-700 my-4" />')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center bg-gray-950 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_-12px_rgba(236,72,153,0.5)] border border-gray-800 overflow-hidden">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[1px]">
            <div className="bg-gray-900 rounded-t-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-500/10 border border-pink-500/50 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                  <Camera className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Picture to Notes AI</h2>
              </div>
              <p className="text-gray-400">Transform messy handwritten notes into organized study material instantly</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {!generatedNotes ? (
              <>
                {/* Upload Section */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-pink-300 font-semibold text-sm uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4" />
                    Upload Your Notes ({imageFiles.length} image{imageFiles.length !== 1 ? 's' : ''} selected)
                  </label>
                  
                  {imagePreviews.length === 0 ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 transition-all bg-gray-800/20 hover:bg-gray-800/40"
                    >
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Click to upload or drag & drop</p>
                      <p className="text-gray-600 text-sm">PNG, JPG, or JPEG (max 10MB each)</p>
                      <p className="text-gray-500 text-xs mt-2">You can upload multiple images at once!</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Image Previews Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative rounded-xl overflow-hidden border border-gray-700 group">
                            <img 
                              src={preview} 
                              alt={`Note ${index + 1}`} 
                              className="w-full h-40 object-cover bg-gray-800"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-white text-xs font-medium">Image {index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add More Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-pink-500 transition-all flex items-center gap-2 justify-center"
                      >
                        <Upload className="w-4 h-4" />
                        Add More Images
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Output Format Selection */}
                <div className="space-y-2">
                  <label className="block text-pink-300 font-semibold text-sm uppercase tracking-wider">
                    Output Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'organized', label: 'Organized Notes', icon: FileText },
                      { value: 'flashcards', label: 'Flashcards', icon: Sparkles },
                      { value: 'summary', label: 'Summary', icon: CheckCircle }
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setOutputFormat(format.value)}
                        className={`p-4 rounded-xl font-medium transition-all border flex items-center gap-2 justify-center ${
                          outputFormat === format.value
                            ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                            : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                        }`}
                      >
                        <format.icon className="w-4 h-4" />
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-800/50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-200 font-medium text-sm">{error}</p>
                  </div>
                )}

                {/* Progress Bar */}
                {loading && (
                  <div className="space-y-3 p-4 bg-pink-950/20 border border-pink-800/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-pink-300 font-medium flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                        Analyzing {imageFiles.length} image{imageFiles.length !== 1 ? 's' : ''} and generating notes...
                      </span>
                      <span className="text-purple-400 font-mono font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button 
                  onClick={handleGenerate} 
                  disabled={loading || imageFiles.length === 0}
                  className="w-full sm:w-auto px-10 py-4 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center gap-2 justify-center group uppercase tracking-widest text-sm"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {loading ? "Processing..." : `Generate Notes from ${imageFiles.length} Image${imageFiles.length !== 1 ? 's' : ''}`}
                </button>
              </>
            ) : (
              /* Results Section */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Your Notes Are Ready!
                  </h3>
                  <button
                    onClick={resetTool}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Generate New
                  </button>
                </div>

                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                  <div 
                    className="text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedNotes.content) }}
                  />
                </div>

                {/* Download Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 justify-center"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 justify-center"
                  >
                    <FileText className="w-5 h-5" />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          <div className="flex items-center gap-2 hover:text-pink-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_pink]" />
            <span>OCR Technology</span>
          </div>
          <div className="flex items-center gap-2 hover:text-purple-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_purple]" />
            <span>AI Processing</span>
          </div>
          <div className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_indigo]" />
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  )
}