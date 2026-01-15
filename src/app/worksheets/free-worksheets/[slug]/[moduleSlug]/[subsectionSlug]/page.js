import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { CheckCircle, Download, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex';
import Link from 'next/link';


// Helper function to clean math notation for SEO
function cleanMathForSEO(text) {
  if (!text) return '';
  
  return text
    // Remove LaTeX delimiters
    .replace(/\$\$[\s\S]*?\$\$/g, '') // Display math
    .replace(/\$[^\$]+?\$/g, '') // Inline math
    .replace(/\\[\[\]]/g, '') // \[ \] delimiters
    .replace(/\\[\(\)]/g, '') // \( \) delimiters
    
    // Remove LaTeX commands
    .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '') // \command{content}
    .replace(/\\[a-zA-Z]+/g, '') // \command
    
    // Remove markdown formatting
    .replace(/[#*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
    
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug, moduleSlug, subsectionSlug } = await params;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: subsection } = await supabase
    .from('subsections')
    .select(
      `id, subsection_title,
       sections!inner(section_title, courses!inner(slug, title))`
    )
    .eq('slug', subsectionSlug)
    .eq('sections.slug', moduleSlug)
    .eq('sections.courses.slug', slug)
    .single();

  if (!subsection) {
    return {
      title: 'Worksheet Not Found',
    };
  }

  const courseTitle = subsection.sections.courses.title;
  const subsectionTitle = subsection.subsection_title;

  // Fetch lessons to create description
  const { data: lessons } = await supabase
    .from('all_lessons')
    .select('lesson_text')
    .eq('subsection_title', subsectionTitle)
    .eq('course', courseTitle)
    .order('page_number', { ascending: true })
    .limit(3); // Get first 3 lessons for description

  // Create SEO-friendly description from lesson content
  let description = `Free ${subsectionTitle} worksheet for ${courseTitle}. `;
  
  if (lessons && lessons.length > 0) {
    const cleanedContent = lessons
      .map(l => cleanMathForSEO(l.lesson_text))
      .join(' ')
      .substring(0, 300); // Limit to ~300 chars
    
    description += cleanedContent;
  } else {
    description += `Step-by-step lessons with practice problems and detailed explanations.`;
  }

  // Ensure description ends properly
  if (description.length > 155) {
    description = description.substring(0, 152) + '...';
  }

  const title = `${subsectionTitle} Worksheet - ${courseTitle} | Free Math Practice`;

  return {
    title,
    description,
    keywords: `${subsectionTitle}, ${courseTitle}, worksheet, practice problems, math help, free worksheet, step-by-step solutions`,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://www.stillymathpro.com/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.stillymathpro.com/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}`,
    },
  };
}

