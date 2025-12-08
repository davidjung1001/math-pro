// FILE: app/worksheets/free-worksheets/page.js
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Calculator, BookOpen, GraduationCap, Brain, ChevronDown, ArrowRight } from 'lucide-react';
import AIWorksheetGenerator from '@/components/AIWorksheetGenerator';
import MathPreview from '@/components/worksheet-preview/MathPreview';
import ChemistryPreview from '@/components/worksheet-preview/ChemistryPreview';

// -----------------------------
// Metadata for SEO
// -----------------------------
export const metadata = {
  title: 'Free Printable Math Worksheets (PDF) | Stilly Math Pro',
  description:
    'Download free printable math worksheets in PDF format. Browse worksheets for SAT Math, 3rd Grade Math, Pre-Algebra, Algebra 1, Geometry, and more. All worksheets include high-quality practice problems.',
  keywords: [
    'free math worksheets',
    'printable math worksheets pdf',
    'download math worksheets',
    'SAT math worksheets',
    'square root worksheets',
    'algebra worksheets',
    'square root practice',
  ],
  openGraph: {
    title: 'Free Printable Math Worksheets (PDF) | Stilly Math Pro',
    description:
      'Download free printable math worksheets in PDF format across all math subjects. SAT Math, Square Roots, Pre-Algebra, Algebra 1, Geometry, and more.',
  },
  alternates: {
    canonical: 'https://www.stillymathpro.com/worksheets/free-worksheets',
  },
};

// Array of icons to cycle through for variety
const icons = [Calculator, BookOpen, GraduationCap, Brain];

// Fetch courses with their sections and subsections
async function fetchCoursesWithSections() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug')
    .order('title', { ascending: true });

  if (courseError || !courses) {
    console.error('Error fetching courses:', courseError);
    return [];
  }

  const coursesWithSections = await Promise.all(
    courses.map(async (course) => {
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          id, 
          section_title, 
          slug,
          subsections (id, subsection_title, slug)
        `)
        .eq('course_id', course.id)
        .order('id', { ascending: true });

      if (sectionsError) {
        console.error(`Error fetching sections for course ${course.id}:`, sectionsError);
        return { ...course, sections: [] };
      }

      return { ...course, sections: sections || [] };
    })
  );

  return coursesWithSections;
}

// -----------------------------
// Server Component (for SEO)
// -----------------------------
export default async function FreeWorksheetsPage() {
  const courses = await fetchCoursesWithSections();

  if (!courses || courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <p className="text-xl text-gray-600">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 bg-clip-text text-transparent leading-tight mb-6">
            Free Math Worksheets
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Thousands of printable math worksheets with answer keys. Download, print, and practice — completely free.
          </p>
        </header>

        {/* Top Worksheet Previews */}
        <div className="mb-16 flex justify-center gap-6 flex-wrap">
          <div className="max-w-xs">
            <MathPreview courseTitle="Sample Math" href="#courses" problemSet={1} />
          </div>
          <div className="max-w-xs">
            <ChemistryPreview courseTitle="Sample Chemistry" href="#courses" />
          </div>
        </div>

        {/* Courses List */}
        <div id="courses" className="space-y-12 max-w-5xl mx-auto">
          {courses.map((course, idx) => {
            const Icon = icons[idx % icons.length];

            return (
              <div key={course.slug} className="border-b border-gray-200 pb-12 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h2>
                  </div>
                  <Link
                    href={`/worksheets/free-worksheets/${course.slug}`}
                    className="flex items-center gap-1 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium hover:underline whitespace-nowrap"
                  >
                    Go to Course
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {course.sections && course.sections.length > 0 ? (
                  <div className="space-y-3 ml-0">
                    {course.sections.map(section => (
                      <div key={section.slug}>
                        <details className="group">
                          <summary className="flex items-center gap-2 cursor-pointer text-blue-700 hover:text-blue-800 font-medium list-none">
                            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 flex-shrink-0" />
                            <span className="hover:underline">{section.section_title}</span>
                          </summary>

                          {section.subsections && section.subsections.length > 0 && (
                            <div className="mt-2 ml-6 space-y-1">
                              {section.subsections.map(subsection => (
                                <Link
                                  key={subsection.slug}
                                  href={`/worksheets/free-worksheets/${course.slug}/${section.slug}/${subsection.slug}`}
                                  className="block text-blue-600 hover:text-blue-700 hover:underline text-sm"
                                >
                                  {subsection.subsection_title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm ml-9">No sections available</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom AI Worksheet Generator */}
        <div className="mt-8 flex justify-center px-4 sm:px-0">
          <div className="w-full max-w-md sm:max-w-lg">
            <AIWorksheetGenerator href="/ai-tools" />
          </div>
        </div>
      </div>
    </main>
  );
}
