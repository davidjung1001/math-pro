import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowLeft, Lock, Crown } from 'lucide-react';

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function generateMetadata({ params }) {
  const grade = decodeURIComponent((await params).grade);
  return {
    title: `${grade} Worksheets | Stillwater Math Curriculum`,
    description: `Browse all math worksheets for ${grade}. Practice problems with answer keys.`,
  };
}

async function getWorksheetsForGrade(grade) {
  // Find all subsection_ids that have questions tagged with this grade
  const { data: questionRows, error } = await supabaseServer
    .from('questions')
    .select('subsection_id')
    .contains('grade_levels', [grade])
    .not('subsection_id', 'is', null);

  if (error || !questionRows?.length) return [];

  const uniqueSubsectionIds = [...new Set(questionRows.map(r => r.subsection_id))];

  // Fetch subsection details with course + section slugs
  const { data: subsections } = await supabaseServer
    .from('subsections')
    .select(`
      id, subsection_title, slug,
      sections!inner(id, section_title, slug,
        courses!inner(id, title, slug)
      )
    `)
    .in('id', uniqueSubsectionIds);

  return subsections || [];
}

export default async function GradeCurriculumPage({ params }) {
  const grade = decodeURIComponent((await params).grade);
  const worksheets = await getWorksheetsForGrade(grade);

  // Group by course
  const byCourse = {};
  worksheets.forEach(sub => {
    const course = sub.sections?.courses;
    if (!course) return;
    if (!byCourse[course.id]) {
      byCourse[course.id] = { course, sections: {} };
    }
    const section = sub.sections;
    if (!byCourse[course.id].sections[section.id]) {
      byCourse[course.id].sections[section.id] = { section, subsections: [] };
    }
    byCourse[course.id].sections[section.id].subsections.push(sub);
  });

  const courseGroups = Object.values(byCourse);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Grade Levels
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{grade}</h1>
          <p className="text-gray-600 text-lg">
            {worksheets.length} worksheet{worksheets.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {worksheets.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No worksheets tagged for this grade level yet.</p>
            <Link href="/curriculum" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
              Browse other grades
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {courseGroups.map(({ course, sections }) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Course header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">{course.title}</h2>
                  <p className="text-indigo-200 text-sm mt-1">
                    {Object.values(sections).reduce((acc, s) => acc + s.subsections.length, 0)} worksheets
                  </p>
                </div>

                {/* Sections */}
                <div className="divide-y divide-gray-100">
                  {Object.values(sections).map(({ section, subsections: subs }) => (
                    <div key={section.id} className="px-6 py-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        {section.section_title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {subs.map(sub => (
                          <Link
                            key={sub.id}
                            href={`/worksheets/free-worksheets/${course.slug}/${section.slug}/${sub.slug}`}
                            className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />
                              <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">
                                {sub.subsection_title}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium CTA */}
        <div className="mt-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 text-white text-center">
          <Crown className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-extrabold mb-2">Want Answer Keys & More?</h2>
          <p className="text-orange-100 mb-6 max-w-lg mx-auto">
            Premium members get unlimited worksheet downloads with full answer keys, hints, and step-by-step solutions.
          </p>
          <Link
            href="/auth/subscribe"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition shadow-lg"
          >
            Unlock Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
