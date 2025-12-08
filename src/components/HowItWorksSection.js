// FILE: components/HowItWorks.jsx
"use client";

import MathPreview from "@/components/worksheet-preview/MathPreview";
import ChemistryPreview from "@/components/worksheet-preview/ChemistryPreview";
import AIWorksheetGenerator from "@/components/AIWorksheetGenerator";

export default function HowItWorks() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Worksheet Preview
        </h2>

        {/* === TOP: THREE PREVIEWS === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">

          {/* Standardized wrapper: SAME size for all */}
          <div className="w-[260px] h-auto">
            <MathPreview href="/worksheets/free-worksheets" problemSet={1} />
          </div>

          <div className="w-[260px] h-auto">
            <ChemistryPreview href="/worksheets/free-worksheets/chemistry" />
          </div>

          <div className="w-[260px] h-auto">
            <MathPreview href="/worksheets/free-worksheets" problemSet={2} />
          </div>

        </div>

        {/* === BOTTOM: AI GENERATOR === */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white border shadow-xl rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-center mb-4">
              Generate Worksheets Instantly
            </h3>

            <AIWorksheetGenerator />
          </div>
        </div>

      </div>
    </section>
  );
}
