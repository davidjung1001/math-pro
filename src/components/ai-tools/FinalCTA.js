'use client';

import { Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Ready to Create Your First Worksheet?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          Join thousands of teachers and students using AI to create better educational materials
        </p>
        <a 
          href="#tool" 
          className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-900 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
        >
          <Sparkles className="w-6 h-6" />
          Start Generating Free Worksheets
        </a>
      </div>
    </section>
  );
}