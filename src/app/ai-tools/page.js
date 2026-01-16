import ToolTabs from "@/app/ai-tools/ToolTabs";
import Script from "next/script";
import { CheckCircle, BookOpen, GraduationCap, Clock, Sparkles } from "lucide-react";

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
    url: "https://yourdomain.com/ai-tools",
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
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI Worksheet Generator
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Create custom worksheets, lesson plans, and study materials in seconds with AI. Free, fast, and perfect for teachers and students.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              No Sign-Up Required
            </span>
            <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              100% Free
            </span>
            <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              Instant Results
            </span>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <ToolTabs />
        </div>
      </section>

      {/* What is AI Worksheet Generator Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            What is an AI Worksheet Generator?
          </h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            An AI worksheet generator is a powerful educational tool that uses artificial intelligence to create custom worksheets, lesson plans, flashcards, and study materials in seconds. Instead of spending hours formatting documents or searching for the perfect worksheet template, teachers and students can simply describe what they need, and our AI instantly generates professionally formatted, ready-to-use educational content.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Our worksheet generator leverages advanced AI technology to understand your specific requirements and create materials that match your exact needs. Whether you need math problems for 5th graders, vocabulary worksheets for ESL students, or science review questions for high schoolers, the AI adapts to create age-appropriate, curriculum-aligned content.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Best of all, it's completely free to use with no sign-up required. Generate unlimited worksheets, modify them as needed, and use them in your classroom or study sessions immediately.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">
            How to Use the AI Worksheet Generator
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe What You Need</h3>
              <p className="text-gray-700">
                Type in what kind of worksheet you want to create. Be specific about the topic, grade level, number of questions, and any special requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Generates Content</h3>
              <p className="text-gray-700">
                Our AI processes your request and creates a custom worksheet in seconds, complete with questions, exercises, or content tailored to your specifications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Download & Use</h3>
              <p className="text-gray-700">
                Review your worksheet, make any edits if needed, then download or print it. Use it immediately in your classroom or study session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Worksheets Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Types of Worksheets You Can Generate
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Math Worksheets</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Create custom math worksheets for any grade level or skill. Generate addition, subtraction, multiplication, and division problems for elementary students. Build algebra worksheets with equations and word problems for middle schoolers. Create geometry exercises, calculus problem sets, or statistics worksheets for high school and college students. Specify difficulty level, number of problems, and whether you want answer keys included.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Reading Comprehension Worksheets</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Generate reading passages with comprehension questions tailored to any reading level. Create worksheets with short stories, informational texts, or articles on specific topics. Include multiple choice questions, short answer prompts, or vocabulary exercises. Perfect for building reading skills and assessing comprehension across all grade levels.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Science Worksheets</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Create worksheets for biology, chemistry, physics, or earth science. Generate lab worksheets, diagram labeling exercises, scientific method worksheets, or review questions for any science topic. Include vocabulary matching, fill-in-the-blank activities, or experiment observation sheets. Ideal for reinforcing scientific concepts and preparing for tests.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Language Arts & Grammar Worksheets</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Build grammar worksheets focusing on parts of speech, sentence structure, punctuation, or writing skills. Create vocabulary worksheets with definitions, synonyms, and usage examples. Generate creative writing prompts, spelling practice sheets, or literary analysis guides. Perfect for English language learners and native speakers alike.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Social Studies & History Worksheets</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Create worksheets about historical events, geography, civics, or current events. Generate timeline activities, map worksheets, primary source analysis guides, or review sheets for any historical period or social studies topic. Include multiple formats like matching, true/false, or essay questions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Test Prep & Study Guides</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Generate comprehensive study guides and practice tests for standardized exams, final exams, or unit tests. Create flashcards, summary sheets, or review worksheets that cover key concepts. Customize difficulty and format to match specific test requirements or learning objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
            Why Teachers and Students Love Our AI Worksheet Generator
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Teachers Benefits */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-10 h-10 text-blue-600" />
                <h3 className="text-2xl font-semibold text-gray-900">For Teachers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Save Hours of Prep Time:</strong>
                    <p className="text-gray-700">Stop spending evenings creating worksheets from scratch. Generate high-quality materials in seconds and spend more time on what matters: teaching and connecting with students.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Unlimited Customization:</strong>
                    <p className="text-gray-700">Create worksheets perfectly tailored to your curriculum, student needs, and lesson plans. Adjust difficulty, length, and format to match your exact requirements.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Differentiated Instruction Made Easy:</strong>
                    <p className="text-gray-700">Quickly generate multiple versions of worksheets at different difficulty levels to meet diverse student needs in the same classroom.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <BookOpen className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Fresh Content Every Time:</strong>
                    <p className="text-gray-700">Never use the same worksheet twice. Generate new materials for each class, year, or unit to keep content engaging and prevent answer sharing.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Students Benefits */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-10 h-10 text-purple-600" />
                <h3 className="text-2xl font-semibold text-gray-900">For Students</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Unlimited Practice Materials:</strong>
                    <p className="text-gray-700">Generate as many practice worksheets as you need to master any topic. Perfect for test preparation, homework help, or self-study.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Personalized Learning:</strong>
                    <p className="text-gray-700">Create worksheets focused on topics you find challenging. Get extra practice in areas where you need it most, at your own pace.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Study Anytime, Anywhere:</strong>
                    <p className="text-gray-700">Generate study materials whenever you need them, whether you're preparing for a quiz tomorrow or reviewing for finals next month.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <GraduationCap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Better Test Preparation:</strong>
                    <p className="text-gray-700">Create practice tests that match your actual exam format. Build confidence by practicing with materials similar to what you'll see on test day.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Tips for Creating Effective Worksheets
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Be specific with your prompts:</strong> The more details you provide, the better your results. Instead of "math worksheet," try "20 two-digit multiplication problems for 3rd grade with an answer key." Specify grade level, topic, number of questions, and any special formatting you need.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Match difficulty to your audience:</strong> Always specify the appropriate grade level or skill level. This ensures the vocabulary, complexity, and formatting are age-appropriate and educationally effective.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Include clear learning objectives:</strong> Mention what skills or concepts the worksheet should target. For example, "practice identifying main ideas in informational texts" or "reinforce understanding of the water cycle."
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Request answer keys when needed:</strong> For assessment purposes, always ask for an answer key to be included. This saves time during grading and ensures accurate scoring.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Mix question types:</strong> For better engagement and comprehensive assessment, request a variety of question formats such as multiple choice, fill-in-the-blank, short answer, and matching exercises all in one worksheet.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Generate multiple versions:</strong> Create several versions of the same worksheet for different purposes: one for guided practice, one for independent work, and one slightly harder for advanced students. This supports differentiated instruction effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Is the AI worksheet generator really free?</h3>
              <p className="text-gray-700">
                Yes, our AI worksheet generator is completely free to use with no hidden costs, subscriptions, or credit card required. You can generate unlimited worksheets, lesson plans, and study materials without any restrictions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Do I need to create an account to use the worksheet generator?</h3>
              <p className="text-gray-700">
                No sign-up or account creation is required. Simply visit the page, describe what worksheet you need, and start generating immediately. We believe in making educational tools accessible to everyone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">What subjects and grade levels are supported?</h3>
              <p className="text-gray-700">
                Our AI can generate worksheets for all major subjects including math, science, English/language arts, social studies, and foreign languages. It supports all grade levels from kindergarten through college, adapting content complexity to match the specified grade level.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Can I edit the worksheets after they're generated?</h3>
              <p className="text-gray-700">
                Yes, you can review and modify the generated content before downloading. Make any adjustments needed to perfectly match your requirements, then save or print the final version.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">How long does it take to generate a worksheet?</h3>
              <p className="text-gray-700">
                Most worksheets are generated in 10-30 seconds, depending on length and complexity. Simple worksheets with fewer questions generate almost instantly, while comprehensive study guides or multi-page materials may take up to a minute.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Can I use these worksheets commercially or in my paid courses?</h3>
              <p className="text-gray-700">
                Teachers can freely use generated worksheets in their classrooms, whether public, private, or homeschool settings. If you plan to include them in commercially sold materials or courses, please review our terms of service or contact us for licensing information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Are the worksheets curriculum-aligned?</h3>
              <p className="text-gray-700">
                While our AI generates educationally appropriate content based on grade level and subject, we recommend reviewing worksheets to ensure they align with your specific curriculum standards (Common Core, state standards, etc.). The AI creates high-quality educational content that can be easily adapted to meet specific standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your First Worksheet?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of teachers and students using AI to create better educational materials in seconds.
          </p>
          <a 
            href="#tool" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Start Generating Worksheets Free
          </a>
        </div>
      </section>

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
                "text": "Yes, our AI worksheet generator is completely free to use with no hidden costs, subscriptions, or credit card required. You can generate unlimited worksheets, lesson plans, and study materials without any restrictions."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to create an account to use the worksheet generator?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up or account creation is required. Simply visit the page, describe what worksheet you need, and start generating immediately."
              }
            },
            {
              "@type": "Question",
              "name": "What subjects and grade levels are supported?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI can generate worksheets for all major subjects including math, science, English/language arts, social studies, and foreign languages. It supports all grade levels from kindergarten through college."
              }
            }
          ]
        })}
      </Script>
    </main>
  );
}