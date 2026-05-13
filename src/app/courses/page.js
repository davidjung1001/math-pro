'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import toast from 'react-hot-toast'

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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Courses
          </h1>
          <p className="text-zinc-500 text-base max-w-xl leading-relaxed">
            Self-guided math courses with lesson notes, practice problems, and printable worksheets.
          </p>
        </div>

        {/* Login prompt */}
        {!session && (
          <div className="mb-10 p-4 border border-zinc-800 rounded-lg">
            <p className="text-zinc-500 text-sm">
              <Link href="/auth/login" className="text-white font-semibold hover:underline">
                Log in
              </Link>{' '}
              or{' '}
              <Link href="/auth/register" className="text-white font-semibold hover:underline">
                create an account
              </Link>{' '}
              to enroll in courses.
            </p>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="py-20">
            <p className="text-zinc-600 text-sm">No courses available yet — check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}