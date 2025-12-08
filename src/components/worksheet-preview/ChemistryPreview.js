// FILE: components/worksheet-preview/ChemistryPreview.jsx
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function ChemistryPreview({ courseTitle = "Chemistry", href }) {
  return (
    <Link href={href} className="group block">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-blue-500">
        <div className="aspect-[8.5/11] bg-white p-4 text-xs">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-2 mb-3">
            <div className="font-bold text-sm text-center">{courseTitle} Practice Worksheet</div>
            <div className="text-center text-gray-600 mt-1">Name: _______________ Date: _______</div>
          </div>

          {/* Chemistry Problems */}
          <div className="space-y-3">
            <div>
              <div className="font-semibold mb-1">1. Balance the equation:</div>
              <div className="ml-4 flex items-center gap-2">
                <span>__H<sub>2</sub> + __O<sub>2</sub></span>
                <span className="mx-1">→</span>
                <span>__H<sub>2</sub>O</span>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">2. Calculate molar mass:</div>
              <div className="ml-4">Ca(OH)<sub>2</sub></div>
              <div className="ml-4 text-gray-400 mt-1">_______ g/mol</div>
            </div>

            <div>
              <div className="font-semibold mb-1">3. Label the diagram:</div>
              <div className="ml-4 mt-2 border border-gray-300 rounded p-2 bg-gray-50">
                <svg viewBox="0 0 120 60" className="w-full h-12">
                  <circle cx="60" cy="30" r="8" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/>
                  <text x="60" y="34" textAnchor="middle" fontSize="6" fill="white">+</text>
                  <ellipse cx="60" cy="30" rx="20" ry="20" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                  <circle cx="80" cy="30" r="2" fill="#ef4444"/>
                  <ellipse cx="60" cy="30" rx="28" ry="14" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                  <circle cx="88" cy="30" r="2" fill="#ef4444"/>
                </svg>
                <div className="text-gray-400 text-xs mt-1">Nucleus: _____ Electrons: _____</div>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">4. Reaction type:</div>
              <div className="ml-4 flex items-center gap-2">
                <span>2Na + Cl<sub>2</sub></span>
                <span className="mx-1">→</span>
                <span>2NaCl</span>
              </div>
              <div className="ml-4 text-gray-400 mt-1">_____________</div>
            </div>

            <div className="text-gray-400 text-center mt-4">... 12 more problems</div>
          </div>

          <div className="absolute bottom-2 left-4 right-4 text-center text-gray-400 text-xs">
            Answer key included
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
            Browse Worksheets
          </span>
        </div>

        {/* PDF Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
          <span>PDF</span>
          <Download className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
