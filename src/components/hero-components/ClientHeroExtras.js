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

       {/* AI Generator Preview Card */}
        <Link href="/ai-tools" passHref>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="group cursor-pointer p-6 rounded-2xl border-2 border-cyan-400 hover:border-cyan-300 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 h-[480px] flex flex-col justify-between"
          >
            <div className="absolute top-3 right-3 bg-cyan-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Hot
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">🤖 AI Generator</h3>
            <p className="text-cyan-100 text-sm mb-4 leading-relaxed">
              Transform your ideas into reality with cutting-edge AI tools and generators
            </p>

            <div className="bg-gray-950 rounded-xl flex flex-col gap-3 p-4 h-40 shadow-md relative overflow-hidden border border-cyan-500/30">
              {/* Animated typing effect - Question */}
              <motion.div
                className="text-xs text-cyan-400 font-mono flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-purple-400">Prompt:</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  Generate worksheet...
                </motion.span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-cyan-400"
                >
                  |
                </motion.span>
              </motion.div>

              {/* Generating animation */}
              <motion.div className="flex-1 bg-gray-900 rounded-lg p-3 border border-cyan-500/20 relative overflow-hidden">
                {/* Worksheet lines appearing */}
                <motion.div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      transition={{
                        delay: 0.5 + i * 0.3,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  ))}
                </motion.div>

                {/* AI processing indicator */}
                <motion.div
                  className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-cyan-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>

                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </div>

            <span className="font-semibold text-sm text-cyan-400 group-hover:text-cyan-300 inline-flex items-center gap-1 mt-4">
              Explore AI Tools →
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
