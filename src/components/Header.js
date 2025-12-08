'use client';

import { useRouter } from 'next/navigation';

export default function MainHeader() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center max-w-6xl mx-auto pt-8 px-6 mb-8">
      <div
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => router.push('/')}
      >
        StillyMathPro
      </div>
      <nav className="hidden sm:flex items-center space-x-6 text-gray-700 font-medium">
        <button
          onClick={() => router.push('/courses')}
          className="hover:text-indigo-600 transition"
        >
          Courses
        </button>
        <button
          onClick={() => router.push('/worksheets/free-worksheets')}
          className="hover:text-indigo-600 transition"
        >
          Worksheets
        </button>
        <button
          onClick={() => router.push('/ai-tools')}
          className="hover:text-indigo-600 transition"
        >
          AI Generator
        </button>
      </nav>
    </div>
  );
}
