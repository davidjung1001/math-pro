'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { BookOpen, Sparkles } from 'lucide-react'
import CourseCard from '@/components/courses/CourseCard'

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
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true })

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
        toast.success('Successfully enrolled!')
        setEnrolledCourses(prev => [...prev, courseId])
      }
    } else {
      // Paid course - redirect to Stripe checkout
      const loadingToast = toast.loading('Preparing checkout...')
      
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !currentSession?.access_token) {
          console.error('Session error:', sessionError)
          toast.dismiss(loadingToast)
          toast.error('Please log in again')
          return
        }

        console.log('Creating checkout for course:', courseId)
        
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`
          },
          body: JSON.stringify({ courseId })
        })
        
        const data = await response.json()
        
        console.log('Checkout response:', { status: response.status, data })
        
        if (!response.ok) {
          toast.dismiss(loadingToast)
          toast.error(data.error || 'Failed to create checkout')
          console.error('Checkout failed:', data)
          return
        }
        
        if (!data.url) {
          toast.dismiss(loadingToast)
          toast.error('No checkout URL returned')
          console.error('No URL in response:', data)
          return
        }
        
        toast.dismiss(loadingToast)
        toast.success('Redirecting to checkout...')
        window.location.href = data.url
      } catch (error) {
        console.error('Checkout error:', error)
        toast.dismiss(loadingToast)
        toast.error(`Error: ${error.message}`)
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
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Start Learning Today
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Courses</span>
          </h1>
          
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Master your skills with expert-led courses designed to help you succeed
          </p>
        </div>

        {/* Login prompt */}
        {!session && (
          <div className="mb-12 p-6 bg-gradient-to-r from-slate-800/80 to-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl shadow-xl">
            <p className="text-slate-300 text-center text-lg">
              <Link href="/auth/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition underline decoration-2 underline-offset-4">
                Log in
              </Link>{' '}
              or{' '}
              <Link href="/auth/signup" className="text-cyan-400 font-bold hover:text-cyan-300 transition underline decoration-2 underline-offset-4">
                sign up
              </Link>{' '}
              to enroll in courses
            </p>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolledCourses.includes(course.id)}
              onEnroll={handleEnroll}
              session={session}
            />
          ))}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No courses available yet</h3>
            <p className="text-slate-400 text-lg">Check back soon for exciting new courses</p>
          </div>
        )}
      </div>
    </div>
  )
}