import { Play, BookOpen, Clock, CheckCircle, Star, Lock } from 'lucide-react'
import Link from 'next/link'

export default function CourseCard({ course, enrolled, onEnroll, session }) {
  const isFree = course.is_free || !course.price_cents
  const price = course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : 'Free'
  const thumbnailUrl = course.thumbnail_url || `/course-thumbnails/default.jpg`
  const rating = course.average_rating || 0
  const ratingCount = course.rating_count || 0
  
  return (
    <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col">
      {/* Course Thumbnail */}
      <div className="relative h-52 bg-slate-900 overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl shadow-cyan-500/50">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {/* Free/Premium badge */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur border ${
            isFree 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
              : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          }`}>
            {isFree ? 'FREE' : 'PREMIUM'}
          </div>

          {/* Enrolled badge */}
          {enrolled && (
            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              Enrolled
            </div>
          )}
        </div>

        {/* Bottom price badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-slate-900/95 backdrop-blur px-4 py-2 rounded-xl border border-slate-700/50 shadow-xl">
            <span className={`text-xl font-bold ${isFree ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {price}
            </span>
            {!isFree && <span className="text-slate-400 text-xs ml-2">one-time</span>}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {rating.toFixed(1)} ({ratingCount})
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
          {course.title}
        </h2>
        
        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
          {course.description || 'Comprehensive course content to master the subject'}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-5 pb-5 border-b border-slate-700/50">
          {course.lesson_count && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{course.lesson_count} lessons</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="flex-1 text-center px-5 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition font-medium text-sm border border-slate-600/50 hover:border-slate-500"
          >
            View Details
          </Link>

          {enrolled ? (
            <Link
              href={`/courses/${course.slug}`}
              className="flex-1 text-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Continue
            </Link>
          ) : !session ? (
            <button
              disabled
              className="flex-1 px-5 py-3 bg-slate-700/30 text-slate-500 rounded-xl font-semibold text-sm cursor-not-allowed border border-slate-700/50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Login Required
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course.id, isFree, course.stripe_price_id)}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              {isFree ? 'Enroll Free' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}