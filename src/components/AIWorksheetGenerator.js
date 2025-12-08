'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ProblemSet = [
  { id: 1, title: 'Solve for x:', equation: "x² - 5x + 6 = 0", answer: "x = _______" },
  { id: 2, title: 'Find the vertex:', equation: "f(x) = x² + 4x - 5", answer: "Vertex: (___, ___)" },
  { id: 3, title: 'Complete the square:', equation: "x² + 6x + ____ = (x + ___)²", answer: "Answer: _____________" },
  { id: 4, title: 'Use the quadratic formula:', equation: "2x² - x - 3 = 0", answer: "x = _______" },
  { id: 5, title: 'Discriminant value:', equation: "3x² + 2x + 1 = 0", answer: "D = _______" },
];

export default function AIWorksheetPreview() {
  const fullTopic = 'Quadratic Equations';
  const fullNumber = '15';

  const [typedTopic, setTypedTopic] = useState('');
  const [typedNumber, setTypedNumber] = useState('');
  const [showProblems, setShowProblems] = useState(false);
  const [generatedProblemCount, setGeneratedProblemCount] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);

  useEffect(() => {
    let topicInterval, numberInterval, problemInterval;

    const runAnimation = () => {
      setTypedTopic('');
      setTypedNumber('');
      setShowProblems(false);
      setGeneratedProblemCount(0);
      setGenerationComplete(false);

      let topicIndex = 0;
      topicInterval = setInterval(() => {
        if (topicIndex <= fullTopic.length) {
          setTypedTopic(fullTopic.slice(0, topicIndex));
          topicIndex++;
        } else {
          clearInterval(topicInterval);
          startNumberTyping();
        }
      }, 70);

      const startNumberTyping = () => {
        let numberIndex = 0;
        numberInterval = setInterval(() => {
          if (numberIndex <= fullNumber.length) {
            setTypedNumber(fullNumber.slice(0, numberIndex));
            numberIndex++;
          } else {
            clearInterval(numberInterval);
            setTimeout(startProblemGeneration, 500);
          }
        }, 120);
      };

      const startProblemGeneration = () => {
        setShowProblems(true);
        let count = 0;
        problemInterval = setInterval(() => {
          if (count < ProblemSet.length) {
            setGeneratedProblemCount(prev => prev + 1);
            count++;
          } else {
            clearInterval(problemInterval);
            setTimeout(() => {
              setGenerationComplete(true);
              setTimeout(runAnimation, 2000);
            }, 800);
          }
        }, 350);
      };
    };

    runAnimation();

    return () => {
      clearInterval(topicInterval);
      clearInterval(numberInterval);
      clearInterval(problemInterval);
    };
  }, []);

  return (
    <Link href="/ai-tools" className="group block relative w-full max-w-3xl mx-auto">
      <div className="relative bg-white border-2 border-gray-300 rounded-xl shadow-2xl transition-all overflow-hidden hover:shadow-purple-400/50 hover:border-purple-500 cursor-pointer h-[600px] flex flex-col">
        <div className="bg-white p-3 sm:p-6 text-sm flex flex-col h-full">

          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-2 mb-3 flex-shrink-0">
            <div className="font-bold text-xl text-center text-gray-800">AI Worksheet Generator</div>
          </div>

          {/* AI Input Section */}
          <div className="mb-3 flex-shrink-0 h-32">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-2 sm:p-4 rounded-lg border-2 border-purple-200 shadow-inner h-full flex flex-col justify-center space-y-2">
              

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 text-sm font-medium w-full sm:w-20 flex-shrink-0">Topic:</span>
                  <div className="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-base shadow-sm h-8 flex items-center overflow-hidden w-full max-w-full">
                    <span className="text-gray-900 font-mono truncate">{typedTopic}</span>
                    {typedTopic.length < fullTopic.length && <span className="animate-pulse text-purple-500 font-bold ml-0.5">|</span>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 text-sm font-medium w-full sm:w-20 flex-shrink-0">Questions:</span>
                  <div className="bg-white border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-base shadow-sm h-8 flex items-center w-full max-w-[4rem] sm:max-w-full">
                    <span className="text-gray-900 font-mono truncate">{typedNumber}</span>
                    {typedNumber.length < fullNumber.length && typedNumber.length > 0 && <span className="animate-pulse text-purple-500 font-bold ml-0.5">|</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative overflow-hidden">
            <div className="h-full p-2 sm:p-3 rounded-lg bg-gray-50 border border-gray-200 relative">
              <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-2 text-xs font-medium">
                <span className="text-gray-600">Name: <span className="font-semibold text-gray-800">_______________</span></span>
                <span className="text-gray-600">Date: <span className="font-semibold text-gray-800">_______</span></span>
              </div>

              <h3 className="font-bold text-sm sm:text-md text-gray-700 mb-2">Problems:</h3>

              <div className="space-y-1 overflow-y-auto h-full">
                {showProblems ? (
                  <>
                    {ProblemSet.slice(0, generatedProblemCount).map((problem) => (
                      <div key={problem.id} className="space-y-1 text-xs sm:text-sm font-mono bg-white p-2 rounded border border-gray-200">
                        <div className="font-semibold">{problem.id}. {problem.title}</div>
                        <div className="ml-2 sm:ml-4">{problem.equation}</div>
                        <div className="ml-2 sm:ml-4 text-gray-400">{problem.answer}</div>
                      </div>
                    ))}
                    {generatedProblemCount === ProblemSet.length && !generationComplete && (
                      <div className="text-gray-500 italic text-center mt-2 text-xs">...more problems generating</div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400 italic mt-2 text-xs">Generating Printable Worksheet...</div>
                )}
              </div>

              {showProblems && generatedProblemCount >= 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm py-2 mt-2 flex-shrink-0 bg-gray-50 rounded-lg">
            {generationComplete ? (
              <span className="text-green-600 text-sm sm:text-base">✅ Generation Complete! (15 Problems)</span>
            ) : (
              <>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">Generating problem {generatedProblemCount + 1} of 15...</span>
              </>
            )}
          </div>

          <div className="text-center text-purple-600 text-xs font-semibold pt-1 sm:pt-2 border-t border-purple-100 flex-shrink-0">
            ✨ Powered by AI • Instant PDF Generation
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-purple-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center pointer-events-none rounded-xl">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg shadow-xl shadow-purple-500/50">
            Try AI Generator →
          </span>
        </div>
      </div>
    </Link>
  );
}
