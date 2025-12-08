// FILE: app/worksheets/free-worksheets/[slug]/page.js
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { fetchCourseBySlugServer } from '@/lib/math/supabaseData'
import { BookOpen, Download, FileText } from 'lucide-react'

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data: courses } = await supabase
    .from('courses')
    .select('slug')
  
  return courses?.map((course) => ({ slug: course.slug })) || []
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const course = await fetchCourseBySlugServer(slug)

  if (!course) {
    return { title: 'Course Not Found', description: 'The requested course could not be found.' }
  }

  const totalSections = course.sections.length
  const totalSubsections = course.sections.reduce((acc, section) => acc + section.subsections.length, 0)

  return {
    title: `Free ${course.title} Worksheets - Practice Problems & Answer Keys`,
    description: `Download free printable ${course.title} worksheets with ${totalSubsections} topics across ${totalSections} sections.`,
    keywords: [
      `${course.title} worksheets`,
      `free ${course.title} practice`,
      `${course.title} printable`,
      `${course.title} problems`,
      'free math worksheets',
      'printable worksheets',
      'practice problems',
      'answer key'
    ],
    openGraph: {
      title: `Free ${course.title} Worksheets | Practice Problems`,
      description: `${totalSubsections} free printable worksheets for ${course.title}. Includes practice problems and solutions.`,
      url: `https://www.stillymathpro.com/worksheets/free-worksheets/${slug}`,
      type: 'website',
      siteName: 'StillyMathPro'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Free ${course.title} Worksheets`,
      description: `${totalSubsections} free worksheets for ${course.title}`
    },
    alternates: {
      canonical: `https://www.stillymathpro.com/worksheets/free-worksheets/${slug}`
    }
  }
}

export default async function FreeWorksheetsPage({ params }) {
  const { slug } = await params
  const course = await fetchCourseBySlugServer(slug)

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-6 sm:p-10 bg-white rounded-xl shadow-lg border border-red-200">
          <p className="text-2xl sm:text-3xl text-red-600 font-semibold mb-4">Course not found</p>
          <Link 
            href="/worksheets/free-worksheets"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to all worksheets
          </Link>
        </div>
      </div>
    )
  }

  const totalSubsections = course.sections.reduce((acc, section) => acc + section.subsections.length, 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalResource',
            name: `${course.title} Worksheets`,
            description: `Free printable worksheets for ${course.title}`,
            educationalLevel: 'High School',
            learningResourceType: 'Worksheet',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            publisher: { '@type': 'Organization', name: 'StillyMathPro' }
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-6 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav className="mb-4 sm:mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><Link href="/worksheets/free-worksheets" className="hover:text-indigo-600">Worksheets</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">{course.title}</li>
            </ol>
          </nav>

          {/* Page Header */}
          <header className="mb-6 sm:mb-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-md">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                  Free {course.title} Worksheets and Practice
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">
                  Download and practice free printable worksheets with answer keys
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{course.sections.length} sections</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>{totalSubsections} worksheet topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>100% Free</span>
              </div>
            </div>
          </header>

          {/* Intro text */}
          <div className="mb-6 sm:mb-8 prose prose-sm sm:prose-lg max-w-none bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <p className="text-gray-700">
              Our free {course.title} worksheets are designed to help students master key concepts through practice. 
              Each worksheet includes carefully selected problems with complete answer keys. Perfect for classroom use, 
              homework assignments, or independent study.
            </p>
          </div>

          {/* Sections */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Browse Worksheets by Topic
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {course.sections.map((section, idx) => (
                <article 
                  key={section.id} 
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-5 hover:shadow-lg transition"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  
                  <ul className="space-y-2 sm:space-y-3">
                    {section.subsections.map(sub => (
                      <li key={sub.id} className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <Link
                          href={`/worksheets/free-worksheets/${slug}/${section.slug}/${sub.slug}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline flex-1"
                        >
                          <span className="block text-sm sm:text-base">{sub.title}</span>
                          <span className="text-xs text-gray-500">Free printable worksheet</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 sm:mt-12 pt-6 border-t border-gray-300">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                About These {course.title} Worksheets
              </h2>
              <p className="text-gray-700 mb-2">
                These free printable worksheets are designed for students studying {course.title}. 
                Each worksheet can be downloaded as a PDF and printed for classroom or home use.
              </p>
              <p className="text-gray-700">
                <strong>Perfect for:</strong> Teachers, students, homeschool parents, and tutors looking 
                for quality practice materials with complete solutions.
              </p>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}