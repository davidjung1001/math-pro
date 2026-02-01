'use client';

import { Sparkles, Zap, CheckCircle } from "lucide-react";

export default function AnimatedHero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20 px-4 overflow-hidden">
      {/* Animated background - using Tailwind animate-pulse with custom delays */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div 
          className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" 
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-20 left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" 
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-semibold">AI-Powered Worksheet Creation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          AI Worksheet Generator
          <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Free & Instant
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
          Create custom worksheets, lesson plans, and study materials in seconds. Perfect for teachers and students. <strong>No sign-up required.</strong>
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href="#tool" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            Generate Worksheet Now
          </a>
          <a 
            href="#how-it-works" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
          >
            See How It Works
          </a>
        </div>

        {/* Trust Indicators - Key benefits */}
        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-300" />
            100% Free Forever
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-300" />
            No Login Required
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-300" />
            Unlimited Worksheets
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-300" />
            10-30 Second Generation
          </span>
        </div>
      </div>
    </section>
  );
}