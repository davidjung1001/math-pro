'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { renderContent } from '@/lib/markdownWithMath'
import { normalizeMathDelimiters } from '@/lib/normalizeMathDelimiters'

export default function LessonPage() {
  const { slug: courseSlug, moduleSlug } = useParams() // get courseSlug and moduleSlug
  const router = useRouter()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true)
      try {
        const { data: section, error } = await supabase
          .from('sections')
          .select(`
            id,
            slug,
            section_title,
            lesson_content,
            subsections (id, subsection_title, slug)
          `)
          .eq('slug', moduleSlug) // fetch by moduleSlug
          .maybeSingle()

        if (error || !section) {
          console.error('Section fetch error:', error)
          router.push(`/courses/${courseSlug}`)
          return
        }

        setLesson(section)
      } catch (err) {
        console.error('Lesson load error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (moduleSlug) loadLesson()
  }, [moduleSlug, courseSlug, router])

  const markdownRaw = useMemo(
    () => (lesson?.lesson_content ? String(lesson.lesson_content).trim() : ''),
    [lesson]
  )

  const markdown = useMemo(() => normalizeMathDelimiters(markdownRaw), [markdownRaw])
  const rendered = useMemo(() => renderContent(markdown), [markdown])

  if (loading) return <p className="p-6">Loading lesson...</p>
  if (!lesson) return <p className="p-6 text-red-500">Lesson not found.</p>

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white min-h-screen">
      <Link href={`/courses/${courseSlug}`} className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 block">
        &larr; Back to Course Overview
      </Link>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{lesson.section_title}</h1>

      <div className="prose max-w-none border-t pt-4 mt-6">
        {markdownRaw ? (
          <div dangerouslySetInnerHTML={rendered} />
        ) : (
          <p className="text-gray-600">No lesson content available.</p>
        )}
      </div>

      {lesson.subsections?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-12 mb-4 border-b pb-2">Subsections</h2>
          <ul className="space-y-3">
            {lesson.subsections.map(sub => (
              <li key={sub.id}>
                <Link
                  href={`/courses/${courseSlug}/${lesson.slug}/${sub.slug}`}
                  className="block p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                >
                  {sub.subsection_title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
