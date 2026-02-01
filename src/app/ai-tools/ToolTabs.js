'use client';

import { useState } from "react";
import WorksheetTab from "@/components/ai-tools/WorksheetTab";
import { Sparkles, Zap, Target } from "lucide-react";

export default function ToolTabs({ user }) {
  const [activeTab] = useState("Worksheet");

  return (
    <div className="w-full" id="tool">
      {/* Hero Section with Visual Interest */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 rounded-3xl mb-8 p-8 md:p-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Create Perfect Worksheets
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate custom practice questions, study guides, and educational materials tailored to any topic or difficulty level
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">Instant Generation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white font-medium">Custom Difficulty</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white font-medium">AI-Powered</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/90">
            <div>
              <div className="text-3xl font-bold text-white">10,000+</div>
              <div className="text-sm text-purple-200">Worksheets Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-purple-200">Subjects Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-purple-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Section with Better Visual Hierarchy */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Generate Your Worksheet
          </h2>
          <p className="text-gray-600">
            Describe what you need and let AI create a customized worksheet for you
          </p>
        </div>

        <WorksheetTab user={user} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}