export default async function WorksheetPage({ params }) {
  const { slug, moduleSlug, subsectionSlug } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: subsection, error: subsectionError } = await supabase
    .from('subsections')
    .select(
      `id, subsection_title,
       sections!inner(id, slug, section_title, courses!inner(slug, title))`
    )
    .eq('slug', subsectionSlug)
    .eq('sections.slug', moduleSlug)
    .eq('sections.courses.slug', slug)
    .single();

  if (!subsection || subsectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <p className="text-xl sm:text-2xl text-red-600 font-semibold">Worksheet not found</p>
          <p className="text-gray-600 mt-2">
            Could not find: {slug} / {moduleSlug} / {subsectionSlug}
          </p>
        </div>
      </div>
    );
  }

  const courseTitle = subsection.sections.courses.title;
  const sectionTitle = subsection.sections.section_title;
  const subsectionTitle = subsection.subsection_title;

  const { data: lessons, error: lessonsError } = await supabase
    .from('all_lessons')
    .select('*')
    .eq('subsection_title', subsectionTitle)
    .eq('course', courseTitle)
    .order('page_number', { ascending: true });

  const { data: allCourseLessons } = await supabase
    .from('all_lessons')
    .select('subsection_title, subsection_id')
    .eq('course', courseTitle)
    .order('id', { ascending: true });

  const uniqueSubsections = [];
  const seenSubsections = new Set();

  allCourseLessons?.forEach((lesson) => {
    if (!seenSubsections.has(lesson.subsection_title)) {
      seenSubsections.add(lesson.subsection_title);
      uniqueSubsections.push({
        subsection_title: lesson.subsection_title,
        subsection_id: lesson.subsection_id,
      });
    }
  });

  const currentIndex = uniqueSubsections.findIndex(
    (s) => s.subsection_title === subsectionTitle
  );

  const prevSubsectionInfo =
    currentIndex > 0 ? uniqueSubsections[currentIndex - 1] : null;
  const nextSubsectionInfo =
    currentIndex < uniqueSubsections.length - 1
      ? uniqueSubsections[currentIndex + 1]
      : null;

  let prevSubsection = null;
  let nextSubsection = null;

  if (prevSubsectionInfo) {
    const { data: prevData } = await supabase
      .from('subsections')
      .select(`slug, subsection_title, sections!inner(slug, section_title)`)
      .eq('subsection_title', prevSubsectionInfo.subsection_title)
      .single();
    prevSubsection = prevData;
  }

  if (nextSubsectionInfo) {
    const { data: nextData } = await supabase
      .from('subsections')
      .select(`slug, subsection_title, sections!inner(slug, section_title)`)
      .eq('subsection_title', nextSubsectionInfo.subsection_title)
      .single();
    nextSubsection = nextData;
  }

  return (
    <>
      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalResource',
            name: `${subsectionTitle} Lesson`,
            description: `Free ${subsectionTitle} lesson for ${courseTitle} with step-by-step explanations`,
            educationalLevel: 'High School',
            learningResourceType: 'Lesson',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            publisher: { '@type': 'Organization', name: 'StillyMathPro' },
          }),
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 sm:mb-12">
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/worksheets/free-worksheets" className="hover:text-blue-600">
                Free Worksheets
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/worksheets/free-worksheets/${slug}`}
                className="hover:text-blue-600"
              >
                {courseTitle}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{subsectionTitle}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {subsectionTitle}
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Step-by-step lessons for {courseTitle}
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                <CheckCircle className="w-4 h-4" />
                100% Free
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                <Download className="w-4 h-4" />
                Instant Access
              </span>
            </div>
          </header>

          {/* Ready to Practice button */}
          <div className="mb-8">
            <Link
              href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/1`}
              className="block w-full sm:inline-flex sm:w-auto items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors text-center"
            >
              Worksheet PDF 
              <Download className="w-5 h-5 ml-2 inline" />
            </Link>
          </div>

          {/* Lessons */}
          <section className="space-y-6 mb-12">
            {lessons?.map((lesson, index) => {
              const nextLessonInSubsection = lessons[index + 1] || null;

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Lesson {lesson.page_number}
                  </h2>

                  <div className="lesson-content prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                      {preprocessForKaTeX(lesson.lesson_text)}
                    </ReactMarkdown>
                  </div>

                  {lesson.keywords && (
                    <p className="mt-6 text-sm text-gray-500 border-t pt-4">
                      Keywords: <span className="font-medium text-gray-700">{lesson.keywords}</span>
                    </p>
                  )}

                  {nextLessonInSubsection && (
                    <div className="mt-6 text-right">
                      <span className="text-blue-600 font-semibold text-sm">
                        Next: Lesson {nextLessonInSubsection.page_number}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {lessonsError && (
              <p className="text-red-600">Error loading lessons: {lessonsError.message}</p>
            )}
          </section>

          {/* Practice Options */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Let's Practice
            </h3>
            
            {/* PDF Download */}
            <Link
              href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/1`}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors mb-6"
            >
              <Download className="w-5 h-5 inline mr-2" />
              Practice Worksheet PDF
            </Link>

            {/* Divider with OR */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            {/* Digital Practice */}
            <Link
              href={`/courses/${slug}/${moduleSlug}/${subsectionSlug}`}
              className="flex items-center justify-center gap-3 w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Digital Version
            </Link>
            <p className="text-center text-sm text-gray-500 mt-3">
              Online Modular Quiz Version
            </p>
          </section>

          {/* Navigation */}
          <nav className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Previous */}
              <div className="flex-1">
                {prevSubsection ? (
                  <Link
                    href={`/worksheets/free-worksheets/${slug}/${prevSubsection.sections.slug}/${prevSubsection.slug}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <div>
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="font-semibold">{prevSubsection.subsection_title}</div>
                      <div className="text-xs text-gray-500">{prevSubsection.sections.section_title}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="text-gray-400 text-sm">← No previous lesson</div>
                )}
              </div>

              {/* Browse All Chapters */}
              <div className="flex items-center justify-center">
                <Link
                  href={`/worksheets/free-worksheets/${slug}`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  All Chapters
                </Link>
              </div>

              {/* Next */}
              <div className="flex-1 flex justify-end">
                {nextSubsection ? (
                  <Link
                    href={`/worksheets/free-worksheets/${slug}/${nextSubsection.sections.slug}/${nextSubsection.slug}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm text-right"
                  >
                    <div>
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="font-semibold">{nextSubsection.subsection_title}</div>
                      <div className="text-xs text-gray-500">{nextSubsection.sections.section_title}</div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="text-gray-400 text-sm">No next lesson →</div>
                )}
              </div>
            </div>
          </nav>

          {/* Related Worksheets */}
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              More {courseTitle} Worksheets
            </h2>
            <p className="text-gray-600 mb-4">
              Browse our complete collection of {courseTitle} worksheets covering all topics.
            </p>
            <Link
              href={`/worksheets/free-worksheets/${slug}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All {courseTitle} Worksheets →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}