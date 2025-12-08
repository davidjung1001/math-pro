'use client';
import React, { useEffect, useState } from 'react';

const MathProblems = [
  "1. Solve for x: 2x + 5 = 13",
  "2. Find the slope: y = 3x - 7",
  "3. Factor: x² - 9x + 20",
  "4. Simplify: (2x³)(4x²)",
  "5. Solve: 3(x - 2) = 15"
];

export default function HeroAIGeneratorMini() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [completedProblems, setCompletedProblems] = useState([]);

  useEffect(() => {
    const fullText = MathProblems[currentProblemIndex];
    
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCompletedProblems(prev => [...prev, fullText]);
        setTypedText('');
        
        if (currentProblemIndex < MathProblems.length - 1) {
          setCurrentProblemIndex(prev => prev + 1);
        } else {
          setTimeout(() => {
            setCompletedProblems([]);
            setCurrentProblemIndex(0);
          }, 1500);
        }
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [typedText, currentProblemIndex]);

  return (
    <div className="flex items-center justify-center w-full h-full p-2">
      {/* Paper Sheet */}
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-300 p-4 relative overflow-hidden flex flex-col"
        style={{
          width: '200px',
          aspectRatio: '8.5 / 11',
          maxHeight: '240px'
        }}
      >
        {/* Paper Lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 23px,
              #cbd5e1 23px,
              #cbd5e1 24px
            )`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="text-center text-xs font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-800">
            Math Worksheet
          </div>

          <div className="space-y-2 text-[10px] font-mono">
            {/* Completed Problems */}
            {completedProblems.map((problem, idx) => (
              <div key={idx} className="text-gray-700">
                {problem}
              </div>
            ))}

            {/* Currently Typing */}
            {currentProblemIndex < MathProblems.length && (
              <div className="text-gray-900 font-semibold">
                {typedText}
                <span className="inline-block w-[2px] h-3 bg-blue-500 ml-0.5 animate-pulse"></span>
              </div>
            )}
          </div>
        </div>

        {/* AI Badge */}
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold">
          AI
        </div>
      </div>
    </div>
  );
}
