'use client'

import { useState, useRef } from "react"
import { Upload, Image as ImageIcon, Sparkles, FileText, AlertCircle, Camera, CheckCircle, Download } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { getHybridTracking } from "@/lib/tracking/sessionStrategies"

export default function PictureToNotesTab() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [generatedNotes, setGeneratedNotes] = useState(null)
  const [outputFormat, setOutputFormat] = useState("organized")
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPG, PNG, etc.)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB")
      return
    }

    setImageFile(file)
    setError("")
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!imageFile) {
      setError("Please upload an image first")
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
        num_questions: 1
      })
    } catch (err) {
      console.error('Tracking error:', err)
    }
    
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 8))
    }, 400)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result

        const res = await fetch("/api/ai-tool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolType: "PictureToNotes",
            inputData: { 
              image: base64Image,
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
      }
      
      reader.readAsDataURL(imageFile)
      
    } catch (err) {
      clearInterval(progressInterval)
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate notes. Please try again.")
      setLoading(false)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (!generatedNotes) return
    
    const element = document.createElement("a")
    const file = new Blob([generatedNotes.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `notes-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const resetTool = () => {
    setImageFile(null)
    setImagePreview(null)
    setGeneratedNotes(null)
    setError("")
  }

  // Simple markdown-to-HTML renderer
  const renderMarkdown = (text) => {
    if (!text) return ''
    
    return text
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-purple-300 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-pink-300 mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // Italics
      .replace(/\*(.+?)\*/g, '<em class="text-indigo-300">$1</em>')
      // Bullet points
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-700 my-4" />')
      // Line breaks
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
                    Upload Your Notes
                  </label>
                  
                  {!imagePreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 transition-all bg-gray-800/20 hover:bg-gray-800/40"
                    >
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Click to upload or drag & drop</p>
                      <p className="text-gray-600 text-sm">PNG, JPG, or JPEG (max 10MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-700">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded notes" 
                        className="w-full h-auto max-h-96 object-contain bg-gray-800"
                      />
                      <button
                        onClick={resetTool}
                        className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </div>
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
                        Analyzing image and generating notes...
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
                  disabled={loading || !imageFile}
                  className="w-full sm:w-auto px-10 py-4 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center gap-2 justify-center group uppercase tracking-widest text-sm"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {loading ? "Processing..." : "Generate Notes"}
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

                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 justify-center"
                >
                  <Download className="w-5 h-5" />
                  Download Notes
                </button>
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