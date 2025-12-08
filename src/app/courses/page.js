'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Play, BookOpen, Clock, CheckCircle } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      return () => listener.subscription.unsubscribe()
    }
    getSession()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('title', { ascending: true })

      if (error) console.error('Error fetching courses:', error)
      else setCourses(data)
      setLoading(false)
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    if (!session) return

    const fetchEnrollments = async () => {
      const { data, error } = await supabase
        .from('user_enrollments')
        .select('course_id')
        .eq('user_id', session.user.id)

      if (error) console.error('Error fetching enrollments:', error)
      else setEnrolledCourses(data.map(d => d.course_id))
    }

    fetchEnrollments()
  }, [session])

  const handleEnroll = async (courseId, isFree, priceId) => {
    if (!session) {
      toast.error('Please log in to enroll!')
      return
    }

    if (isFree) {
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ 
          user_id: session.user.id, 
          course_id: courseId,
          enrollment_type: 'free'
        })

      if (error) {
        console.error(error)
        toast.error('Enrollment failed.')
      } else {
        toast.success('Enrolled successfully!')
        setEnrolledCourses(prev => [...prev, courseId])
      }
    } else {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !currentSession?.access_token) {
          console.error('Session error:', sessionError)
          toast.error('Please log in again')
          return
        }
        
        toast.loading('Redirecting to checkout...')
        
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`
          },
          body: JSON.stringify({ courseId })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout')
        }
        
        window.location.href = data.url
      } catch (error) {
        console.error('Checkout error:', error)
        toast.dismiss()
        toast.error('Failed to start checkout. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Our Courses
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl">
            Master your skills with expert-led courses designed for success
          </p>
        </div>

        {/* Login prompt */}
        {!session && (
          <div className="mb-10 p-6 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl">
            <p className="text-slate-300 text-center">
              <Link href="/auth/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition underline decoration-2 underline-offset-4">
                Log in
              </Link>{' '}
              or{' '}
              <Link href="/auth/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 transition underline decoration-2 underline-offset-4">
                sign up
              </Link>{' '}
              to enroll in courses
            </p>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => {
            const enrolled = enrolledCourses.includes(course.id)
            const isFree = course.is_free
            const price = course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : 'Free'
            const thumbnailUrl = course.thumbnail_url || `/course-thumbnails/default.jpg`

            return (
              <div
                key={course.id}
                className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  
                  {/* Play button overlay for video courses */}
                  {course.has_videos && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Enrolled badge */}
                  {enrolled && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Enrolled
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
                      <span className={`text-lg font-bold ${isFree ? 'text-emerald-400' : 'text-cyan-400'}`}>
                        {price}
                      </span>
                      {!isFree && <span className="text-slate-400 text-xs ml-2">one-time</span>}
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {course.title}
                  </h2>
                  
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {course.description || 'Comprehensive course content to master the subject'}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-700">
                    {course.lesson_count && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lesson_count} lessons</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.has_videos && (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        <span>Video</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex-1 text-center px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition font-medium text-sm"
                    >
                      Preview
                    </Link>

                    <button
                      onClick={() => handleEnroll(course.id, isFree, course.stripe_price_id)}
                      disabled={!session || enrolled}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        enrolled
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                          : !session
                          ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                          : isFree
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                      }`}
                    >
                      {enrolled ? 'View Course' : isFree ? 'Enroll Free' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No courses available yet</h3>
            <p className="text-slate-400">Check back soon for new courses</p>
          </div>
        )}
      </div>
    </div>
  )
}