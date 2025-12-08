// FILE: components/worksheet-preview/MathPreview.jsx
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function MathPreview({ courseTitle = "Math", href, problemSet = 1 }) {
  const mathProblems = problemSet === 1 ? [
    { num: 1, question: "Solve for x:", problem: "2x + 5 = 13", answer: "x = _______" },
    { num: 2, question: "Simplify:", problem: "3(x + 4) - 2x", answer: "_____________" },
    { num: 3, question: "Evaluate:", problem: "√64 + 3²", answer: "_____________" },
    { num: 4, question: "Factor:", problem: "x² - 9", answer: "_____________" },
  ] : [
    { num: 1, question: "Calculate:", problem: "(5 + 3) × 2 - 4", answer: "_____________" },
    { num: 2, question: "Solve:", problem: "4x - 7 = 21", answer: "x = _______" },
    { num: 3, question: "Simplify:", problem: "2x² + 3x² - x²", answer: "_____________" },
    { num: 4, question: "Find the area:", problem: "Rectangle: l = 8, w = 5", answer: "A = _______" },
  ];

  return (
    <Link href={href} className="group block">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-blue-500">
        <div className="aspect-[8.5/11] bg-white p-4 text-xs">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-2 mb-3">
            <div className="font-bold text-sm text-center">{courseTitle} Practice Worksheet</div>
            <div className="text-center text-gray-600 mt-1">Name: _______________ Date: _______</div>
          </div>

          {/* Math Problems */}
          <div className="space-y-3">
            {mathProblems.map(p => (
              <div key={p.num}>
                <div className="font-semibold mb-1">{p.num}. {p.question}</div>
                <div className="ml-4">{p.problem}</div>
                <div className="ml-4 text-gray-400 mt-1">{p.answer}</div>
              </div>
            ))}
            <div className="text-gray-400 text-center mt-4">... 16 more problems</div>
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
