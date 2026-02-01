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
    <main className="bg-[#020617] text-slate-200 min-h-screen selection:bg-indigo-500/30">
      {/* Hero Section - The AnimatedHero should now sit on a dark background */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <AnimatedHero />
      </div>

      {/* Social Proof Section - Cyberglass aesthetic */}
      <section className="py-12 px-4 bg-slate-900/30 backdrop-blur-md border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Worksheets Generated", val: "10,000+", color: "text-indigo-400" },
              { label: "Subjects Covered", val: "50+", color: "text-purple-400" },
              { label: "User Satisfaction", val: "95%", color: "text-cyan-400" },
            ].map((stat, i) => (
              <div key={i}>
                <div className={`text-4xl font-black ${stat.color} mb-2 drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>{stat.val}</div>
                <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
            <div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />)}
              </div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Top Rated AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section - Centered Focus */}
      <section className="py-20 px-4 relative" id="tool">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ToolTabs />
        </div>
      </section>

      {/* How It Works Section - Dark Gradient Cards */}
      <section className="py-24 px-4 bg-[#030712] relative overflow-hidden" id="how-it-works">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Three Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Total Mastery</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our neural network does the heavy lifting so you can focus on learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Describe", desc: "Enter your topic, grade level, and specific goals. Our AI parses natural language instructions perfectly.", border: "hover:border-indigo-500/50" },
              { num: "2", title: "Synthesize", desc: "Advanced LLMs process your request, generating age-appropriate and curriculum-aligned content in seconds.", border: "hover:border-purple-500/50" },
              { num: "3", title: "Deploy", desc: "Review, refine, and export. Get high-quality PDFs or digital practice modules instantly.", border: "hover:border-cyan-500/50" }
            ].map((step, i) => (
              <div key={i} className={`relative bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 transition-all duration-500 ${step.border} group`}>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-xl font-black text-indigo-400">{step.num}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO/Content Section - Cleaner Layout */}
      <section className="py-24 px-4 bg-[#020617]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
            Deep Dive
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight">
            What is an AI Worksheet Generator?
          </h2>
          <div className="prose prose-invert prose-indigo max-w-none text-slate-400">
            <p className="text-lg leading-relaxed mb-6">
              An <strong className="text-white">AI worksheet generator</strong> is a specialized neural engine designed to automate educational content creation. By leveraging Large Language Models, it eliminates the hours spent on manual formatting and question drafting.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Whether you are mapping out <strong className="text-indigo-300">complex calculus</strong> for college students or <strong className="text-purple-300">phonics exercises</strong> for primary school, our tool adapts the linguistic complexity and pedagogical approach to match your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Types - Minimalist Tech Cards */}
      <section className="py-24 px-4 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-white text-center tracking-tighter uppercase">Supported Disciplines</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🔢", title: "Mathematics", desc: "Algebra to Quantum Mechanics" },
              { icon: "📖", title: "Linguistics", desc: "Comprehension & Analysis" },
              { icon: "🔬", title: "Hard Sciences", desc: "Biology, Physics, Chemistry" },
              { icon: "✍️", title: "Humanities", desc: "Grammar & Creative Writing" },
              { icon: "🌍", title: "Geopolitics", desc: "History & Social Studies" },
              { icon: "📝", title: "Examination", desc: "Standardized Test Prep" }
            ].map((type, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{type.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{type.title}</h3>
                <p className="text-slate-500 text-xs font-medium">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Clean dark accordion style */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-white text-center">Protocol FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is the generator truly free?", a: "Yes. Our goal is to democratize education. No credit cards, no subscriptions—just pure AI utility." },
              { q: "What grade levels are covered?", a: "The AI supports the full academic spectrum, from Kindergarten foundations to Post-Graduate research topics." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-indigo-300 mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />

      {/* Schema Scripts remain unchanged but logic included */}
      <Script type="application/ld+json" id="ai-tools-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Worksheet Generator",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "url": "https://www.stillymathpro.com/ai-tools",
          "description": "Free AI worksheet generator for creating custom worksheets. Perfect for teachers and students.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "1247" }
        })}
      </Script>
    </main>
  );
}