import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-4 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-10 w-3/4 bg-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="h-6 w-full bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="flex flex-wrap gap-3">
            <div className="h-8 w-28 bg-blue-100 rounded-full animate-pulse"></div>
            <div className="h-8 w-32 bg-green-100 rounded-full animate-pulse"></div>
            <div className="h-8 w-36 bg-purple-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Generator Section Skeleton */}
        <section className="mb-12">
          <div className="h-8 w-96 bg-gray-300 rounded mb-6 animate-pulse"></div>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-lg text-blue-600">Loading Lesson Content...</span>
            </div>
          </div>
        </section>

        {/* SEO Content Skeleton */}
        <section className="prose max-w-none mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-200">
            <div className="h-7 w-80 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}