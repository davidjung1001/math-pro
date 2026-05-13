'use client';

import { motion } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Adjust path if needed
import HeroMathPreview from "../hero-components/HeroMathPreview"; 
import HeroChemistryPreview from "../hero-components/HeroChemistryPreview"; 

export default function ClientHeroExtras() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="w-full overflow-x-hidden"
    >
      {/* Hero Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full sm:max-w-5xl mx-auto mb-16 px-4">

        {/* Worksheets Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          className="group cursor-pointer p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-400 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 h-[480px] flex flex-col justify-between"
          onClick={() => router.push("/worksheets/free-worksheets")}
        >
          <div className="absolute top-3 right-3 bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
            Free
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Printable Worksheets</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Practice materials you can download and use offline
          </p>

          <div className="relative h-64 flex justify-center items-center overflow-hidden">
            <div className="absolute w-36 h-52 sm:w-[180px] sm:h-[250px] shadow-xl transform rotate-3 sm:-translate-y-4 translate-x-4 sm:translate-x-12 z-0">
              <HeroChemistryPreview courseTitle="Chemistry" href="/worksheets/free-worksheets/chemistry" />
            </div>
            <div className="absolute w-36 h-52 sm:w-[180px] sm:h-[250px] shadow-2xl transform -rotate-3 sm:translate-y-4 -translate-x-4 sm:-translate-x-12 z-10">
              <HeroMathPreview courseTitle="Math" href="/worksheets/free-worksheets" />
            </div>
          </div>

          <span className="font-semibold text-sm text-purple-600 group-hover:text-purple-700 inline-flex items-center gap-1 mt-4">
            Browse Worksheets →
          </span>
        </motion.div>

        {/* Self-Guided Course Card */}
        <Link href="/courses" passHref>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="group cursor-pointer p-6 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 h-[480px] flex flex-col justify-between"
          >
            <div className="absolute top-3 right-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              New
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Self-Guided Courses</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Full semester courses for CBE and homeschool learners — written notes, weekly problem sets, and printable worksheets.
            </p>

            <div className="bg-white rounded-xl p-5 shadow-md flex flex-col gap-2.5">
              {['Algebra I', 'Geometry', 'Algebra II'].map((title, i) => (
                <div key={title} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-indigo-400 w-4">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-gray-800">{title}</span>
                  </div>
                  <span className="text-xs text-gray-400">10 weeks</span>
                </div>
              ))}
            </div>

            <span className="font-semibold text-sm text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1 mt-4">
              Browse Courses →
            </span>
          </motion.div>
        </Link>

      </div>

      {/* For Parents CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-bold text-gray-900">For Parents</h3>
        </div>
        <p className="text-gray-700 mb-4 text-sm">
          Find the best tutoring resources and guidance to help your child succeed
        </p>
        <Link href="/about" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 inline-block text-center">
          Learn More →
        </Link>
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
    </motion.div>
  );
}
