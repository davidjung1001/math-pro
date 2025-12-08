// FILE: components/HeroSection.jsx
'use client';

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

// IMPORT THE NEW, SMALL COMPONENTS FROM THE DEDICATED DIRECTORY
import HeroMathPreview from "../components/hero-components/HeroMathPreview";
import HeroChemistryPreview from "../components/hero-components/HeroChemistryPreview";
import HeroAIGeneratorMini from "../components/hero-components/HeroAIGeneratorMini";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header integrated at the top */}
      <Header />
      
      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center text-center text-gray-900 overflow-hidden pt-8 pb-16 md:pb-20 px-6">
        <motion.div
          className="relative max-w-4xl mx-auto w-full z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Free Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% Free Math Resources
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Free Worksheets 
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Download & Print
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-4 max-w-2xl mx-auto text-gray-700 leading-relaxed font-medium">
            Everything you need to teach
          </p>
          
          <p className="text-base sm:text-lg mb-14 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Digital learning modules, printable worksheets, and personalized diagnostics — all completely free, designed to help students truly understand math concepts.
          </p>

          {/* Hero Cards */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

            {/* Worksheets Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="group cursor-pointer p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-400 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100"
              onClick={() => router.push("/worksheets/free-worksheets")}
            >
              <div className="absolute top-3 right-3 bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
                Free
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Printable Worksheets</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Practice materials you can download and use offline
              </p>

              {/* Stack of previews with slanted text */}
              <div className="relative h-64 flex justify-center items-center">
                
                {/* Chemistry Preview - Slanted with text */}
                <div className="absolute w-[180px] h-[250px] shadow-xl transform rotate-3 -translate-y-4 translate-x-12 z-0">
                  <div className="transform rotate-3">
                    <HeroChemistryPreview courseTitle="Chemistry" href="/worksheets/chemistry" />
                  </div>
                </div>
                
                {/* Math Preview - Slanted with text */}
                <div className="absolute w-[180px] h-[250px] shadow-2xl transform -rotate-3 translate-y-4 -translate-x-12 z-10">
                  <div className="transform -rotate-3">
                    <HeroMathPreview courseTitle="Math" href="/worksheets/math" />
                  </div>
                </div>
              </div>

              <span className="font-semibold text-sm text-purple-600 group-hover:text-purple-700 inline-flex items-center gap-1 mt-4">
                Browse Worksheets →
              </span>
            </motion.div>

            {/* AI Generator Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="group cursor-pointer p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100"
              onClick={() => router.push("/ai-tools")}
            >
              <div className="absolute top-3 right-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Free
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Worksheet Generator</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Generate custom worksheets instantly
              </p>

              <div className="h-64">
                <HeroAIGeneratorMini />
              </div>

              <span className="font-semibold text-sm text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1 mt-4">
                Try AI Generator →
              </span>
            </motion.div>

            {/* Diagnostic Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="group cursor-pointer p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100"
              onClick={() => router.push("/diagnostic")}
            >
              <div className="absolute top-3 right-3 bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Free
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Diagnostic Test</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Identify knowledge gaps and get a personalized learning path
              </p>

              <div className="h-64 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-md w-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-emerald-600">72%</span>
                  <span className="text-sm text-gray-500 mt-2">Avg Score</span>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-emerald-500 h-2 w-[72%] rounded-full transition-all"></div>
                  </div>
                </div>
              </div>

              <span className="font-semibold text-sm text-emerald-600 group-hover:text-emerald-700 inline-flex items-center gap-1 mt-4">
                Take Test →
              </span>
            </motion.div>

          </div>

          {/* For Tutors CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">For Tutors</h3>
            </div>
            <p className="text-gray-700 mb-4 text-sm">
              Turn your tutoring side hustle into an official business with our complete platform
            </p>
            <button 
              onClick={() => window.open("https://tutor-terminal.vercel.app", "_blank")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
            >
              Learn More →
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-gray-600"
          >
            <p className="text-sm mb-2 font-semibold">Built by Math Experts</p>
            <p className="text-xs text-gray-500">Designed to help students truly understand — not just memorize</p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#roadmap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex flex-col items-center cursor-pointer z-20 text-indigo-500 hover:text-indigo-600 transition"
        >
          <svg
            className="w-6 h-6 mb-1 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7"></path>
          </svg>
          <span className="font-medium text-xs">Learn More</span>
        </motion.a>
      </div>
    </section>
  );
}