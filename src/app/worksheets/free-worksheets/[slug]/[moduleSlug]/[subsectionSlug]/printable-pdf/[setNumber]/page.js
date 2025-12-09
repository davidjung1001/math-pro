import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import RightSidebar from '@/components/RightSidebar';
import SaveLessonButton from '@/components/buttons/SaveLessonButton';
import SubsectionNavigation from '@/components/buttons/SubsectionNavigation';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex';
import TopTutorToast from '@/components/tutoring/TopTutorToast';
import Link from "next/link";

// --- Reusable KaTeX/Markdown Renderer Component ---
const MarkdownKaTeX = ({ content, className }) => (
  <div className={className}>
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
    >
      {preprocessForKaTeX(content)}
    </ReactMarkdown>
  </div>
);

// --- Supabase Client ---
const getSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// --- Helper: Paginate Questions ---
function paginateQuestions(questions) {
  const PAGE_HEIGHT = 1400;
  const HEADER_HEIGHT = 200;
  const QUESTION_BASE_HEIGHT = 60;
  const OPTION_HEIGHT = 25;

  let currentPage = [];
  let currentHeight = HEADER_HEIGHT;
  const allPages = [];

  questions.forEach((q) => {
    let questionHeight = QUESTION_BASE_HEIGHT;
    
    const optionCount = ['a', 'b', 'c', 'd'].filter(
      opt => q[`option_${opt}`]
    ).length;
    questionHeight += optionCount * OPTION_HEIGHT;

    if (currentHeight + questionHeight > PAGE_HEIGHT && currentPage.length > 0) {
      allPages.push([...currentPage]);
      currentPage = [q];
      currentHeight = questionHeight;
    } else {
      currentPage.push(q);
      currentHeight += questionHeight;
    }
  });

  if (currentPage.length > 0) {
    allPages.push(currentPage);
  }

  return allPages;
}

// --- Metadata ---
// --- Metadata ---
// --- Helper: Clean Math Text for SEO ---
// Define this utility function *outside* of generateMetadata for clarity
function cleanMathText(text) {
  // 1. Remove common delimiters ($$, \$, \), etc.)
  let cleaned = text.replace(/(\$\$|\$|\\\[|\\\]|\\\(|\\\))/g, '');

  // 2. Replace common LaTeX commands with readable text/symbols
  cleaned = cleaned.replace(/\\frac{(\w+)}{(\w+)}/g, '$1/$2'); // \frac{a}{b} -> a/b
  cleaned = cleaned.replace(/\\sqrt{(\w+)}/g, 'square root of $1'); // \sqrt{x} -> square root of x
  cleaned = cleaned.replace(/\\cdot/g, '*'); // \cdot -> * (multiplication)
  cleaned = cleaned.replace(/\\pi/g, 'pi'); // \pi -> pi
  cleaned = cleaned.replace(/\\alpha/g, 'alpha'); // Greek letters

  // 3. Remove other non-essential LaTeX commands
  cleaned = cleaned.replace(/\\text\{(.+?)\}/g, '$1');
  cleaned = cleaned.replace(/\\(quad|left|right|begin|end)\w*/g, '');

  // 4. Remove newlines
  cleaned = cleaned.replace(/\n/g, ' ');

  return cleaned;
}


