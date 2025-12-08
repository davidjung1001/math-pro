// FILE: components/worksheet-preview/HeroChemistryPreview.jsx
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function HeroChemistryPreview({ courseTitle = "Chemistry", href }) {
  
  // FIXED SMALL STYLES
  const baseTextClass = 'text-[10px] p-2';
  const headerPaddingClass = 'pb-1 mb-2';
  const headerTextClass = 'text-xs';
  const headerDateMarginClass = 'mt-0.5';
  const problemSpaceClass = 'space-y-1.5';
  const problemMarginClass = 'ml-2';
  const problemAnswerMarginClass = 'mt-0.5';
  const badgeTextClass = 'text-[9px] px-1.5 py-0.5';
  const badgeIconClass = 'w-2.5 h-2.5';
  const hoverTextClass = 'text-sm px-4 py-2 rounded-md';

  return (
    <Link href={href} className="group block h-full">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-blue-500 h-full">
        
        {/* Use scaled base class */}
        <div className={`aspect-[8.5/11] bg-white h-full ${baseTextClass}`}>
          
          {/* Header (Scaled) */}
          <div className={`border-b-2 border-gray-800 ${headerPaddingClass}`}>
            <div className={`font-bold ${headerTextClass} text-center`}>{courseTitle} Practice Worksheet</div>
            <div className={`text-center text-gray-600 ${headerDateMarginClass}`}>Name: _______________ Date: _______</div>
          </div>

          {/* Chemistry Problems (Scaled Spacing) */}
          <div className={problemSpaceClass}>
            
            {/* Problem 1: Balance Equation */}
            <div>
              <div className="font-semibold mb-0.5">1. Balance the equation:</div>
              <div className={`${problemMarginClass} flex items-center gap-1`}>
                <span>__H<sub className="text-[8px]">2</sub> + __O<sub className="text-[8px]">2</sub></span>
                <span className="mx-0.5">→</span>
                <span>__H<sub className="text-[8px]">2</sub>O</span>
              </div>
            </div>

            {/* Problem 2: Molar Mass */}
            <div>
              <div className="font-semibold mb-0.5">2. Calculate molar mass:</div>
              <div className={problemMarginClass}>Ca(OH)<sub className="text-[8px]">2</sub></div>
              <div className={`${problemMarginClass} text-gray-400 ${problemAnswerMarginClass}`}>_______ g/mol</div>
            </div>

            {/* Problem 3: Label Diagram */}
            <div>
              <div className="font-semibold mb-0.5">3. Label the diagram:</div>
              <div className={`${problemMarginClass} mt-1 border border-gray-300 rounded p-1 bg-gray-50`}>
                {/* SVG for atom diagram remains the same, adjusted for small text/padding */}
                <svg viewBox="0 0 120 60" className="w-full h-8">
                  <circle cx="60" cy="30" r="8" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/>
                  <text x="60" y="34" textAnchor="middle" fontSize="6" fill="white">+</text>
                  <ellipse cx="60" cy="30" rx="20" ry="20" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                  <circle cx="80" cy="30" r="2" fill="#ef4444"/>
                  <ellipse cx="60" cy="30" rx="28" ry="14" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                  <circle cx="88" cy="30" r="2" fill="#ef4444"/>
                </svg>
                <div className="text-gray-400 text-[7px] mt-0.5">Nucleus: _____ Electrons: _____</div>
              </div>
            </div>

            {/* Problem 4: Reaction Type */}
            <div>
              <div className="font-semibold mb-0.5">4. Reaction type:</div>
              <div className={`${problemMarginClass} flex items-center gap-1`}>
                <span>2Na + Cl<sub className="text-[8px]">2</sub></span>
                <span className="mx-0.5">→</span>
                <span>2NaCl</span>
              </div>
              <div className={`${problemMarginClass} text-gray-400 ${problemAnswerMarginClass}`}>_____________</div>
            </div>

            <div className="text-gray-400 text-center mt-3">... 12 more problems</div>
          </div>

          <div className="absolute bottom-1 left-2 right-2 text-center text-gray-400 text-[8px]">
            Answer key included
          </div>
        </div>

        {/* Hover Overlay (Scaled) */}
        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
          <span className={`opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white shadow-lg ${hoverTextClass}`}>
            Browse Worksheets
          </span>
        </div>

        {/* PDF Badge (Scaled) */}
        <div className={`absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white font-bold rounded shadow-md ${badgeTextClass}`}>
          <span>PDF</span>
          <Download className={badgeIconClass} />
        </div>
      </div>
    </Link>
  );
}