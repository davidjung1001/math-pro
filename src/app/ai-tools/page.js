import ToolTabs from "@/app/ai-tools/ToolTabs";
import Script from "next/script";
import { BookOpen, GraduationCap, FileText, Zap, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Free AI Worksheet Generator – Create Custom Worksheets in Seconds | Smart Study Hub",
  description:
    "Generate custom worksheets, lesson plans, flashcards, and study materials instantly with AI. Free worksheet generator for teachers and students. No sign-up required.",
  keywords: [
    "AI worksheet generator",
    "free worksheet maker",
    "custom worksheet generator",
    "teacher worksheet creator",
    "printable worksheets",
    "AI lesson plans",
    "study materials generator",
    "educational worksheets",
    "worksheet templates",
    "homework generator"
  ],
  robots: "index, follow",
  openGraph: {
    title: "Free AI Worksheet Generator – Smart Study Hub",
    description:
      "Create custom worksheets, lesson plans, and study materials with AI in seconds. Free for teachers and students.",
    url: "https://www.stillymathpro.com/ai-tools",
    siteName: "Smart Study Hub",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Worksheet Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function LearningHubPage() {
  return (
    <main className="bg-[#020617] text-slate-200 min-h-screen">
      {/* Generator - RIGHT AWAY */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ToolTabs />
        </div>
      </section>

      {/* SEO Content Section 1 - What is it */}
      <section className="py-16 px-4 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            What is an AI Worksheet Generator?
          </h2>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 leading-relaxed">
            <p>
              An <strong className="text-white">AI worksheet generator</strong> is an advanced educational tool that uses artificial intelligence to automatically create custom worksheets, practice problems, and study materials in seconds. Instead of spending hours manually creating questions and formatting documents, teachers and students can simply describe what they need and let AI handle the heavy lifting.
            </p>
            <p>
              Our <strong className="text-white">free worksheet maker</strong> leverages cutting-edge language models to generate high-quality, curriculum-aligned content for any subject, grade level, or difficulty. Whether you need a <strong className="text-indigo-300">math worksheet</strong> with 20 algebra problems, a <strong className="text-purple-300">reading comprehension</strong> passage with questions, or a <strong className="text-cyan-300">science quiz</strong> on the periodic table, our AI can create it instantly.
            </p>
            <p>
              The best part? It's completely <strong className="text-white">free to use</strong>, requires no sign-up, and generates unlimited worksheets. Perfect for teachers preparing lesson plans, students seeking extra practice, or parents homeschooling their children.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section - SEO Rich */}
      <section className="py-16 px-4 bg-[#020617]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
            Why Use an AI Worksheet Generator?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Save Hours of Time",
                desc: "Create custom worksheets in seconds instead of spending hours manually writing questions and formatting documents. Generate a complete worksheet in under 30 seconds."
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-indigo-400" />,
                title: "Any Subject & Grade Level",
                desc: "From elementary math to college-level physics, our AI worksheet maker covers all subjects: mathematics, science, English, history, foreign languages, and more."
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-400" />,
                title: "Customizable Content",
                desc: "Adjust difficulty levels, question types, and topic focus. Whether you need multiple choice, short answer, or word problems, the AI adapts to your needs."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-green-400" />,
                title: "Curriculum-Aligned",
                desc: "Generate worksheets that align with Common Core, state standards, and educational benchmarks. Perfect for standardized test prep like SAT, ACT, and AP exams."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
                title: "Printable & Editable",
                desc: "Download worksheets as PDFs ready to print or share digitally. Edit and customize the generated content to perfectly fit your classroom needs."
              },
              {
                icon: <Zap className="w-8 h-8 text-pink-400" />,
                title: "100% Free Forever",
                desc: "No hidden costs, no premium tiers, no credit card required. Generate unlimited worksheets completely free. Perfect for teachers on a budget."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-700/50 p-6 rounded-xl hover:border-indigo-500/50 transition-colors">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Covered - SEO Keywords */}
      <section className="py-16 px-4 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
            Subjects & Worksheet Types
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            Our AI worksheet generator creates custom practice materials for every subject and grade level. Generate worksheets for:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Math Worksheets", 
                topics: "Algebra, geometry, calculus, trigonometry, statistics, word problems, fractions, decimals, multiplication tables"
              },
              { 
                title: "Science Worksheets", 
                topics: "Biology, chemistry, physics, earth science, anatomy, scientific method, lab reports, experiments"
              },
              { 
                title: "English & Reading", 
                topics: "Grammar, vocabulary, reading comprehension, writing prompts, literary analysis, essays, spelling"
              },
              { 
                title: "History & Social Studies", 
                topics: "World history, US history, geography, civics, government, economics, current events"
              },
              { 
                title: "Foreign Languages", 
                topics: "Spanish, French, German, Chinese, vocabulary, grammar exercises, conjugation practice"
              },
              { 
                title: "Test Prep", 
                topics: "SAT, ACT, GRE, GMAT, AP exams, state assessments, standardized test practice questions"
              }
            ].map((subject, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">{subject.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{subject.topics}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - SEO Content */}
      <section className="py-16 px-4 bg-[#020617]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            How to Use the Free AI Worksheet Generator
          </h2>
          <div className="space-y-6 text-slate-300">
            <div className="bg-slate-900/40 border border-slate-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-indigo-400 mb-3">Step 1: Describe Your Worksheet</h3>
              <p className="text-slate-400 leading-relaxed">
                Simply type what kind of worksheet you need. For example: "Create a 5th grade math worksheet with 15 multiplication problems" or "Generate a biology quiz about the cell cycle with 10 multiple choice questions."
              </p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Step 2: Customize Settings</h3>
              <p className="text-slate-400 leading-relaxed">
                Adjust the difficulty level, number of questions, and format. Choose between multiple choice, short answer, fill-in-the-blank, matching, or essay questions. Set specific parameters like grade level and topic focus.
              </p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Step 3: Generate & Download</h3>
              <p className="text-slate-400 leading-relaxed">
                Click generate and watch as AI creates your custom worksheet in seconds. Download as a PDF to print or share with students. Edit the content if needed and regenerate for variations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Picture to Notes SEO Section */}
<section className="py-16 px-4 bg-slate-900/20">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
      Convert Handwritten Notes to Digital Text with AI
    </h2>
    <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 leading-relaxed">
      <p>
        Our <strong className="text-white">Picture to Notes AI</strong> uses advanced OCR (Optical Character Recognition) and artificial intelligence to instantly convert handwritten or printed notes into beautifully formatted digital study materials. Simply snap a photo of your notes and watch as AI transforms them into organized, searchable text.
      </p>
      <p>
        Perfect for students who want to digitize lecture notes, organize messy handwriting, or create flashcards from textbook pages. The AI can extract text from photos, clean up formatting, and even reorganize content into study guides, summaries, or flashcard sets.
      </p>
      <p>
        Whether you're studying for exams, reviewing class materials, or trying to make sense of rushed lecture notes, our <strong className="text-indigo-300">free note converter</strong> makes it easy to transform any written content into professional study materials in seconds.
      </p>
    </div>
  </div>
</section>

{/* Use Cases for Picture to Notes */}
<section className="py-16 px-4 bg-[#020617]">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
      What Can You Do with Picture to Notes AI?
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      {[
        {
          title: "Digitize Handwritten Notes",
          desc: "Convert messy handwritten lecture notes into clean, organized digital text that's easy to search and study from."
        },
        {
          title: "Create Flashcards from Textbooks",
          desc: "Take photos of textbook pages and automatically generate flashcards with key terms and definitions."
        },
        {
          title: "Organize Class Materials",
          desc: "Transform scattered notes from different classes into well-structured study guides organized by topic."
        },
        {
          title: "Study on the Go",
          desc: "Snap photos of whiteboards, presentations, or study materials and review them anywhere from your phone."
        },
        {
          title: "Generate Summaries",
          desc: "Get concise summaries of lengthy notes to quickly review main concepts before exams."
        },
        {
          title: "Share with Study Groups",
          desc: "Convert your notes to digital format and easily share them with classmates and study partners."
        }
      ].map((useCase, idx) => (
        <div key={idx} className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-xl hover:border-pink-500/50 transition-colors">
          <h3 className="text-xl font-bold text-pink-300 mb-3">{useCase.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{useCase.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* FAQ Section - Critical for SEO */}
      <section className="py-16 px-4 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is the AI worksheet generator really free?",
                a: "Yes! Our worksheet generator is 100% free to use with no hidden costs, premium tiers, or credit card required. You can generate unlimited worksheets for any subject or grade level without paying a cent. We believe quality educational tools should be accessible to everyone."
              },
              {
                q: "What grade levels does the worksheet maker support?",
                a: "Our AI worksheet generator supports all grade levels from kindergarten through college and beyond. Whether you need simple addition worksheets for elementary students or complex calculus problems for AP students, the AI adapts to your specified difficulty level and educational standards."
              },
              {
                q: "What subjects can I create worksheets for?",
                a: "You can generate worksheets for any subject including mathematics (algebra, geometry, calculus), science (biology, chemistry, physics), English (grammar, reading comprehension, vocabulary), history, social studies, foreign languages, and test prep (SAT, ACT, AP exams). If you can describe it, our AI can create it."
              },
              {
                q: "Do I need to create an account to use the worksheet generator?",
                a: "No sign-up required! You can start generating worksheets immediately without creating an account, providing email, or logging in. Simply describe what you need and download your worksheet."
              },
              {
                q: "Can I edit the generated worksheets?",
                a: "Yes! While worksheets are generated as PDFs, you can request modifications by regenerating with updated instructions. Describe any changes you want and the AI will create a new version. You can also use PDF editing tools to make manual adjustments."
              },
              {
                q: "How quickly are worksheets generated?",
                a: "Most worksheets are generated in 15-30 seconds depending on complexity. Simple worksheets with 10-15 questions generate almost instantly, while more complex materials with detailed instructions may take up to a minute."
              },
              {
                q: "Are the worksheets curriculum-aligned?",
                a: "Yes! Our AI is trained on educational standards including Common Core, state standards, and international curricula. You can specify which standards to align with in your worksheet description for test prep and classroom use."
              },
              {
                q: "Can I use these worksheets commercially?",
                a: "Worksheets generated for personal educational use, classroom teaching, and homeschooling are free to use. For commercial use or mass distribution, please review our terms of service."
              },
              {
                q: "What makes this better than other worksheet generators?",
                a: "Unlike template-based worksheet makers, our AI generates truly custom content tailored to your exact specifications. You're not limited to pre-made templates—describe any topic, difficulty, or format and get unique, high-quality practice materials every time."
              },
              {
                q: "Can I generate answer keys?",
                a: "Yes! When describing your worksheet, simply request an answer key and the AI will generate both the worksheet and corresponding answers. Perfect for teachers who need to grade assignments quickly."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-indigo-300 mb-3">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final SEO Content Block */}
      <section className="py-16 px-4 bg-[#020617]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            The Best Free Worksheet Generator for Teachers and Students
          </h2>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 leading-relaxed">
            <p>
              Finding quality educational materials shouldn't be expensive or time-consuming. Our <strong className="text-white">free AI worksheet generator</strong> empowers teachers, students, and parents to create professional-grade practice materials instantly without any cost.
            </p>
            <p>
              Whether you're a teacher preparing for tomorrow's lesson, a student studying for finals, or a parent helping with homework, our tool provides unlimited access to custom worksheets across every subject. No more searching through outdated worksheet banks or paying for expensive educational software.
            </p>
            <p>
              Join thousands of educators using AI to enhance their teaching and save valuable time. Generate your first worksheet now and experience the future of educational content creation.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Schema Markup */}
      <Script type="application/ld+json" id="ai-tools-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Worksheet Generator",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "url": "https://www.stillymathpro.com/ai-tools",
          "description": "Free AI worksheet generator for creating custom worksheets, practice problems, and study materials. Supports all subjects and grade levels.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1247"
          },
          "featureList": [
            "Custom worksheet generation",
            "All subjects and grade levels",
            "Free unlimited use",
            "No sign-up required",
            "Printable PDF downloads",
            "Curriculum-aligned content"
          ]
        })}
      </Script>

      {/* FAQ Schema */}
      <Script type="application/ld+json" id="faq-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is the AI worksheet generator really free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our worksheet generator is 100% free to use with no hidden costs, premium tiers, or credit card required. You can generate unlimited worksheets for any subject or grade level."
              }
            },
            {
              "@type": "Question",
              "name": "What grade levels does the worksheet maker support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI worksheet generator supports all grade levels from kindergarten through college and beyond, adapting to your specified difficulty level and educational standards."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to create an account?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up required! You can start generating worksheets immediately without creating an account, providing email, or logging in."
              }
            }
          ]
        })}
      </Script>
    </main>
  );
}