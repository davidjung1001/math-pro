'use client'

import { useState } from "react"
import AIWorksheetPreviewModal from "@/components/worksheets/AIWorksheetPreviewModal"
import { AlertCircle, Sparkles, FileText, BookOpen, Lightbulb } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { getHybridTracking } from "@/lib/tracking/sessionStrategies"

export default function WorksheetTab() {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("Medium")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const [previewData, setPreviewData] = useState(null)
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [includeChoices, setIncludeChoices] = useState(true)

  const examplePrompts = [
    "Pythagorean theorem word problems for 8th grade",
    "French vocabulary worksheet - food and restaurants",
    "Cell biology quiz for high school students",
    "American Revolution comprehension questions"
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }
    
    if (numQuestions < 1 || numQuestions > 20) {
      setError("Number of questions must be between 1 and 20")
      return
    }

    if (numQuestions > 10) {
      setError("Please log in to generate more than 10 questions")
      return
    }

    setError("")
    setLoading(true)
    setProgress(0)
    
    try {
      const { visitorId } = getHybridTracking()
      await supabase.from('ai_generations').insert({
        visitor_id: visitorId,
        topic: topic,
        num_questions: parseInt(numQuestions)
      })
    } catch (err) {
      console.error('Tracking error:', err)
    }
    
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 10))
    }, 300)

    try {
      const res = await fetch("/api/ai-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "Worksheet",
          inputData: { topic, notes, numQuestions: parseInt(numQuestions), difficulty }
        }),
      })

      if (!res.ok) throw new Error("Failed to generate worksheet")

      const data = await res.json()
      setProgress(100)
      clearInterval(progressInterval)
      
      setTimeout(() => {
        setPreviewData({
          questions: data.questions || [],
          subsectionTitle: topic,
          sectionName: difficulty,
          courseName: "AI Generated Worksheet",
          quizName: `${topic} Practice`,
          difficulty,
          locked: data.locked
        })
        setIncludeAnswers(!data.locked)
        setIncludeChoices(true)
        setLoading(false)
        setProgress(0)
      }, 500)
      
    } catch (err) {
      clearInterval(progressInterval)
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate worksheet. Please try again.")
      setLoading(false)
      setProgress(0)
    }
  }

  const canGenerate = topic.trim() && numQuestions >= 1 && numQuestions <= 10

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center bg-gray-950 min-h-screen">
      <div className="w-full max-w-4xl">
        {/* Main Generator Card with Glassmorphism */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] border border-gray-800 overflow-hidden">
          
          {/* Card Header with Cyberpunk Gradient */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-[1px]">
            <div className="bg-gray-900 rounded-t-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/50 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Worksheet Generator</h2>
              </div>
              <p className="text-gray-400">Deploy custom practice modules with high-fidelity AI generation</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-300 font-semibold text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Target Topic (Worksheet Title)
              </label>
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g., Organic Chemistry, Stoichiometry, Linear Algebra" 
                className="w-full p-4 bg-gray-800/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              
              <div className="flex items-start gap-2 mt-3">
                <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-widest">Inspiration:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTopic(prompt)}
                        className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-indigo-900/40 text-gray-300 hover:text-indigo-300 border border-gray-700 rounded-lg transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid: Number & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-indigo-300 font-semibold text-sm uppercase tracking-wider">
                  Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full p-4 bg-gray-800/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {numQuestions > 10 && (
                    <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-cyan-400 text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>Authorization required for 10+</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-indigo-300 font-semibold text-sm uppercase tracking-wider">
                  Complexity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-3 rounded-xl font-medium transition-all border ${
                        difficulty === level
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                          : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-300 font-semibold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                More Details (More the better to match your exact needs!)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify format, context, or style..."
                className="w-full p-4 bg-gray-800/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-28 resize-none"
              />
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
              <div className="space-y-3 p-4 bg-indigo-950/20 border border-indigo-800/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300 font-medium flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    Synthesizing Worksheet...
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button 
              onClick={handleGenerate} 
              disabled={loading || !canGenerate}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center gap-2 justify-center group uppercase tracking-widest text-sm"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {loading ? "Synthesizing..." : "Initiate Generation"}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          <div className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_indigo]" />
            <span>Encrypted Generation</span>
          </div>
          <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
            <span>Instant Preview</span>
          </div>
          <div className="flex items-center gap-2 hover:text-purple-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_purple]" />
            <span>Global Access</span>
          </div>
        </div>

        {/* AI Preview Modal */}
        {previewData && (
          <AIWorksheetPreviewModal
            previewData={previewData}
            includeAnswers={includeAnswers}
            setIncludeAnswers={setIncludeAnswers}
            includeChoices={includeChoices}
            setIncludeChoices={setIncludeChoices}
            onClose={() => setPreviewData(null)}
          />
        )}
      </div>
    </div>
  )
}