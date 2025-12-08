"use client";

import MathPreview from "@/components/worksheet-preview/MathPreview";
import ChemistryPreview from "@/components/worksheet-preview/ChemistryPreview";
import AIWorksheetGenerator from "@/components/AIWorksheetGenerator";

export default function ClientHowItWorks() {
  return (
    <>
      {/* === TOP: THREE PREVIEWS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center px-4 sm:px-0">
        
        {/* Responsive wrapper: shrink on mobile, max width on larger screens */}
        <div className="w-full max-w-[260px] h-auto">
          <MathPreview href="/worksheets/free-worksheets" problemSet={1} />
        </div>

        <div className="w-full max-w-[260px] h-auto">
          <ChemistryPreview href="/worksheets/free-worksheets/chemistry" />
        </div>

        <div className="w-full max-w-[260px] h-auto">
          <MathPreview href="/worksheets/free-worksheets" problemSet={2} />
        </div>

      </div>

      {/* === BOTTOM: AI GENERATOR === */}
      <div className="mt-16 flex justify-center px-4 sm:px-0">
        <div className="bg-white border shadow-xl rounded-2xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-center mb-4">
            Generate Worksheets Instantly
          </h3>

          <AIWorksheetGenerator />
        </div>
      </div>
    </>
  );
}
