'use client';

import { useState } from "react";
import WorksheetTab from "@/components/ai-tools/WorksheetTab";
import { Sparkles, Zap, Target, ShieldCheck } from "lucide-react";

export default function ToolTabs({ user }) {
  // Keeping state for future expansion (e.g., Quiz, Flashcards)
  const [activeTab] = useState("Worksheet");

  return (
    <div className="w-full pb-20" id="tool">
      {/* HERO SECTION 
         Increased padding-bottom (pb-32) to allow the tool to overlap 
      */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 rounded-[2.5rem] p-8 md:p-16 pb-32 md:pb-40 shadow-2xl">
        
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-xs md:text-sm font-semibold text-white tracking-wide uppercase">
              No Sign-up Required
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Transform Topics into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-300">
              Pro Worksheets
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate AI assistant for educators. Create study guides, practice tests, and lesson materials in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-white/70">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-green-400" /> Private & Secure
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-400" /> Lightning Fast
            </div>
          </div>
        </div>
      </div>

      {/* GENERATOR SECTION 
         The negative margin (-mt-24) makes it "float" over the hero
      */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-2 md:p-4">
          <div className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-6 md:p-10">
             {/* This is where your actual tool logic lives */}
             <WorksheetTab user={user} />
          </div>
        </div>
        
        {/* Subtle Trust Badge under the tool */}
        <p className="text-center mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
           Trusted by 2,000+ Teachers Monthly <span className="w-1 h-1 bg-gray-300 rounded-full"/> Completely Free
        </p>
      </div>
    </div>
  );
}