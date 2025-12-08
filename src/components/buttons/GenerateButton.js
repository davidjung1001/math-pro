"use client";

import { Sparkles } from "lucide-react";

export default function GenerateButton({ activeTab, loading, onClick }) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg flex items-center gap-3
          ${loading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-xl"
          }`}
      >
        <Sparkles className={`w-6 h-6 ${loading ? "" : "animate-pulse"}`} />
        {loading ? "Generating..." : `Generate ${activeTab}`}
      </button>
    </div>
  );
}