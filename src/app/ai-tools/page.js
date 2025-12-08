import ToolTabs from "@/app/ai-tools/ToolTabs";
import Script from "next/script";

export const metadata = {
  title: "AI Worksheet Generator – Lesson Plans, Worksheets & Study Materials",
  description:
    "Generate worksheets, lesson plans, notecards, and study summaries with AI. Perfect for teachers and students looking to enhance learning.",
  keywords: [
    "AI worksheet generator",
    "AI lesson plans",
    "printable worksheets",
    "study materials",
    "educational tools",
    "AI study resources",
    "student worksheets",
    "teacher worksheets"
  ],
  robots: "index, follow",
  openGraph: {
    title: "AI Worksheet Generator – Smart Study Hub",
    description:
      "Create lesson plans, worksheets, notecards, and summaries with AI. Ideal for students and educators.",
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
    <main className="bg-gray-50 min-h-screen py-16 px-4 flex flex-col items-center">
      {/* Main Heading for SEO */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        AI Worksheet Generator
      </h1>

      {/* Subheading for context */}
      <h2 className="text-lg md:text-xl text-center text-gray-700 max-w-2xl mb-12">
        Gernate power worksheets that you need, perfectly formatted and ready for use.
      </h2>

      {/* Interactive tool tabs */}
      <ToolTabs />

      {/* Structured data for search engines */}
      <Script type="application/ld+json" id="ai-tools-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalApplication",
          "name": "Smart Study Hub AI Tools",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "url": "https://yourdomain.com/ai-tools",
          "description":
            "Generate worksheets, lesson plans, notecards, and study summaries with AI. Perfect for students and teachers.",
        })}
      </Script>
    </main>
  );
}
