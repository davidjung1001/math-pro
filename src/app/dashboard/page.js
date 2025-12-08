import { cookies } from 'next/headers'
import Link from 'next/link'
import { BookOpen, FileText, Crown, TrendingUp, Award, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import SavedWorksheetsSection from '@/components/users/SavedWorksheetsSection'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } = {} } = await supabase.auth.getSession()
  
  const isAuthenticated = !!session && !!session.user;

  console.log('--- DASHBOARD SERVER COMPONENT DEBUG (Next.js Console) ---');
  if (isAuthenticated) {
    console.log(`✅ AUTH: Session found. User ID: ${session.user.id.substring(0, 8)}...`);
    console.log(`Token expires: ${new Date(session.expires_at * 1000).toLocaleString()}`);
  } else {
    console.log('❌ AUTH: No session or user found in Server Component. (Redirect is disabled)');
  }
  console.log('------------------------------------------------------------');
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl text-center border-t-4 border-red-500">
          <h2 className="text-3xl font-bold text-red-600 mb-3">Authentication Debug Mode</h2>
          <p className="text-gray-700 mb-6">
            User is not authenticated, but **redirect is disabled**. 
            This content is displayed so you can inspect the server logs.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-lg"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Fetch enrollments
  const { data: rawEnrollments, error: enrollmentsError } = await supabase
    .from('user_enrollments')
    .select(`id, course_id, progress_percentage, last_accessed`)
    .eq('user_id', session.user.id)
    .order('id', { ascending: true })

  if (enrollmentsError) {
    console.error('❌ RAW ENROLLMENT FETCH ERROR:', enrollmentsError.message);
  }

  const courseIds = [...new Set(rawEnrollments?.map(e => e.course_id) || [])].filter(id => id !== null);

  let coursesData = [];
  if (courseIds.length > 0) {
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`id, title, slug, description`)
      .in('id', courseIds);

    if (coursesError) {
      console.error('❌ COURSE DETAILS FETCH ERROR:', coursesError.message);
    } else {
      coursesData = courses || [];
    }
  }

  const courseMap = new Map(coursesData.map(course => [course.id, course]));
  
  const enrolledCourses = rawEnrollments?.map(e => {
    const courseDetails = courseMap.get(e.course_id);
    if (courseDetails) {
      return {
        enrollmentId: e.id,
        ...courseDetails,
        progress_percentage: Number(e.progress_percentage || 0), 
        last_accessed: e.last_accessed
      };
    }
    return null;
  }).filter(Boolean) || [];

  console.log('--- DASHBOARD MAPPED DATA DEBUG ---');
  console.log(`✅ FINAL MAPPED COURSES: ${enrolledCourses.length} records.`);
  if (enrolledCourses.length > 0) {
     console.log('Sample Mapped Course (Check this structure!):', JSON.stringify(enrolledCourses[0], null, 2));
  }
  console.log('-----------------------------------');

  // Stats
  const completedCourses = enrolledCourses.filter(c => c.progress_percentage >= 100).length
  const inProgressCourses = enrolledCourses.filter(c => c.progress_percentage > 0 && c.progress_percentage < 100).length
  const totalEnrollments = enrolledCourses.length
  
  const lastActiveTimestamp = enrolledCourses.length > 0
    ? Math.max(...enrolledCourses.map(c => new Date(c.last_accessed)))
    : null;
    
  const lastActiveDate = lastActiveTimestamp ? new Date(lastActiveTimestamp).toLocaleDateString() : 'N/A';

  const isPremium = profile?.plan === 'premium'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 sm:py-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Welcome Back, {profile?.display_name || 'User'}!
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-indigo-100'}`}>
              {isPremium && <Crown className="w-4 h-4 text-white" />}
              <span className={`font-semibold text-sm ${isPremium ? 'text-white' : 'text-indigo-700'}`}>
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </span>
            </div>
            {!isPremium && (
              <Link
                href="/auth/subscribe"
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 transition shadow-md text-sm"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{totalEnrollments}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Enrolled</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{inProgressCourses}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">In Progress</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-600" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{completedCourses}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Completed</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-amber-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">{lastActiveDate}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Last Active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/courses"
            className="group block bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Browse Courses</h3>
                <p className="text-indigo-100">Explore all available courses</p>
              </div>
              <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/worksheets/free-worksheets"
            className="group block bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Browse Worksheets</h3>
                <p className="text-purple-100">Practice with worksheets</p>
              </div>
              <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Saved Worksheets Section */}
        <div className="mb-8">
          <SavedWorksheetsSection userId={session.user.id} />
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            My Courses
          </h2>

          {enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-gray-600 text-lg mb-6 text-center">You are not currently enrolled in any courses.</p>
              <Link
                href="/courses"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                Explore Courses →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map(course => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group block p-6 bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition border border-indigo-100 hover:border-indigo-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                      {course.title}
                    </h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-indigo-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className={`text-sm font-bold ${course.progress_percentage >= 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                        {course.progress_percentage}% {course.progress_percentage >= 100 ? '🎉' : ''}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                          course.progress_percentage >= 100 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, course.progress_percentage)}%` }}
                        role="progressbar"
                        aria-valuenow={course.progress_percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}