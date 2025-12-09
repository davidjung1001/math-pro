'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { Lock, ArrowLeft, Play, BookOpen, CheckCircle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'
import { renderContent } from '@/lib/markdownWithMath'
import { normalizeMathDelimiters } from '@/lib/normalizeMathDelimiters'
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex'
import YouTubeEmbed from '@/components/videos/YouTubeEmbed'

export default function SubsectionPage() {
  const { slug: courseSlug, moduleSlug, subsectionSlug } = useParams()
  const router = useRouter()

  const [session, setSession] = useState(undefined)
  const [plan, setPlan] = useState('free')
  const [enrolled, setEnrolled] = useState(false)
  const [subsection, setSubsection] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [lessonContent, setLessonContent] = useState('')
  const [navigation, setNavigation] = useState({ prev: null, next: null })
  const [worksheetLessons, setWorksheetLessons] = useState([])
  const [lessonsOpen, setLessonsOpen] = useState(false)

  // --- Auth listener ---
  useEffect(() => {
    let isMounted = true
    let unsubscribe = null

    const setupAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      if (isMounted) setSession(initialSession ?? null)

      const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
        if (isMounted && event !== 'INITIAL_SESSION') setSession(sess ?? null)
      })
      unsubscribe = listener.subscription.unsubscribe
    }

    setupAuth()
    return () => {
      isMounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // --- Fetch user's plan and enrollment ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return
      
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single()
      if (profileData?.plan) setPlan(profileData.plan)
    }
    fetchUserData()
  }, [session])

  // --- Fetch subsection AND navigation ---
  useEffect(() => {
    const loadSubsection = async () => {
      if (!moduleSlug || !subsectionSlug) return
      
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('id, section_title')
        .eq('slug', moduleSlug)
        .single()

      if (sectionError || !sectionData) {
        console.error('Section not found:', sectionError)
        router.push(`/courses/${courseSlug}`)
        return
      }

      const { data: subsectionData, error: subsectionError } = await supabase
        .from('subsections')
        .select('id, subsection_title, lesson_content, section_id, video_url, video_thumbnail, slug')
        .eq('section_id', sectionData.id)
        .eq('slug', subsectionSlug)
        .single()

      if (subsectionError || !subsectionData) {
        console.error('Subsection not found:', subsectionError)
        router.push(`/courses/${courseSlug}/${moduleSlug}`)
        return
      }

      const formattedData = {
        id: subsectionData.id,
        title: subsectionData.subsection_title,
        lessonContent: subsectionData.lesson_content,
        section_id: subsectionData.section_id,
        video_url: subsectionData.video_url,
        video_thumbnail: subsectionData.video_thumbnail,
        slug: subsectionData.slug,
        sectionTitle: sectionData.section_title
      }

      setSubsection(formattedData)
      setLessonContent(formattedData.lessonContent || '')
      
      // Fetch worksheet lessons from all_lessons table
      await fetchWorksheetLessons(formattedData.title)
      
      await fetchNavigation(formattedData.section_id, formattedData.id)
      
      setLoading(false)
    }
    loadSubsection()
  }, [moduleSlug, subsectionSlug, courseSlug, router])

  // --- Fetch worksheet lessons ---
  const fetchWorksheetLessons = async (subsectionTitle) => {
    try {
      // Fetch all_lessons by matching subsection_title only
      // Since subsection_title should be unique within a course
      const { data: lessons, error } = await supabase
        .from('all_lessons')
        .select('*')
        .eq('subsection_title', subsectionTitle)
        .order('page_number', { ascending: true })

      if (error) {
        console.error('Error fetching worksheet lessons:', error)
      } else {
        console.log('Found worksheet lessons:', lessons?.length || 0)
        setWorksheetLessons(lessons || [])
      }
    } catch (error) {
      console.error('Error in fetchWorksheetLessons:', error)
    }
  }

  // --- Fetch navigation subsections ---
  const fetchNavigation = async (sectionId, currentSubsectionId) => {
    try {
      const { data: allSubsections, error } = await supabase
        .from('subsections')
        .select('id, subsection_title, slug, display_order')
        .eq('section_id', sectionId)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching subsections:', error)
        return
      }

      const currentIndex = allSubsections.findIndex(s => s.id === currentSubsectionId)
      
      if (currentIndex === -1) return

      const prev = currentIndex > 0 ? allSubsections[currentIndex - 1] : null
      const next = currentIndex < allSubsections.length - 1 ? allSubsections[currentIndex + 1] : null

      setNavigation({
        prev: prev ? { ...prev, title: prev.subsection_title } : null,
        next: next ? { ...next, title: next.subsection_title } : null
      })
    } catch (error) {
      console.error('Error fetching navigation:', error)
    }
  }

  // --- Fetch quizzes ---
  useEffect(() => {
    const loadQuizzes = async () => {
      if (!subsection?.id) return

      const { data: quizzesData, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          name,
          difficulty,
          is_premium,
          display_order,
          quiz_questions(count)
        `)
        .eq('subsection_id', subsection.id)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching quizzes:', error)
      } else {
        const formattedQuizzes = quizzesData.map(quiz => ({
          ...quiz,
          questionCount: quiz.quiz_questions?.[0]?.count || 0
        }))
        setQuizzes(formattedQuizzes)
      }
    }

    loadQuizzes()
  }, [subsection])

  const markdownRaw = useMemo(
    () => (lessonContent ? lessonContent.trim() : ''),
    [lessonContent]
  )
  const markdown = useMemo(() => normalizeMathDelimiters(markdownRaw), [markdownRaw])
  const rendered = useMemo(() => renderContent(markdown), [markdown])

  if (loading || session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!subsection) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-red-400 text-xl">Lesson not found</p>
      </div>
    )
  }

  const isLoggedOut = session === null
  const isPremium = plan === 'premium'
  const hasWorksheetLessons = worksheetLessons.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Course
        </Link>

        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {subsection.title}
          </h1>
          
          {/* Video Player (if video exists) */}
          {subsection.video_url && (
            <div className="mb-8 border border-slate-700 shadow-2xl">
              <YouTubeEmbed 
                videoId={subsection.video_url} 
                title={subsection.title} 
              />
            </div>
          )}
        </div>

        {/* Collapsible Step-by-Step Lessons (from all_lessons table) */}
        {hasWorksheetLessons && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden mb-8">
            <button
              onClick={() => setLessonsOpen(!lessonsOpen)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-700/30 transition"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white">Step-by-Step Lessons</h2>
                  <p className="text-sm text-slate-400 mt-1">{worksheetLessons.length} detailed lessons</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${lessonsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {lessonsOpen && (
              <div className="border-t border-slate-700 p-6 space-y-6">
                {worksheetLessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">
                        {lesson.page_number}
                      </span>
                      Lesson {lesson.page_number}
                    </h3>
                    
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed lesson-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {preprocessForKaTeX(lesson.lesson_text)}
                      </ReactMarkdown>
                    </div>

                    {lesson.keywords && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">Keywords:</span> {lesson.keywords}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lesson Content (original markdown content) */}
        {markdownRaw && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Additional Notes</h2>
            </div>
            
            <div className="prose prose-invert prose-cyan max-w-none">
              <div dangerouslySetInnerHTML={rendered} />
            </div>
          </div>
        )}

        {/* Practice Quizzes Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Practice Quizzes</h2>
          </div>

          {isLoggedOut && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-400">
                <Link href="/auth/login" className="font-semibold underline hover:text-blue-300">
                  Log in
                </Link>{' '}
                to access practice quizzes and track your progress.
              </p>
            </div>
          )}

          {quizzes.length === 0 ? (
            <p className="text-slate-400">No quizzes available for this lesson.</p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz, index) => {
                const isPremiumQuiz = quiz.is_premium
                const isLocked = isLoggedOut || (!isPremium && isPremiumQuiz)
                const message = isLoggedOut
                  ? 'Please log in to access this quiz.'
                  : 'This quiz is available to premium users only.'

                if (isLocked) {
                  return (
                    <div
                      key={quiz.id}
                      onClick={() => toast.error(message)}
                      className="group p-5 rounded-xl bg-slate-700/30 border border-slate-700 cursor-not-allowed opacity-75 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-slate-400">
                              Quiz {index + 1}: {quiz.name}
                            </span>
                            <Lock className="w-4 h-4 text-slate-500" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full capitalize">
                              {quiz.difficulty}
                            </span>
                            <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full">
                              {quiz.questionCount} questions
                            </span>
                            {isPremiumQuiz && (
                              <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                                Premium
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-red-400">{message}</p>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={quiz.id}
                    href={`/courses/${courseSlug}/${moduleSlug}/${subsectionSlug}/quiz/${quiz.id}/start`}
                    className="group block p-5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                            Quiz {index + 1}: {quiz.name}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full capitalize font-medium">
                            {quiz.difficulty}
                          </span>
                          <span className="text-xs px-3 py-1 bg-slate-700 text-slate-300 rounded-full">
                            {quiz.questionCount} questions
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span className="text-sm">Start</span>
                        <Play className="w-4 h-4" fill="currentColor" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation: Previous/Next Subsection */}
        <div className="flex items-center justify-between gap-4 mt-8">
          {navigation.prev ? (
            <Link
              href={`/courses/${courseSlug}/${moduleSlug}/${navigation.prev.slug}`}
              className="group flex items-center gap-3 px-6 py-4 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all flex-1"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Previous</p>
                <p className="text-white font-semibold group-hover:text-cyan-400 transition line-clamp-1">
                  {navigation.prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}

          {navigation.next ? (
            <Link
              href={`/courses/${courseSlug}/${moduleSlug}/${navigation.next.slug}`}
              className="group flex items-center gap-3 px-6 py-4 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all flex-1 justify-end text-right"
            >
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Next</p>
                <p className="text-white font-semibold group-hover:text-cyan-400 transition line-clamp-1">
                  {navigation.next.title}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </div>
    </div>
  )
}