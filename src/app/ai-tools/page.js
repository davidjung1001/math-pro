import ToolTabs from "@/app/ai-tools/ToolTabs";
import AnimatedHero from "@/components/ai-tools/AnimatedHero";
import FinalCTA from "@/components/ai-tools/FinalCTA";
import Script from "next/script";
import { BookOpen, GraduationCap, Clock, Sparkles, Zap, Target, Star } from "lucide-react";

export const metadata = {
  title: "Free AI Worksheet Generator – Create Custom Worksheets in Seconds | Stillwater Math Pro",
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
    "homework generator",
  ],
  alternates: {
    canonical: "https://www.stillymathpro.com/ai-tools",
  },
  robots: "index, follow",
  openGraph: {
    title: "Free AI Worksheet Generator – Stillwater Math Pro",
    description:
      "Create custom worksheets, lesson plans, and study materials with AI in seconds. Free for teachers and students.",
    url: "https://www.stillymathpro.com/ai-tools",
    siteName: "Stillwater Math Pro",
    images: [
      {
        url: "https://www.stillymathpro.com/images/og-ai-tools.png",
        width: 1200,
        height: 630,
        alt: "Free AI Worksheet Generator – Stillwater Math Pro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Worksheet Generator – Stillwater Math Pro",
    description:
      "Create custom worksheets, lesson plans, and study materials with AI in seconds. No sign-up required.",
    images: ["https://www.stillymathpro.com/images/og-ai-tools.png"],
  },
};

export default function LearningHubPage() {
  return (
    <main className="bg-white min-h-screen">
      <AnimatedHero />

      {/* Stats bar */}
      <section className="py-10 px-4 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">10,000+</div>
              <div className="text-sm text-gray-500">Worksheets Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">50+</div>
              <div className="text-sm text-gray-500">Subjects Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">95%</div>
              <div className="text-sm text-gray-500">User Satisfaction</div>
            </div>
            <div>
              <div className="flex justify-center mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-sm text-gray-500">5-Star Rated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="py-16 px-4" id="tool">
        <div className="max-w-7xl mx-auto">
          <ToolTabs />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three steps to generate custom educational materials
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Describe Your Topic", desc: "Enter what you want to learn or teach. Be specific about topic, grade level, and number of questions." },
              { step: "2", title: "AI Creates Content", desc: "Our AI processes your request in seconds, generating custom questions and exercises tailored to your needs." },
              { step: "3", title: "Download & Use", desc: "Review, edit if needed, then download or print. Use immediately in your classroom or study session." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is section */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            What is an AI Worksheet Generator?
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              An <strong className="text-gray-800">AI worksheet generator</strong> is an educational tool
              that uses artificial intelligence to create custom worksheets, lesson plans, flashcards, and
              study materials in seconds. Instead of spending hours formatting documents or searching for
              the perfect template, teachers and students describe what they need and the AI instantly
              generates ready-to-use content.
            </p>
            <p>
              Whether you need math problems for 5th graders, vocabulary worksheets for ESL students, or
              science review questions for high schoolers, the AI adapts to create age-appropriate,
              curriculum-aligned content.
            </p>
            <p>
              It&apos;s <strong className="text-gray-800">completely free with no sign-up required</strong>.
              Generate unlimited worksheets and use them immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Worksheets */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
            Create Any Type of Worksheet
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🔢", title: "Math Worksheets", desc: "Algebra, geometry, calculus, word problems, and more for any grade level" },
              { icon: "📖", title: "Reading Comprehension", desc: "Passages with questions for any reading level or subject area" },
              { icon: "🔬", title: "Science Worksheets", desc: "Biology, chemistry, physics labs, diagrams, and review questions" },
              { icon: "✍️", title: "Grammar & Writing", desc: "Parts of speech, punctuation, vocabulary, and creative writing prompts" },
              { icon: "🌍", title: "Social Studies", desc: "History timelines, geography maps, civics, and current events" },
              { icon: "📝", title: "Test Prep & Quizzes", desc: "Practice tests, study guides, flashcards, and review materials" },
            ].map((type, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                <div className="text-2xl mb-3">{type.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{type.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
            Built for Teachers &amp; Students
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Teachers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Clock className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Save Hours Every Week</p>
                    <p className="text-sm text-gray-600">Generate worksheets in seconds instead of building them manually</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Perfect Customization</p>
                    <p className="text-sm text-gray-600">Tailor every worksheet to your curriculum and student needs</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Differentiated Instruction</p>
                    <p className="text-sm text-gray-600">Create multiple difficulty levels for the same topic in minutes</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Students</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Zap className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Unlimited Practice</p>
                    <p className="text-sm text-gray-600">Generate as many practice worksheets as you need to master any topic</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Personalized Learning</p>
                    <p className="text-sm text-gray-600">Focus on topics you find challenging at your own pace</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Better Test Prep</p>
                    <p className="text-sm text-gray-600">Create practice tests that match your actual exam format</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is the AI worksheet generator really free?", a: "Yes, completely free with no hidden costs, subscriptions, or credit card required. Generate unlimited worksheets without any restrictions." },
              { q: "Do I need to create an account?", a: "No sign-up or account creation is required. Just visit the page, describe what you need, and start generating immediately." },
              { q: "What subjects and grade levels are supported?", a: "All major subjects — math, science, English/ELA, social studies, foreign languages — across all grade levels from kindergarten through college." },
              { q: "How long does it take to generate a worksheet?", a: "Most worksheets are ready in 10–30 seconds. Simple worksheets are nearly instant; longer study guides may take up to a minute." },
              { q: "Can I edit the worksheets after they're generated?", a: "Yes. Review and modify the content before downloading, then save or print the final version." },
              { q: "Are the worksheets curriculum-aligned?", a: "The AI generates educationally appropriate content based on grade level and subject. We recommend reviewing to confirm alignment with your specific standards (Common Core, state standards, etc.)." },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />

      {/* Structured data */}
      <Script type="application/ld+json" id="ai-tools-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Worksheet Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: "https://www.stillymathpro.com/ai-tools",
          description: "Free AI worksheet generator for creating custom worksheets, lesson plans, flashcards, and study materials. Perfect for teachers and students.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1247" },
        })}
      </Script>

      <Script type="application/ld+json" id="faq-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Is the AI worksheet generator really free?", acceptedAnswer: { "@type": "Answer", text: "Yes, our AI worksheet generator is completely free to use with no hidden costs, subscriptions, or credit card required." } },
            { "@type": "Question", name: "Do I need to create an account to use the worksheet generator?", acceptedAnswer: { "@type": "Answer", text: "No sign-up or account creation is required. Simply visit the page, describe what worksheet you need, and start generating immediately." } },
            { "@type": "Question", name: "What subjects and grade levels are supported?", acceptedAnswer: { "@type": "Answer", text: "Our AI can generate worksheets for all major subjects including math, science, English/language arts, social studies, and foreign languages, across all grade levels from kindergarten through college." } },
            { "@type": "Question", name: "How long does it take to generate a worksheet?", acceptedAnswer: { "@type": "Answer", text: "Most worksheets are generated in 10-30 seconds, depending on length and complexity." } },
            { "@type": "Question", name: "Can I edit the worksheets after they are generated?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can review and modify the generated content before downloading." } },
            { "@type": "Question", name: "Are the worksheets curriculum-aligned?", acceptedAnswer: { "@type": "Answer", text: "While our AI generates educationally appropriate content based on grade level and subject, we recommend reviewing worksheets to ensure they align with your specific curriculum standards." } },
          ],
        })}
      </Script>
    </main>
  );
}