// --- Metadata (Replace your existing generateMetadata function with this) ---
export async function generateMetadata({ params }) {
  // Get both slugs and the setNumber from the URL parameters
  const { slug, moduleSlug, subsectionSlug, setNumber } = await params; 
  const supabase = getSupabaseClient();

  // 1. Fetch titles
  const { data: subsection } = await supabase
    .from('subsections')
    .select(
      `subsection_title, 
        sections!inner(section_title, courses!inner(title))`
    )
    .eq('slug', subsectionSlug)
    .eq('sections.slug', moduleSlug)
    .eq('sections.courses.slug', slug)
    .single();

  if (!subsection) return { title: 'Worksheet Not Found' };

  const courseTitle = subsection.sections.courses.title;
  const sectionTitle = subsection.sections.section_title;
  const lessonTitle = subsection.subsection_title;

  // 2. Find the relevant quiz ID using setNumber
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, name')
    .eq('subsection_id', subsection.id)
    .order('display_order', { ascending: true }); 

  // Select the quiz based on the URL parameter, defaulting to the first quiz (index 0)
  const quizIndex = parseInt(setNumber, 10) - 1;
  const quiz = quizzes?.[quizIndex] || quizzes?.[0];
    
  // Fallback description if no quiz/problems are found
  if (!quiz) {
      return { 
          title: `${courseTitle} - ${sectionTitle} - ${lessonTitle} | Worksheet`,
          description: `Printable math problems for ${lessonTitle}. Practice key concepts from the ${sectionTitle} module of the ${courseTitle} course.`
      };
  }
    
  // 3. Fetch the questions for the selected quiz
  const { data: quizQuestions } = await supabase
    .from('quiz_questions')
    .select(
      `questions (
         question_text
      )`
    )
    .eq('quiz_id', quiz.id) 
    .order('sort_order', { ascending: true })
    .limit(3); 

  // 4. Construct the Dynamic Description
  let description = `Practice ${lessonTitle} with this printable math worksheet (${quiz.name}): `;
  
  if (quizQuestions && quizQuestions.length > 0) {
    const questionSnippets = quizQuestions
      .map(q => q.questions?.question_text || '')
      .filter(text => text.length > 0)
      .map(text => {
        // Use the cleanup function to remove LaTeX clutter
        let cleanText = cleanMathText(text); 
        return cleanText.substring(0, 30) + '...'; // Take a shorter snippet for packing more problems in
      });
    
    // Join the snippets to form the body of the description
    description += questionSnippets.join(' | '); 
  }

  // 5. Ensure the whole description is within the 120-160 character limit
  const finalDescription = description.substring(0, 160);


  // 6. Return the metadata
  return {
    title: `${courseTitle} - ${sectionTitle} - ${lessonTitle} | Worksheet`,
    description: finalDescription,
  };
}

