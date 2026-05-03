import { Zap } from "lucide-react";

export default function AnimatedHero() {
  return (
    <section className="bg-white border-b border-gray-100 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-3 py-1.5 border border-black text-black mb-6">
          Free AI Tool
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-5 leading-[1.02] tracking-tight">
          AI Worksheet<br />Generator
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-xl mb-8 leading-relaxed">
          Create custom worksheets, lesson plans, and study materials in seconds.{" "}
          <span className="font-semibold text-black">No sign-up required.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#tool"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-black text-white font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate Worksheet
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border-2 border-black text-black font-bold text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}