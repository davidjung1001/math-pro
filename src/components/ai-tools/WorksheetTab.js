'use client'

import { useState } from "react"
import AIWorksheetPreviewModal from "@/components/worksheets/AIWorksheetPreviewModal"
import { AlertCircle, Sparkles } from "lucide-react"
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

  // Example prompts for inspiration
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
    
    // Track the generation
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
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Form */}
        <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Topic */}
          <div className="p-6 sm:p-8 border-b-2 border-black">
            <label className="block text-xs font-black tracking-widest uppercase text-black mb-3">
              Worksheet Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quadratic Equations, Pythagorean Theorem, Photosynthesis"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-sm"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(prompt)}
                  className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Number & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-black border-b-2 border-black">
            <div className="p-6 sm:p-8">
              <label className="block text-xs font-black tracking-widest uppercase text-black mb-3">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors text-sm"
              />
              {numQuestions > 10 && (
                <p className="mt-2 text-xs text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Log in for 10+ questions
                </p>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <label className="block text-xs font-black tracking-widest uppercase text-black mb-3">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-3 text-sm font-bold transition-colors ${
                      difficulty === level
                        ? 'bg-black text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6 sm:p-8 border-b-2 border-black">
            <label className="block text-xs font-black tracking-widest uppercase text-black mb-3">
              Additional Instructions{' '}
              <span className="font-normal normal-case tracking-normal text-gray-400">optional</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Focus on word problems, include real-world examples, use metric units..."
              className="w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors h-28 resize-none text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 sm:px-8 py-4 bg-red-50 border-b border-red-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Progress */}
          {loading && (
            <div className="px-6 sm:px-8 py-5 border-b-2 border-black bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-black">Generating...</span>
                <span className="text-sm font-bold text-black">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200">
                <div
                  className="h-full bg-black transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Creating {numQuestions} {difficulty.toLowerCase()} questions about {topic}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span>100% Free</span>
              <span>No Sign-up</span>
              <span>Instant Results</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate Worksheet'}
            </button>
          </div>
        </div>

        {/* Preview Modal */}
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