// --- Main Page Component ---
export default async function PrintableWorksheetPage({ params }) {
  const { slug, moduleSlug, subsectionSlug, setNumber } = await params;
  const supabase = getSupabaseClient();

  // Fetch subsection
  const { data: subsection } = await supabase
    .from('subsections')
    .select(
      `id, subsection_title, 
        sections!inner(id, slug, section_title, courses!inner(slug, title))`
    )
    .eq('slug', subsectionSlug)
    .eq('sections.slug', moduleSlug)
    .eq('sections.courses.slug', slug)
    .single();

  if (!subsection) return notFound();

  // Fetch adjacent subsections for navigation
  const { data: allSubsections } = await supabase
    .from('subsections')
    .select('id, subsection_title, slug')
    .eq('section_id', subsection.sections.id)
    .order('id', { ascending: true });

  const currentIndex = allSubsections?.findIndex(s => s.id === subsection.id) ?? -1;
  const prevSubsection = currentIndex > 0 ? {
    slug: allSubsections[currentIndex - 1].slug,
    title: allSubsections[currentIndex - 1].subsection_title
  } : null;
  const nextSubsection = currentIndex < (allSubsections?.length ?? 0) - 1 ? {
    slug: allSubsections[currentIndex + 1].slug,
    title: allSubsections[currentIndex + 1].subsection_title
  } : null;

  // Fetch quizzes
  const { data: quizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('id, name, difficulty, is_premium')
    .eq('subsection_id', subsection.id)
    .order('display_order', { ascending: true });

  if (!quizzes || quizzesError) return notFound();

  const quizIndex = parseInt(setNumber, 10) - 1;
  if (quizIndex < 0 || quizIndex >= quizzes.length) return notFound();

  const quiz = quizzes[quizIndex];
  
  // Check if current user has saved this quiz
  const { data: { user } } = await supabase.auth.getUser();
  let isSaved = false;
  
  if (user) {
    // Check if this specific quiz/worksheet is saved
    const { data: savedQuiz } = await supabase
      .from('user_saved_quizzes')
      .select('id')
      .eq('user_id', user.id)
      .eq('quiz_id', quiz.id)
      .single();
    isSaved = !!savedQuiz;
  }

  // Fetch questions (WITHOUT reviewed field)
  const { data: quizQuestions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select(`
      sort_order,
      questions (
        id, question_text, option_a, option_b, option_c, option_d,
        correct_option, short_explanation
      )
    `)
    .eq('quiz_id', quiz.id)
    .order('sort_order', { ascending: true });

  if (!quizQuestions || questionsError) return notFound();

  const questions = quizQuestions.map(q => q.questions).filter(Boolean);
  if (questions.length === 0) return notFound();

  const isPremiumContent = quiz.is_premium || false;

  // Paginate questions server-side
  const pages = paginateQuestions(questions);

  return (
    <div className='no-print'>

      <TopTutorToast />

      {/* Subsection Navigation Arrows */}
      <SubsectionNavigation 
        prevSubsection={prevSubsection}
        nextSubsection={nextSubsection}
        slug={slug}
        moduleSlug={moduleSlug}
      />

      {/* Save Lesson Button - Fixed position top right */}
      <div className="fixed top-20 right-4 lg:right-[calc(16rem+2rem)] z-20 flex gap-2">
        <SaveLessonButton quizId={quiz.id} initialSaved={isSaved} />
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen">

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6 bg-gray-800 min-h-screen">
          {/* --- SEO INTRO BLOCK (Non-print) --- */}
<div className="no-print bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md mb-6 max-w-[8.5in] mx-auto">

  {/* Dynamic Titles */}
  <h2 className="text-xl font-bold mb-2">
    {subsection.subsection_title}
  </h2>

  <p className="text-gray-700 mb-4">
    This worksheet covers <strong>{subsection.subsection_title}</strong>, 
    which is part of the <strong>{subsection.sections.section_title}</strong> module 
    in the <strong>{subsection.sections.courses.title}</strong> course.
    Practice problems are designed to strengthen key concepts and build confidence.
  </p>

  {/* Links to Module + Course */}
  <div className="space-y-1 mb-4">
    <Link
      href={`/courses/${slug}/${moduleSlug}`}
      className="text-blue-600 underline"
    >
      More in {subsection.sections.section_title}
    </Link>
    <br />
    <Link
      href={`/courses/${slug}`}
      className="text-blue-600 underline"
    >
      View full {subsection.sections.courses.title} course
    </Link>
  </div>

  {/* Related Subsections (Auto-generated) */}
  {Array.isArray(allSubsections) && allSubsections.length > 1 && (
    <div className="mb-4">
      <p className="font-semibold mb-1">Related Lessons:</p>

      <ul className="list-disc pl-5 text-blue-600">
        {allSubsections
          .filter(s => s.slug !== subsectionSlug)
          .slice(0, 3)
          .map(s => (
            <li key={s.slug}>
              <Link
                href={`/courses/${slug}/${moduleSlug}/${s.slug}/1`}
                className="underline"
              >
                {s.subsection_title}
              </Link>
            </li>
        ))}
      </ul>
    </div>
  )}

  {/* Paid Course CTA */}
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <h3 className="font-bold text-lg mb-1">Want to reach top 5% in SAT Math?</h3>
    <p className="text-gray-700 mb-2">
      Learn shortcut methods and time-saving strategies with our 
      <strong> SAT Math Destroyer Crash Course</strong>.
    </p>
    <Link
      href="/courses/sat-math-destroyer-crash-course"
      className="inline-block text-white bg-purple-600 px-4 py-2 rounded-md font-semibold"
    >
      View Destroyer Course →
    </Link>
  </div>

</div>
          
          {/* Multi-Page Layout */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {pages.map((pageQuestions, pageIdx) => {
              const startIdx = pages.slice(0, pageIdx).reduce((sum, p) => sum + p.length, 0);

              return (
                <div
                  key={`page-${pageIdx}`}
                  className="print-container w-full max-w-[8.5in] mx-auto bg-white p-4 sm:p-8 lg:p-12 shadow-lg sm:shadow-2xl rounded-lg"
                  style={{ minHeight: '11in' }}
                >
                  {/* Header - Only on first page */}
                  {pageIdx === 0 && (
                    <>
                      <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                        {subsection.subsection_title}
                      </h1>
                      <p className="text-center text-gray-600 text-xs sm:text-sm mb-1">
                        {subsection.sections.section_title} • {subsection.sections.courses.title}
                      </p>
                      <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                        {quiz.name} — {quiz.difficulty}
                      </p>
                      <hr className="mb-4 sm:mb-6 border-gray-300" />
                    </>
                  )}

                  {/* Questions for this page */}
                  {pageQuestions.map((q, localIdx) => {
                    const globalIdx = startIdx + localIdx;
                    
                    return (
                      <div
                        key={q.id}
                        className="question-block mb-6 sm:mb-8 break-words relative"
                      >
                        <div className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex gap-1.5 sm:gap-2">
                            <span className="flex-shrink-0">
                                {globalIdx + 1}.
                            </span>
                            <MarkdownKaTeX
                              content={q.question_text}
                              className="flex-1"
                            />
                        </div>

                        <div className="pl-4 sm:pl-6">
                          {['a', 'b', 'c', 'd'].map(opt => {
                            const optionText = q[`option_${opt}`];
                            return optionText ? (
                              <div key={opt} className="mb-1.5 sm:mb-2 flex items-start gap-1.5 sm:gap-2 text-sm sm:text-base">
                                <span className="font-semibold min-w-[24px] sm:min-w-[28px] flex-shrink-0">
                                  {opt.toUpperCase()}.
                                </span>
                                <div className="flex-1">
                                  <MarkdownKaTeX content={optionText} />
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer Message */}
          <div className="max-w-[8.5in] mx-auto mt-8 mb-8 p-6 bg-white rounded-lg shadow-md text-center">
            <p className="text-gray-700 text-sm sm:text-base">
              Feel free to use these worksheets in your classroom or share the link with students and colleagues!
            </p>
          </div>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block w-64 sticky top-16 h-screen border-l border-gray-200 bg-white overflow-y-auto">
          <RightSidebar
            quizzes={quizzes}
            currentSetNumber={quizIndex + 1}
            slug={slug}
            moduleSlug={moduleSlug}
            subsectionSlug={subsectionSlug}
            currentQuiz={quiz}
            subsectionTitle={subsection.subsection_title}
            sectionTitle={subsection.sections.section_title}
            courseTitle={subsection.sections.courses.title}
            questions={questions}
            isPremium={isPremiumContent}
          />
        </div>

        {/* Mobile Right Sidebar - Fixed Bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-h-[50vh] overflow-y-auto p-3 sm:p-4">
            <RightSidebar
              quizzes={quizzes}
              currentSetNumber={quizIndex + 1}
              slug={slug}
              moduleSlug={moduleSlug}
              subsectionSlug={subsectionSlug}
              currentQuiz={quiz}
              subsectionTitle={subsection.subsection_title}
              sectionTitle={subsection.sections.section_title}
              courseTitle={subsection.sections.courses.title}
              questions={questions}
              isPremium={isPremiumContent}
            />
          </div>
        </div>

        {/* Spacer for mobile sidebar */}
        <div className="lg:hidden h-48"></div>
      </div>
    </div>
  );
}