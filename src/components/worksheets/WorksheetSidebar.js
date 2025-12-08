import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import KaTeXRenderer from '@/components/KaTeXRenderer' 
import WorksheetSidebar from '@/components/worksheets/WorksheetSidebar' 


// --- START: Formatting Logic for KaTeX (Unchanged) ---
const subscriptMap = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', 
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
}
const formatChemFormula = (text) => text.replace(/_([0-9])/g, (_, digit) => subscriptMap[digit] || digit)
const preprocessForKaTeX = (text) => {
  if (!text) return ''
  let preprocessedText = text
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\s+/g, ' ') 
    .trim()
  return formatChemFormula(preprocessedText)
}
// --- END: Formatting Logic ---


// --- Answer Key Data Processing (Unchanged) ---
function generateAnswerKey(questions) {
    return questions.map((q, index) => {
        const correctOptionLetter = q.correct_option;
        const correctOptionKey = `option_${correctOptionLetter.toLowerCase()}`;
        const rawAnswerText = q[correctOptionKey];

        return {
            index: index + 1,
            formattedAnswer: `${correctOptionLetter}. ${rawAnswerText ? preprocessForKaTeX(rawAnswerText) : 'N/A'}`,
            rawAnswerLetter: correctOptionLetter,
            explanation: preprocessForKaTeX(q.short_explanation),
        };
    });
}


// --- Supabase Client Utility and Metadata (Unchanged) ---
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function generateMetadata({ params }) {
    const { slug, moduleSlug, subsectionSlug } = await params
    const supabase = getSupabaseClient()
    const { data: subsection } = await supabase
        .from('subsections')
        .select(`subsection_title, sections!inner(section_title, courses!inner(title))`)
        .eq('slug', subsectionSlug)
        .eq('sections.slug', moduleSlug)
        .eq('sections.courses.slug', slug)
        .single()
    if (!subsection) return { title: 'Worksheet Not Found' }
    const title = `${subsection.sections.courses.title} - ${subsection.sections.section_title} - ${subsection.subsection_title} | Worksheet`;
    return { title: title }
}


// --- Main Page Component (Server Component) ---

