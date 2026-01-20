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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <ServerRenderedHero />
      <div className="px-4 max-w-full overflow-x-hidden">
        <ServerHowItWorks />
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
