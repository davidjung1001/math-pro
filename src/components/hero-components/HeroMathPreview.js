// FILE: components/hero-components/HeroMathPreview.jsx
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function HeroMathPreview({ courseTitle = "Math", href, problemSet = 1 }) {
  // 8 simplified problems for format demonstration
  const mathProblems = [
    { num: 1, problem: "4x + 9 = 25", answer: "x = _______" },
    { num: 2, problem: "3(x - 2) = 15", answer: "x = _______" },
    { num: 3, problem: "5x - 8 = 7x + 4", answer: "x = _______" },
    { num: 4, problem: "Simplify: x² + 3x - 5x²", answer: "_____________" },
    { num: 5, problem: "Factor: x² - 4x + 4", answer: "_____________" },
    { num: 6, problem: "2/3 x = 10", answer: "x = _______" },
    { num: 7, problem: "Solve: -2(x + 5) > 8", answer: "_____________" },
    { num: 8, problem: "Evaluate: 4 + 5(2² - 1)", answer: "_____________" },
  ];

  // FIXED SMALL STYLES
  const baseTextClass = 'text-[10px] p-2';
  const headerPaddingClass = 'pb-1 mb-1';
  const headerTextClass = 'text-xs';
  const headerDateMarginClass = 'mt-0.5';
  const problemSpaceClass = 'space-y-1'; 
  const problemAnswerMarginClass = 'mt-0.5'; 
  const badgeTextClass = 'text-[9px] px-1.5 py-0.5';
  const badgeIconClass = 'w-2.5 h-2.5';
  const hoverTextClass = 'text-sm px-4 py-2 rounded-md';

  return (
    <Link href={href} className="group block h-full">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-blue-500 h-full">
        
        <div className={`aspect-[8.5/11] bg-white h-full ${baseTextClass}`}>
          
          {/* Header (Centered) */}
          <div className={`border-b-2 border-gray-800 ${headerPaddingClass}`}>
            <div className={`font-bold ${headerTextClass} text-center`}>{courseTitle} Practice Worksheet</div>
            <div className={`text-center text-gray-600 ${headerDateMarginClass}`}>Name: _______________ Date: _______</div>
          </div>

          {/* Math Problems - LEFT aligned */}
          <div className={`${problemSpaceClass} mt-1`}> 
            {mathProblems.map(p => (
              <div key={p.num}>
                {/* Problem line - uses pl-1 for slight indent */}
                <div className="font-semibold pl-1">{p.num}. {p.problem}</div>
                {/* Answer line - uses pl-4 for indentation under the problem text */}
                <div className={`text-gray-400 pl-4 ${problemAnswerMarginClass}`}>{p.answer}</div> 
              </div>
            ))}
            
            <div className="text-gray-400 text-center mt-2">... 8 more problems ...</div>
          </div>

          <div className="absolute bottom-1 left-2 right-2 text-center text-gray-400 text-[8px]">
            Answer key included
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
          <span className={`opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white shadow-lg ${hoverTextClass}`}>
            Browse Worksheets
          </span>
        </div>

        {/* PDF Badge */}
        <div className={`absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white font-bold rounded shadow-md ${badgeTextClass}`}>
          <span>PDF</span>
          <Download className={badgeIconClass} />
        </div>
      </div>
    </Link>
  );
}