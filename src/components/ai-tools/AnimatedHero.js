import { CheckCircle, Zap } from "lucide-react";

export default function AnimatedHero() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          Free AI Tool
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
          AI Worksheet Generator
          <span className="block mt-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Free & Instant
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Create custom worksheets, lesson plans, and study materials in seconds. Perfect for teachers and students.{" "}
          <span className="font-semibold text-gray-800">No sign-up required.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            href="#tool"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold text-base hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Generate Worksheet Now
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-700 rounded-lg font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          {["100% Free Forever", "No Login Required", "Unlimited Worksheets", "Ready in Seconds"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}