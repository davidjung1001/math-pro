'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Sparkles, FileDown, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function WorksheetGenerator({ 
  courseTitle, 
  sectionTitle, 
  subsectionTitle, 
  subsectionId,
  quizzes,
  slug,
  moduleSlug,
  subsectionSlug,
  backUrl 
}) {
  const [session, setSession] = useState(null)
  const [userPlan, setUserPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  // Check auth and fetch user session + plan
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session ?? null)
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single()
        
        setUserPlan(profileData?.plan || 'free')
      }
      
      setLoading(false)
    }

    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null)
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single()
        
        setUserPlan(profileData?.plan || 'free')
      } else {
        setUserPlan('free')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        <Link href={backUrl} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium">
          <span className="mr-2">←</span> Back to all worksheets
        </Link>

        <div className="mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold mb-3 shadow-sm">
            <Sparkles className="w-4 h-4" /> Free Worksheet Generator
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 text-gray-900">{subsectionTitle}</h1>
          <p className="text-sm sm:text-base text-gray-600">{courseTitle} • {sectionTitle}</p>
        </div>

        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-600">No practice sets available yet</p>
            </div>
          ) : (
            quizzes.map((quiz, idx) => {
              const isMastery = quiz.difficulty.toLowerCase() === 'mastery'
              const pdfUrl = `/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/${idx + 1}`

              return (
                <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* PDF Preview Thumbnail */}
                    <Link 
                      href={pdfUrl}
                      className="lg:w-32 lg:h-40 w-full h-48 flex-shrink-0 bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden hover:border-indigo-400 hover:shadow-lg transition-all group relative"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-50 group-hover:to-purple-50 transition-all">
                        <FileDown className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mb-2 transition-colors" />
                        <span className="text-xs font-semibold text-gray-500 group-hover:text-indigo-700 transition-colors">
                          Set {idx + 1}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-indigo-600 mt-1 transition-colors">
                          Click to view
                        </span>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 rounded-lg transition-all"></div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-sm">
                            {idx + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900">{quiz.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            isMastery ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}>
                            {quiz.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium">
                            {quiz.questionCount} Questions
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={pdfUrl}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all shadow-md hover:shadow-xl whitespace-nowrap
                          bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
                      >
                        <FileDown className="w-5 h-5" />
                        Preview & Download
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What you'll get</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Professional PDF format, ready to print</li>
                <li>• Multiple choice questions with clear formatting</li>
                <li>• Optional answer key with explanations</li>
                <li>• Perfect for classroom or home practice</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}