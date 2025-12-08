'use client'

import { useState } from "react"
import AIWorksheetPreviewModal from "@/components/worksheets/AIWorksheetPreviewModal"
import { AlertCircle } from "lucide-react"
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
    
    // Track the generation WHEN THEY CLICK GENERATE
    try {
      const { visitorId } = getHybridTracking()
      await supabase.from('ai_generations').insert({
        visitor_id: visitorId,
        topic: topic,
        num_questions: parseInt(numQuestions)
      })
    } catch (err) {
      console.error('Tracking error:', err)
      // Don't block if tracking fails
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
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-white mb-1">AI Worksheet Generator</h1>
            <p className="text-slate-400 text-sm">Create custom practice worksheets powered by AI</p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            
            {/* Topic Input */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                What topic should the worksheet cover?
              </label>
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g., Quadratic Equations, Pythagorean Theorem, Photosynthesis" 
                className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            {/* Grid: Number & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Number of questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                {numQuestions > 10 && (
                  <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Log in to generate 10+ questions
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Difficulty level
                </label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Additional instructions or context (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Be as descriptive as possible. Example: Focus on word problems, include real-world applications, use metric units..."
                className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all h-28 resize-none"
              />
              <p className="text-slate-500 text-xs mt-1">
                💡 Tip: The more specific you are, the better your worksheet will be
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Generating worksheet...</span>
                  <span className="text-blue-400 font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button 
              onClick={handleGenerate} 
              disabled={loading || !canGenerate}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-semibold rounded-lg text-white transition-all shadow-lg shadow-blue-500/20 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Generating..." : "Generate Worksheet"}
            </button>
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