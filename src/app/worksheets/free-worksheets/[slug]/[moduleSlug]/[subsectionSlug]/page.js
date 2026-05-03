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

      <div className="bg-white min-h-screen py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8 flex items-center gap-1.5 flex-wrap">
            <Link href="/worksheets/free-worksheets" className="hover:text-black transition-colors">
              Free Worksheets
            </Link>
            <span>/</span>
            <Link href={`/worksheets/free-worksheets/${slug}`} className="hover:text-black transition-colors">
              {courseTitle}
            </Link>
            <span>/</span>
            <span className="text-black font-medium">{subsectionTitle}</span>
          </nav>

          {/* Header */}
          <header className="mb-10 border-b border-gray-100 pb-10">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 border border-black text-black">
                <CheckCircle className="w-3.5 h-3.5" />
                Free
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 bg-black text-white">
                <Download className="w-3.5 h-3.5" />
                PDF Available
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 leading-[1.05] tracking-tight">
              {subsectionTitle}
            </h1>

            <p className="text-base text-gray-500 mb-7">
              {courseTitle} — step-by-step lessons
            </p>

            <Link
              href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/1`}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-black text-white font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              Get Worksheet PDF
            </Link>
          </header>

          {/* Lessons */}
          <section className="space-y-0 mb-12 border border-gray-200">
            {lessons?.map((lesson, index) => {
              const nextLessonInSubsection = lessons[index + 1] || null;

              return (
                <div
                  key={lesson.id}
                  className="p-6 sm:p-10 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-black tracking-widest uppercase bg-black text-white px-2.5 py-1">
                      Lesson {lesson.page_number}
                    </span>
                  </div>

                  <div className="lesson-content prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                      {preprocessForKaTeX(lesson.lesson_text)}
                    </ReactMarkdown>
                  </div>

                  {lesson.keywords && (
                    <p className="mt-8 text-xs text-gray-400 border-t border-gray-100 pt-4">
                      Keywords: <span className="font-medium text-gray-500">{lesson.keywords}</span>
                    </p>
                  )}

                  {nextLessonInSubsection && (
                    <div className="mt-6 text-right">
                      <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                        Next: Lesson {nextLessonInSubsection.page_number} ↓
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {lessonsError && (
              <p className="text-red-600 p-6">Error loading lessons: {lessonsError.message}</p>
            )}
          </section>

          {/* Practice Options */}
          <section className="border border-black p-6 sm:p-10 mb-8">
            <h3 className="text-2xl font-black text-black mb-1 tracking-tight">
              Ready to Practice?
            </h3>
            <p className="text-sm text-gray-500 mb-8">Choose how you want to work through this material.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* PDF Download */}
              <Link
                href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${subsectionSlug}/printable-pdf/1`}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-black text-white font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors"
              >
                <Download className="w-4 h-4" />
                Practice Worksheet PDF
              </Link>

              {/* Digital Practice */}
              <Link
                href={`/courses/${slug}/${moduleSlug}/${subsectionSlug}`}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 border-2 border-black text-black font-bold text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Digital Quiz Version
              </Link>
            </div>
          </section>

          {/* Navigation */}
          <nav className="border border-gray-200 mb-8">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              {/* Previous */}
              <div className="p-4 sm:p-6">
                {prevSubsection ? (
                  <Link
                    href={`/worksheets/free-worksheets/${slug}/${prevSubsection.sections.slug}/${prevSubsection.slug}`}
                    className="flex items-start gap-2 group"
                  >
                    <ArrowLeft className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-black transition-colors shrink-0" />
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Prev</div>
                      <div className="text-sm font-bold text-black leading-snug group-hover:underline">
                        {prevSubsection.subsection_title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300 font-medium">First lesson</span>
                )}
              </div>

              {/* Browse All */}
              <div className="p-4 sm:p-6 flex items-center justify-center">
                <Link
                  href={`/worksheets/free-worksheets/${slug}`}
                  className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black transition-colors text-center"
                >
                  All<br />Chapters
                </Link>
              </div>

              {/* Next */}
              <div className="p-4 sm:p-6 flex justify-end">
                {nextSubsection ? (
                  <Link
                    href={`/worksheets/free-worksheets/${slug}/${nextSubsection.sections.slug}/${nextSubsection.slug}`}
                    className="flex items-start gap-2 group text-right"
                  >
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Next</div>
                      <div className="text-sm font-bold text-black leading-snug group-hover:underline">
                        {nextSubsection.subsection_title}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-black transition-colors shrink-0" />
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300 font-medium">Last lesson</span>
                )}
              </div>
            </div>
          </nav>

          {/* Related Worksheets */}
          <section className="pt-4 pb-12">
            <h2 className="text-lg font-black text-black mb-1 tracking-tight">
              More {courseTitle} Worksheets
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Browse every topic in the full collection.
            </p>
            <Link
              href={`/worksheets/free-worksheets/${slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-black hover:underline"
            >
              View All {courseTitle} Worksheets <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

        </div>
      </div>
    </>
  );
}