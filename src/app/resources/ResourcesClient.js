'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, Calculator, FileText, TrendingUp } from 'lucide-react';

export default function ResourcesClient() {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      {/* Back Arrow */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-4xl font-bold text-center mb-6">
        SAT, PSAT & Math Subject Guide
      </h1>

      {/* SAT Section */}
      <section className="bg-white rounded-2xl shadow p-6 border">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp className="text-blue-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold">What is the SAT?</h2>
        </div>
        <p className="text-gray-700">
          The SAT is a standardized test used for college admissions, with a Math section scored out of <strong>800 points</strong>. It includes:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Heart of Algebra</li>
          <li>Problem Solving & Data Analysis</li>
          <li>Passport to Advanced Math</li>
          <li>Additional Topics in Math</li>
        </ul>
        <p className="text-gray-700 mt-4">
          Score ranges for the Math section:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>300–450:</strong> Foundational level</li>
          <li><strong>450–600:</strong> Developing proficiency</li>
          <li><strong>600–800:</strong> Advanced performance</li>
        </ul>
      </section>

      {/* PSAT Section */}
      <section className="bg-white rounded-2xl shadow p-6 border">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="text-purple-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold">Understanding the PSAT</h2>
        </div>
        <p className="text-gray-700">
          The PSAT (Preliminary SAT) is often misunderstood as just practice. However, it serves as the <strong>qualifying exam for the National Merit Scholarship Program</strong>.
        </p>
        <p className="text-gray-700 mt-2">
          While the format and content are similar to the SAT, high performance on the PSAT can lead to recognition, scholarships, and opportunities from top colleges.
        </p>
      </section>

      {/* Math Subjects */}
      <section className="bg-white rounded-2xl shadow p-6 border">
        <div className="flex items-center gap-4 mb-4">
          <Calculator className="text-green-600 w-8 h-8" />
          <h2 className="text-2xl font-semibold">Math Subjects Overview</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Algebra I & II</li>
          <li>Geometry & Trigonometry</li>
          <li>Precalculus</li>
          <li>AP Calculus AB</li>
          <li>Integrated Math I–III</li>
        </ul>
        <p className="text-gray-700 mt-2">
          These topics build the foundation of both classroom math and standardized tests like the SAT and PSAT.
        </p>
      </section>
    </main>
  );
}
