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
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Main Generator Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Card Header with gradient accent */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
            <div className="bg-white rounded-t-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Worksheet Generator</h2>
              </div>
              <p className="text-gray-600">Fill in the details below to create your custom practice worksheet</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Topic Input with enhanced design */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-900 font-semibold">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Worksheet Topic
              </label>
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g., Quadratic Equations, Pythagorean Theorem, Photosynthesis" 
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              
              {/* Example prompts */}
              <div className="flex items-start gap-2 mt-3">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTopic(prompt)}
                        className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid: Number & Difficulty with better styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-900 font-semibold">
                  Number of Questions
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  {numQuestions > 10 && (
                    <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-amber-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>Log in for 10+ questions</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-900 font-semibold">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-3 rounded-xl font-medium transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Textarea with enhanced design */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-900 font-semibold">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Additional Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add specific requirements like: 'Focus on word problems', 'Include real-world examples', 'Use metric units', etc."
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-none"
              />
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span>💡</span>
                <span>The more specific you are, the better your worksheet will be</span>
              </p>
            </div>

            {/* Error Message with better styling */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Progress Bar with animation */}
            {loading && (
              <div className="space-y-3 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-900 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generating your worksheet...
                  </span>
                  <span className="text-indigo-700 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-indigo-700">
                  Creating {numQuestions} {difficulty.toLowerCase()} questions about {topic}...
                </p>
              </div>
            )}

            {/* Generate Button with gradient */}
            <button 
              onClick={handleGenerate} 
              disabled={loading || !canGenerate}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 font-bold rounded-xl text-white transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 justify-center group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {loading ? "Generating..." : "Generate Worksheet"}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Sign-up Required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Instant Results</span>
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