import ToolTabs from "@/app/ai-tools/ToolTabs";
import AnimatedHero from "@/components/ai-tools/AnimatedHero";
import FinalCTA from "@/components/ai-tools/FinalCTA";
import Script from "next/script";
import { CheckCircle, BookOpen, GraduationCap, Clock, Sparkles, Zap, Target, Star } from "lucide-react";

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
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section - Above the fold, optimized for SEO */}
      <AnimatedHero />

      {/* Social Proof Section - Build trust */}
      <section className="py-12 px-4 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-indigo-600 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Worksheets Generated</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Subjects Covered</div>
            </div>
            <div>
              <div className="text-4xl font-black text-pink-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium">User Satisfaction</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
              </div>
              <div className="text-gray-600 font-medium">5-Star Rated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section - The main product */}
      <section className="py-16 px-4" id="tool">
        <div className="max-w-7xl mx-auto">
          <ToolTabs />
        </div>
      </section>

      {/* How It Works Section - Clear value prop */}
      <section className="py-20 px-4 bg-gradient-to-b from-indigo-50 to-purple-50" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How to Create Your Perfect Worksheet
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to generate custom educational materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-200">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-white">1</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Describe Your Topic</h3>
                <p className="text-gray-700 leading-relaxed">
                  Enter what you want to learn or teach. Be specific about topic, grade level, and number of questions. Our AI understands natural language.
                </p>
              </div>
            </div>

            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-white">2</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Creates Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our advanced AI processes your request in seconds, generating custom questions, exercises, and content tailored to your exact specifications.
                </p>
              </div>
            </div>

            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-pink-200">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-white">3</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Download & Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  Review, edit if needed, then download or print. Use immediately in your classroom, study session, or share with students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section - SEO content */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900">
            What is an AI Worksheet Generator?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              An <strong>AI worksheet generator</strong> is a powerful educational tool that uses artificial intelligence to create custom worksheets, lesson plans, flashcards, and study materials in seconds. Instead of spending hours formatting documents or searching for the perfect worksheet template, teachers and students can simply describe what they need, and our AI instantly generates professionally formatted, ready-to-use educational content.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our <strong>worksheet generator</strong> leverages advanced AI technology to understand your specific requirements and create materials that match your exact needs. Whether you need math problems for 5th graders, vocabulary worksheets for ESL students, or science review questions for high schoolers, the AI adapts to create age-appropriate, curriculum-aligned content.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Best of all, it's <strong>completely free to use with no sign-up required</strong>. Generate unlimited worksheets, modify them as needed, and use them in your classroom or study sessions immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Worksheets - SEO keyword targeting */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-gray-900 text-center">
            Create Any Type of Worksheet
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔢",
                title: "Math Worksheets",
                desc: "Algebra, geometry, calculus, word problems, and more for any grade level"
              },
              {
                icon: "📖",
                title: "Reading Comprehension",
                desc: "Passages with questions for any reading level or subject area"
              },
              {
                icon: "🔬",
                title: "Science Worksheets",
                desc: "Biology, chemistry, physics labs, diagrams, and review questions"
              },
              {
                icon: "✍️",
                title: "Grammar & Writing",
                desc: "Parts of speech, punctuation, vocabulary, and creative writing prompts"
              },
              {
                icon: "🌍",
                title: "Social Studies",
                desc: "History timelines, geography maps, civics, and current events"
              },
              {
                icon: "📝",
                title: "Test Prep & Quizzes",
                desc: "Practice tests, study guides, flashcards, and review materials"
              }
            ].map((type, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-200">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{type.title}</h3>
                <p className="text-gray-600">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Conversion focused */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-gray-900 text-center">
            Why Teachers & Students Love It
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Teachers */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-600 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">For Teachers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Save Hours Every Week</strong>
                    <p className="text-gray-700">Generate high-quality worksheets in seconds instead of spending hours creating them manually</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Target className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Perfect Customization</strong>
                    <p className="text-gray-700">Tailor every worksheet to your curriculum, student needs, and lesson plans</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Differentiated Instruction</strong>
                    <p className="text-gray-700">Create multiple difficulty levels for the same topic in minutes</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Students */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl border-2 border-pink-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-600 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">For Students</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Zap className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Unlimited Practice</strong>
                    <p className="text-gray-700">Generate as many practice worksheets as you need to master any topic</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Target className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Personalized Learning</strong>
                    <p className="text-gray-700">Focus on topics you find challenging at your own pace and difficulty level</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 text-lg">Better Test Prep</strong>
                    <p className="text-gray-700">Create practice tests that match your actual exam format</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO rich content */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is the AI worksheet generator really free?",
                a: "Yes, our AI worksheet generator is completely free to use with no hidden costs, subscriptions, or credit card required. You can generate unlimited worksheets, lesson plans, and study materials without any restrictions."
              },
              {
                q: "Do I need to create an account to use the worksheet generator?",
                a: "No sign-up or account creation is required. Simply visit the page, describe what worksheet you need, and start generating immediately. We believe in making educational tools accessible to everyone."
              },
              {
                q: "What subjects and grade levels are supported?",
                a: "Our AI can generate worksheets for all major subjects including math, science, English/language arts, social studies, and foreign languages. It supports all grade levels from kindergarten through college, adapting content complexity to match the specified grade level."
              },
              {
                q: "How long does it take to generate a worksheet?",
                a: "Most worksheets are generated in 10-30 seconds, depending on length and complexity. Simple worksheets with fewer questions generate almost instantly, while comprehensive study guides may take up to a minute."
              },
              {
                q: "Can I edit the worksheets after they're generated?",
                a: "Yes, you can review and modify the generated content before downloading. Make any adjustments needed to perfectly match your requirements, then save or print the final version."
              },
              {
                q: "Are the worksheets curriculum-aligned?",
                a: "While our AI generates educationally appropriate content based on grade level and subject, we recommend reviewing worksheets to ensure they align with your specific curriculum standards (Common Core, state standards, etc.)."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:border-indigo-200 transition-all">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.q}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Structured data for search engines */}
      <Script type="application/ld+json" id="ai-tools-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Worksheet Generator",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "url": "https://yourdomain.com/ai-tools",
          "description": "Free AI worksheet generator for creating custom worksheets, lesson plans, flashcards, and study materials. Perfect for teachers and students.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1247"
          }
        })}
      </Script>

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
                "text": "Yes, our AI worksheet generator is completely free to use with no hidden costs, subscriptions, or credit card required."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to create an account?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up or account creation is required. Simply visit the page and start generating immediately."
              }
            }
          ]
        })}
      </Script>


    </main>
  );
}