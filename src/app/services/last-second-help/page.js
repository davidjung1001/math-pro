"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft, FaClock, FaBolt } from "react-icons/fa";

export default function LastSecondHelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        <span className="font-medium">Back</span>
      </button>

      <div className="max-w-3xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Last-Second Help</h1>
        <p className="mb-6 text-lg">
          Deadline coming up? Midterm tomorrow? We have helped students go from overwhelmed to confident in just hours. If you’re panicking — let’s fix it together, fast.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <FaClock className="text-red-500 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold">Emergency Review</h2>
              <p>We’ll triage your weak spots and hit only what you need for the test.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaBolt className="text-yellow-600 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold">Quick Problem Solving</h2>
              <p>Need to understand a few problems quickly? We will walk you through live solutions and patterns.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/booking"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Schedule a Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