export default async function PrintableWorksheetPage({ params }) {
    const { slug, moduleSlug, subsectionSlug, setNumber } = await params
    const supabase = getSupabaseClient()

    // 1. Fetch data 
    const { data: subsection } = await supabase
        .from('subsections')
        .select(`
            id, subsection_title, 
            sections!inner(id, slug, section_title, courses!inner(slug, title))
        `)
        .eq('slug', subsectionSlug)
        .eq('sections.slug', moduleSlug)
        .eq('sections.courses.slug', slug)
        .single()
    if (!subsection) return notFound()

    const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id, name, difficulty')
        .eq('subsection_id', subsection.id)
        .order('display_order', { ascending: true })
    if (!quizzes || quizzes.length === 0) return notFound()

    const quizIndex = parseInt(setNumber, 10) - 1
    if (quizIndex < 0 || quizIndex >= quizzes.length) return notFound()
    const quiz = quizzes[quizIndex]

    const { data: quizQuestions } = await supabase
        .from('quiz_questions')
        .select(`sort_order, questions (id, question_text, option_a, option_b, option_c, option_d, correct_option, short_explanation)`)
        .eq('quiz_id', quiz.id)
        .order('sort_order', { ascending: true })
    if (!quizQuestions || quizQuestions.length === 0) return notFound()

    const questions = quizQuestions.map(q => q.questions)
    const answerKeyData = generateAnswerKey(questions); 

    const backUrl = `/${slug}/${moduleSlug}/${subsectionSlug}`;
    const currentSet = parseInt(setNumber, 10);
    
    // --- RENDER SECTION ---
    return (
        <>
            <style>
                {`
                    /* --- FIX 1: Ensure Full-Width Layout and Contain Worksheet Scroll --- */
                    html, body { 
                        height: 100%; 
                        width: 100%;
                        margin: 0; 
                        padding: 0;
                        overflow: hidden; /* Prevent document scroll */
                        background-color: #f7f7f7; /* Add a slight background color for contrast */
                    }
                    
                    /* The new main container that holds the sidebar and content area */
                    .main-layout {
                        display: flex;
                        height: 100vh; /* Full viewport height */
                        width: 100vw;
                    }

                    /* Wrapper for the main content area (Back button + Worksheet) */
                    .content-area {
                        flex-grow: 1; 
                        display: flex;
                        flex-direction: column;
                        align-items: center; 
                        padding: 20px 0; 
                        overflow-y: auto; /* Scroll the entire content area */
                        min-width: 0; /* Important for flexbox layout on small screens */
                    }
                    
                    /* 🚨 FIX 2: Ensure the back arrow is not rigidly centered with the worksheet */
                    .back-arrow-wrapper {
                        width: 90%; 
                        max-width: 210mm; 
                        margin-bottom: 20px;
                    }

                    /* The container that simulates the 'PDF Box' */
                    .worksheet-scroll-box {
                        width: 90%; 
                        max-width: 210mm; 
                        background: white;
                        box-shadow: 0 0 8px rgba(0,0,0,0.1); 
                        /* max-height removed to allow content-area scroll to handle it */
                    }
                    
                    .worksheet-container {
                        /* Styles applied to the content *inside* the paper look */
                        width: 100%; 
                        padding: 30px; 
                        box-sizing: border-box; 
                    }

                    /* 🚨 FIX 3: Mobile adjustments to make the sidebar stack and worksheet fill */
                    @media (max-width: 768px) {
                        .main-layout {
                            flex-direction: column;
                            height: auto; 
                            overflow-y: auto; /* Allow full page scroll on mobile */
                        }
                        .content-area {
                            padding: 10px; 
                            overflow-y: visible; /* Let the main-layout handle the scroll */
                        }
                        .back-arrow-wrapper {
                            width: 100%;
                            padding: 0 10px;
                            margin-bottom: 10px;
                        }
                        .worksheet-scroll-box {
                            width: 100%; 
                            max-width: 100%;
                            box-shadow: none;
                        }
                        .worksheet-container {
                            padding: 1rem;
                        }
                        .sidebar {
                            width: 100% !important; 
                            position: static !important;
                            border-right: none !important;
                            border-bottom: 1px solid #e5e7eb;
                        }
                    }

                    /* --- PRINT STYLING (Unchanged, hides sidebar/nav) --- */
                    @page { size: A4; margin: 20mm; }
                    @media print {
                        .main-layout { display: block; height: auto; width: auto; }
                        .sidebar, .back-arrow-wrapper { display: none; } 
                        .content-area { padding: 0; overflow: visible; }
                        .worksheet-scroll-box { max-width: none; box-shadow: none; }
                        .worksheet-container { padding: 0; }
                    }
                    
                    /* --- Question and Element Styling (Unchanged) --- */
                    body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; text-align: justify; }
                    .question { margin-bottom: 24pt; page-break-inside: avoid; overflow-x: auto; }
                    h1, h2 { text-align: center; margin: 0 0 4pt 0; }
                    h1 { font-size: 18pt; font-weight: bold; }
                    .options { list-style-type: none; padding-left: 18pt; margin-top: 6pt; }
                    .options li { margin-bottom: 4pt; }
                `}
            </style>
            
            <div className="main-layout">
                {/* 🚨 Sidebar Component - Renders full height on desktop */}
                <WorksheetSidebar 
                    quizzes={quizzes} 
                    currentSet={currentSet} 
                    slug={slug} 
                    moduleSlug={moduleSlug} 
                    subsectionSlug={subsectionSlug} 
                />
                
                <div className="content-area">
                    {/* 🚨 Back Arrow Wrapper */}
                    <div className="back-arrow-wrapper">
                        <Link 
                            href={backUrl}
                            className="back-arrow"
                            style={{
                                textDecoration: 'none',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: '500'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                            Back to {subsection.subsection_title}
                        </Link>
                    </div>

                    {/* Scrollable PDF Look Box */}
                    <div className="worksheet-scroll-box">
                        <div className="worksheet-container">
                            <h1>{subsection.subsection_title}</h1>
                            <div className="header-info">
                                {subsection.sections.section_title} • {subsection.sections.courses.title}
                                <br />
                                {quiz.name} — {quiz.difficulty}
                            </div>
                            
                            <hr />
                            
                            {questions.map((q, idx) => (
                                <div key={q.id} className="question">
                                    <div> 
                                        <KaTeXRenderer content={`${idx + 1}. ${preprocessForKaTeX(q.question_text)}`} />
                                    </div>
                                    
                                    <ul className="options">
                                        {q.option_a && <li>A. <KaTeXRenderer content={preprocessForKaTeX(q.option_a)} /></li>}
                                        {q.option_b && <li>B. <KaTeXRenderer content={preprocessForKaTeX(q.option_b)} /></li>}
                                        {q.option_c && <li>C. <KaTeXRenderer content={preprocessForKaTeX(q.option_c)} /></li>}
                                        {q.option_d && <li>D. <KaTeXRenderer content={preprocessForKaTeX(q.option_d)} /></li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}