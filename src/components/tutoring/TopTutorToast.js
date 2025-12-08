'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function TutorToast({ lang = 'en' }) {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem("tutor_toast_shown");
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem("tutor_toast_shown", "true");
    }
  }, []);

  if (!show) return null;

  const messages = {
    en: "Worried about your child's progress? I offer 1-on-1 tutoring!",
    ko: "자녀 학습이 걱정되시나요? 1:1 튜터링을 제공합니다!"
  };

  const buttonText = {
    en: "Learn More",
    ko: "자세히 보기"
  };

  const notInterestedText = {
    en: "Not interested",
    ko: "관심 없음"
  };

  const interestedText = {
    en: "Interested?",
    ko: "관심 있으신가요?"
  };

  const hideText = {
    en: "Hide",
    ko: "닫기"
  };

  return (
    <div className="fixed top-4 z-50
                left-1/2 transform -translate-x-1/2
                sm:left-[calc(50%-1rem)] lg:left-[calc(50%-3rem)]
                w-[95%] sm:w-[400px] lg:w-[500px]
                bg-green-50 border border-green-300 rounded-xl shadow-md
                px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between
                text-green-900 text-xs sm:text-sm animate-fade-in-down relative">


      {/* Close X button */}
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-green-700 p-1 hover:bg-green-100 rounded-full"
        aria-label="Close toast"
      >
        <X size={14} />
      </button>

      {/* Main message */}
      <p className="flex-1 truncate font-medium mb-2 sm:mb-0 text-center sm:text-left">
        {messages[lang]}
      </p>

      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        {/* Dropdown toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-green-700 text-xs sm:text-sm font-medium"
        >
          {expanded ? hideText[lang] : interestedText[lang]}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Dropdown content */}
      {expanded && (
        <div className="mt-2 sm:mt-1 flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:justify-end">
          <Link
            href="/about"
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg
                       bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            {buttonText[lang]}
          </Link>

          <button
            onClick={() => setShow(false)}
            className="px-2 py-1 text-green-700 underline text-xs sm:text-sm"
          >
            {notInterestedText[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
