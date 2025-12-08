'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { fetchCourseBySlug } from '@/lib/math/supabaseData'
import { BookOpen, ChevronDown, Clock, ArrowLeft, Play, CheckCircle, Lock, Video } from 'lucide-react'
import toast from 'react-hot-toast'

// 💡 Helper function to sort sections and subsections
const sortCourseItems = (a, b) => {
    const orderA = a.display_order ?? Infinity
    const orderB = b.display_order ?? Infinity

    if (orderA !== orderB) return orderA - orderB
    return a.id - b.id
}

const CourseSection = ({ section, sectionIndex, baseUrl, isEnrolled, completedSubsections = [] }) => {
    const [open, setOpen] = useState(sectionIndex === 0)
    const hasSectionVideo = section.video_url
    const isLocked = !isEnrolled && sectionIndex >= 2

    return (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
            {/* Section Header */}
            <button
                className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-700/30 transition"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 border-2 border-cyan-500 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-lg">
                        {sectionIndex + 1}
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">
                                {section.title}
                                {sectionIndex < 2 && !isEnrolled && (
                                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400">
                                        Free
                                    </span>
                                )}
                            </h3>
                            {hasSectionVideo && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 rounded-full">
                                    <Video className="w-3 h-3 text-cyan-400" />
                                    <span className="text-xs text-cyan-400 font-medium">Intro Video</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                            {section.subsections?.length || 0} lessons
                            {section.duration && ` • ${section.duration}`}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-6 h-6 text-cyan-400 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Subsections */}
            {open && section.subsections?.length > 0 && (
                <div className="border-t border-slate-700">
                    {section.subsections
                        .sort(sortCourseItems) // ✅ ensure ordered by display_order
                        .map((sub, idx) => {
                            const isCompleted = completedSubsections.includes(sub.id)

                            return (
                                <Link
                                    key={sub.id}
                                    href={isLocked ? '#' : `${baseUrl}/${section.slug}/${sub.slug}`}
                                    onClick={(e) => {
                                        if (isLocked) {
                                            e.preventDefault()
                                            toast.error('Please enroll to access this module')
                                        }
                                    }}
                                    className={`flex items-center justify-between p-4 transition border-b border-slate-700/50 last:border-b-0 group ${isLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-700/30'}`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Lesson number or status */}
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition ${isLocked
                                            ? 'bg-slate-700 text-slate-500'
                                            : isCompleted
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-700 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
                                        }`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{idx + 1}</span>}
                                        </div>

                                        {/* Always show Play icon */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLocked ? 'bg-slate-700' : 'bg-cyan-500/10'}`}>
                                            <Play className={`w-4 h-4 ${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} fill="currentColor" />
                                        </div>

                                        {/* Lesson title */}
                                        <div className="flex-1">
                                            <h4 className={`font-medium transition ${isLocked ? 'text-slate-500' : 'text-slate-200 group-hover:text-cyan-400'}`}>
                                                {sub.title}
                                            </h4>
                                            {sub.duration && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{sub.duration}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Lock icon */}
                                    {isLocked && <Lock className="w-4 h-4 text-slate-500" />}
                                </Link>
                            )
                        })}
                </div>
            )}
        </div>
    )
}

export default function CoursePage({ params }) {
    const { slug } = React.use(params)
    const [course, setCourse] = useState(null)
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [enrolled, setEnrolled] = useState(false)
    const [session, setSession] = useState(null)
    const router = useRouter()
    const baseUrl = `/courses/${slug}`

    useEffect(() => {
        const loadCourse = async () => {
            setLoading(true)

            // Get session
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)

            // Fetch course
            const matchedCourse = await fetchCourseBySlug(slug)
            if (matchedCourse) {

                // ✅ Sort sections and subsections
                const sortedSections = (matchedCourse.sections || [])
                    .sort(sortCourseItems)
                    .map(section => ({
                        ...section,
                        subsections: (section.subsections || []).sort(sortCourseItems)
                    }))

                setCourse(matchedCourse)
                setSections(sortedSections)

                // Check if user is enrolled
                if (session?.user?.id) {
                    const { data: enrollment } = await supabase
                        .from('user_enrollments')
                        .select('id')
                        .eq('user_id', session.user.id)
                        .eq('course_id', matchedCourse.id)
                        .single()

                    setEnrolled(!!enrollment)
                }
            } else {
                router.push('/courses')
            }
            setLoading(false)
        }
        if (slug) loadCourse()
    }, [slug, router])

    const handleEnroll = async () => {
        if (!session) {
            toast.error('Please log in to enroll')
            router.push('/auth/login')
            return
        }

        if (course.is_free || !course.price_cents) {
            // Free enrollment
            const { error } = await supabase
                .from('user_enrollments')
                .insert({
                    user_id: session.user.id,
                    course_id: course.id,
                    enrollment_type: 'free'
                })

            if (error) toast.error('Enrollment failed')
            else {
                toast.success('Enrolled successfully!')
                setEnrolled(true)
            }
        } else {
            // Redirect to Stripe checkout
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                const response = await fetch('/api/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentSession.access_token}`
                    },
                    body: JSON.stringify({ courseId: course.id })
                })
                const data = await response.json()
                if (response.ok) window.location.href = data.url
                else toast.error('Failed to start checkout')
            } catch (error) {
                toast.error('Failed to start checkout')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-lg">Loading course...</p>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <p className="text-xl text-red-400 font-semibold">Course not found</p>
                    <Link href="/courses" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        )
    }

    const totalLessons = sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0)
    const price = course.price_cents ? `${(course.price_cents / 100).toFixed(2)}` : 'Free'
    const isFree = course.is_free || !course.price_cents

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <div className="relative bg-slate-900/50 border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                    <Link
                        href="/courses"
                        className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <BookOpen className="w-5 h-5 text-cyan-400" />
                                    <span className="font-semibold">{totalLessons} Lessons</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Clock className="w-5 h-5 text-cyan-400" />
                                    <span className="font-semibold">{course.duration || 'Self-paced'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Video className="w-5 h-5 text-cyan-400" />
                                    <span className="font-semibold">Video Lessons</span>
                                </div>
                            </div>

                            {enrolled ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl">
                                    <CheckCircle className="w-5 h-5" />
                                    You're Enrolled
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <button
                                        onClick={handleEnroll}
                                        className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-xl shadow-cyan-500/20"
                                    >
                                        {course?.is_free
                                            ? 'Enroll Free'
                                            : course?.price_cents
                                                ? `Buy Now - $${(course.price_cents / 100).toFixed(2)}`
                                                : 'Enroll'}
                                    </button>

                                    {course?.price_cents && !course?.is_free && (
                                        <div className="text-slate-400 text-sm mt-2 sm:mt-0">
                                            One-time payment • Lifetime access
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                                <img
                                    src={course.thumbnail_url || '/course-thumbnails/default.jpg'}
                                    alt={course.title}
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-cyan-400" />
                        Course Curriculum
                    </h2>
                    <p className="text-slate-400">
                        {sections.length} sections • {totalLessons} total lessons
                    </p>
                </div>

                {!enrolled && (
                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                        <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                            <p className="text-amber-400 font-semibold">Content Locked</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Enroll in this course to access all lessons and videos
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {sections.length === 0 ? (
                        <div className="p-8 text-center bg-slate-800/50 rounded-xl border border-slate-700">
                            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No sections have been added to this course yet.</p>
                        </div>
                    ) : (
                        sections.map((section, index) => (
                            <CourseSection
                                key={section.id}
                                section={section}
                                sectionIndex={index}
                                baseUrl={baseUrl}
                                isEnrolled={enrolled}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
