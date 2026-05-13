// app/page.jsx (or page.tsx if using TypeScript)
export const metadata = {
  title: "StillyMathPro - Free Math Resources for Students, Teachers & Parents",
  description:
    "Access free math problems, worksheets, PDFs, and SAT math practice for students, teachers, and parents. Make learning math easier with high-quality resources.",
  keywords:
    "free math problems, math worksheets, SAT math practice, math PDFs, math resources for teachers, math resources for students, math help for parents",
  robots: "index, follow",
  canonical: "https://www.stillymathpro.com/",
  openGraph: {
    title: "StillwaterMathPro - Free Math Resources for Students, Teachers & Parents",
    description:
      "Explore free math problems, worksheets, SAT practice, and PDFs to help students, teachers, and parents succeed in math.",
    url: "https://www.stillymathpro.com/",
    type: "website",
  },
};


import OfferedServicesSection from '@/components/ServicesSection';
import ConsultationSection from '@/components/ConsultationSection';
import ServerRenderedHero from '@/components/hero-components/ServerRenderedHero';
import ServerHowItWorks from '@/components/how-it-works/ServerHowItWorks';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <ServerRenderedHero />
      <div className="px-4 max-w-full overflow-x-hidden">
        <ServerHowItWorks />
      </div>

      {/* Summer 2026 callout */}
      <div className="bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest mb-3">Summer 2026</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              Self-Guided Math Courses<br className="hidden sm:block" /> for CBE &amp; Homeschool
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
              Full semester courses in Algebra I, Geometry, and Algebra II — week-by-week guides,
              written lesson notes, problem sets, and printable worksheets.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-6 py-3 rounded-lg hover:bg-zinc-100 transition text-sm whitespace-nowrap"
          >
            View Courses →
          </Link>
        </div>
      </div>

      <div className="px-4 max-w-full overflow-x-hidden">
        <TestimonialCarousel />
      </div>
      <div className="px-4 max-w-full overflow-x-hidden">
        <ConsultationSection />
      </div>
    </main>
  );
}
