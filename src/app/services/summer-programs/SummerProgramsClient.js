"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSun, FaBookOpen } from "react-icons/fa";

export default function SummerProgramsClient() {
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
        <h1 className="text-3xl font-bold mb-6">Summer Enrichment Programs</h1>
        <p className="mb-6 text-lg">
          Don't waste your summer! Join customized learning programs to get
          ahead, catch up, or explore subjects at your own pace. Whether you’re
          preparing for next year or exploring topics deeper, this is your
          time.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <FaSun className="text-yellow-500 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold">Get Ahead on Next Year's Topics</h2>
              <p>Preview Algebra, Calculus, or Science topics so you can walk into class confident and ready.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaBookOpen className="text-indigo-500 text-3xl mt-1" />
            <div>
              <h2 className="text-xl font-semibold">Bridge Learning Gaps</h2>
              <p>Struggled this past year? Let’s fill in the gaps so you don’t fall behind again.</p>
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
