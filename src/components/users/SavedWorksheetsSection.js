import Link from 'next/link'
import { Heart, FileText, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import RemoveSavedButton from '@/components/buttons/RemoveSavedButton'

export default async function SavedWorksheetsSection({ userId }) {
  const supabase = await createClient()

  // Fetch saved quizzes with full details
  const { data: savedQuizzes, error } = await supabase
    .from('user_saved_quizzes')
    .select(`
      id,
      quiz_id,
      saved_at,
      quizzes!inner (
        id,
        name,
        difficulty,
        subsections!inner (
          id,
          subsection_title,
          slug,
          sections!inner (
            section_title,
            slug,
            courses!inner (
              title,
              slug
            )
          )
        )
      )
    `)
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved worksheets:', error)
    return null
  }

  const worksheets = savedQuizzes?.map(sq => {
    const quiz = sq.quizzes
    const subsection = quiz.subsections
    const section = subsection.sections
    const course = section.courses

    // Find which set number this quiz is (1-5)
    // We'll need to query for this or pass it differently
    return {
      savedId: sq.id,
      quizId: quiz.id,
      quizName: quiz.name,
      difficulty: quiz.difficulty,
      subsectionTitle: subsection.subsection_title,
      subsectionSlug: subsection.slug,
      sectionTitle: section.section_title,
      sectionSlug: section.slug,
      courseTitle: course.title,
      courseSlug: course.slug,
      savedAt: new Date(sq.saved_at).toLocaleDateString()
    }
  }) || []

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-600 fill-current" />
        Saved Worksheets
      </h2>

      {worksheets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-gray-600 text-lg mb-6 text-center">
            You haven't saved any worksheets yet.
          </p>
          <Link
            href="/worksheets/free-worksheets"
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-lg"
          >
            Browse Worksheets →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {worksheets.map(worksheet => (
            <div
              key={worksheet.savedId}
              className="group relative p-5 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-md hover:shadow-xl transition border border-red-100 hover:border-red-300"
            >
              {/* Remove Button */}
              <div className="absolute top-3 right-3">
                <RemoveSavedButton quizId={worksheet.quizId} savedId={worksheet.savedId} />
              </div>

              <Link href={`/worksheets/free-worksheets/${worksheet.courseSlug}/${worksheet.sectionSlug}/${worksheet.subsectionSlug}/printable-pdf/1`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-1">
                      {worksheet.subsectionTitle}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {worksheet.courseTitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Quiz:</span>
                    <span className="text-xs text-gray-600">{worksheet.quizName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Section:</span>
                    <span className="text-xs text-gray-600">{worksheet.sectionTitle}</span>
                  </div>
                  {worksheet.difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                        {worksheet.difficulty}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-red-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Saved {worksheet.savedAt}</span>
                  <span className="text-xs text-red-600 font-medium group-hover:underline">
                    View →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}