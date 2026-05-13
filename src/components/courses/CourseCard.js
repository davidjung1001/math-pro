import { BookOpen, Clock, CheckCircle, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CourseCard({ course, enrolled, onEnroll, session }) {
  const isFree = course.is_free || !course.price_cents
  const price = course.price_cents ? `$${(course.price_cents / 100).toFixed(0)}` : 'Free'
  const thumbnailUrl = course.thumbnail_url || `/course-thumbnails/default.jpg`

  return (
    <div className="group border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40 hover:border-zinc-700 transition-colors flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 bg-zinc-900 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        {enrolled && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-zinc-950/80 text-white text-xs font-medium px-2.5 py-1 rounded-md">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            Enrolled
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${isFree ? 'bg-zinc-950/80 text-white' : 'bg-zinc-950/80 text-white'}`}>
            {isFree ? 'Free' : price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-sm font-semibold text-white mb-2 leading-snug line-clamp-2">
          {course.title}
        </h2>

        <p className="text-zinc-600 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
          {course.description || 'Comprehensive course content to master the subject.'}
        </p>

        {/* Meta */}
        {(course.lesson_count || course.duration) && (
          <div className="flex items-center gap-4 text-xs text-zinc-600 mb-4">
            {course.lesson_count && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {course.lesson_count} lessons
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Link
            href={`/courses/${course.slug}`}
            className="flex-1 text-center px-4 py-2.5 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded-lg transition text-xs font-medium"
          >
            View Details
          </Link>

          {enrolled ? (
            <Link
              href={`/courses/${course.slug}`}
              className="flex-1 text-center px-4 py-2.5 bg-white text-zinc-900 rounded-lg font-semibold text-xs hover:bg-zinc-100 transition inline-flex items-center justify-center gap-1.5"
            >
              Continue <ArrowRight className="w-3 h-3" />
            </Link>
          ) : !session ? (
            <Link
              href="/auth/login"
              className="flex-1 text-center px-4 py-2.5 bg-white text-zinc-900 rounded-lg font-semibold text-xs hover:bg-zinc-100 transition inline-flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3" /> Log In
            </Link>
          ) : (
            <button
              onClick={() => onEnroll(course.id, isFree, course.stripe_price_id)}
              className="flex-1 px-4 py-2.5 bg-white text-zinc-900 rounded-lg font-semibold text-xs hover:bg-zinc-100 transition"
            >
              {isFree ? 'Enroll Free' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
