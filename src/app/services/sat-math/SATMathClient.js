'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Target,
  FileBarChart,
  Sparkle,
} from 'lucide-react';

export default function SatMathClient() {
  const router = useRouter();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 transition mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Services
      </button>

      <div className="relative bg-white p-6 rounded-2xl shadow-md border">
        <h1 className="text-4xl font-bold mb-2">SAT Math Expertise</h1>
        <p className="text-gray-600 text-lg">
          Personalized strategies for top scores.
        </p>

        {/* Floating 700+ badge */}
        <div className="absolute top-6 right-6 bg-yellow-400 text-black px-3 py-1 text-sm font-bold rounded-full shadow flex items-center">
          <Sparkle className="w-4 h-4 mr-1" /> 700+
        </div>
      </div>

      {/* Section 1 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <FileBarChart className="text-blue-500 w-8 h-8" />
        <div>
          <h2 className="text-xl font-semibold mb-1">Structured by SAT Domains</h2>
          <p className="text-gray-700">
            We break the test into Heart of Algebra, Problem Solving & Data Analysis,
            Passport to Advanced Math, and Additional Topics to ensure full mastery.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <BarChart3 className="text-purple-500 w-8 h-8" />
        <div>
          <h2 className="text-xl font-semibold mb-1">Diagnostic-Driven Learning</h2>
          <p className="text-gray-700">
            After a diagnostic test, we target weaknesses with precision. It’s common to
            see <strong>100+ point increases</strong> after focusing on one key area.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <CheckCircle className="text-green-500 w-8 h-8" />
        <div>
          <h2 className="text-xl font-semibold mb-1">Mastery by Difficulty</h2>
          <p className="text-gray-700">
            Problems are grouped by difficulty (1–3) so students build from foundational
            skills to advanced challenges with clarity and confidence.
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <Target className="text-red-500 w-8 h-8" />
        <div>
          <h2 className="text-xl font-semibold mb-1">Custom-Fit for Your Goals</h2>
          <p className="text-gray-700">
            Whether aiming for an Ivy League score or just meeting a school requirement,
            we tailor your path to success.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-700 transition"
        >
          Schedule a Free Consultation
        </Link>
      </div>
    </main>
  );
}
