import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { BookOpen, Lock, ChevronRight } from 'lucide-react';

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const GRADE_ORDER = [
  'K - Kindergarten',
  '1 - 1st Grade',
  '2 - 2nd Grade',
  '3 - 3rd Grade',
  '4 - 4th Grade',
  '5 - 5th Grade',
  '6 - 6th Grade',
  '7 - 7th Grade',
  '8 - Pre-Algebra',
  '9 - Algebra 1',
  '10 - Geometry',
  '10 - Algebra 2',
  '11 - Algebra 2',
  '11 - Pre-Calculus',
  '12 - Pre-Calculus',
  '12 - AP Calculus AB',
  '12 - AP Calculus BC',
  '12 - AP Statistics',
  'College - Calculus',
  'College - Statistics',
  'College - Linear Algebra',
];

export const metadata = {
  title: 'Math Curriculum by Grade | Stillwater Math',
  description: 'Browse our full math curriculum organized by grade level. Free and premium worksheets for K–12 and college math.',
};

async function getGradeSummaries() {
  // Get all unique grade_levels used on questions, plus subsection count per grade
  const { data, error } = await supabaseServer
    .from('questions')
    .select('grade_levels, subsection_id')
    .not('grade_levels', 'is', null);

  if (error || !data) return [];

  // Count unique subsections per grade
  const gradeMap = {};
  data.forEach(row => {
    if (!row.grade_levels?.length) return;
    row.grade_levels.forEach(grade => {
      if (!gradeMap[grade]) gradeMap[grade] = new Set();
      if (row.subsection_id) gradeMap[grade].add(row.subsection_id);
    });
  });

  return Object.entries(gradeMap).map(([grade, subsectionSet]) => ({
    grade,
    worksheetCount: subsectionSet.size,
  }));
}

const GRADE_COLORS = [
  'from-pink-400 to-rose-500',
  'from-orange-400 to-amber-500',
  'from-yellow-400 to-lime-500',
  'from-green-400 to-emerald-500',
  'from-teal-400 to-cyan-500',
  'from-blue-400 to-indigo-500',
  'from-indigo-400 to-violet-500',
  'from-purple-400 to-fuchsia-500',
];

export default async function CurriculumPage() {
  const summaries = await getGradeSummaries();

  // Sort by GRADE_ORDER
  const sorted = [...GRADE_ORDER]
    .map(grade => summaries.find(s => s.grade === grade) ?? { grade, worksheetCount: 0 })
    .filter(s => s.worksheetCount > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-indigo-200 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            Full Math Curriculum
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Browse by Grade Level
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Structured math practice from Kindergarten through College. Pick your grade to start practicing.
          </p>
        </div>

        {/* Grade Cards */}
        {sorted.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No curriculum content yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((item, idx) => {
              const colorClass = GRADE_COLORS[idx % GRADE_COLORS.length];
              const gradeSlug = encodeURIComponent(item.grade);
              return (
                <Link
                  key={item.grade}
                  href={`/curriculum/${gradeSlug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className={`bg-gradient-to-r ${colorClass} p-6 text-white`}>
                    <div className="text-3xl font-extrabold">{item.grade.split(' - ')[0]}</div>
                    <div className="text-sm font-medium opacity-90 mt-1">{item.grade.split(' - ').slice(1).join(' - ')}</div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{item.worksheetCount}</div>
                      <div className="text-sm text-gray-500">worksheet{item.worksheetCount !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Browse <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center">
          <Lock className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-extrabold mb-3">Unlock Everything</h2>
          <p className="text-indigo-100 text-lg mb-6 max-w-xl mx-auto">
            Get unlimited access to all worksheets and answer keys with a premium membership.
          </p>
          <Link
            href="/auth/subscribe"
            className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg text-lg"
          >
            Get Premium Access
          </Link>
        </div>
      </div>
    </div>
  );
}
