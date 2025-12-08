'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SubsectionNavigation({ 
  prevSubsection, 
  nextSubsection,
  slug,
  moduleSlug 
}) {
  return (
    <>
      {/* Previous Subsection - actually moved inward */}
      {prevSubsection && (
        <Link
          href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${prevSubsection.slug}/printable-pdf/1`}
          className="fixed left-[4px] top-1/2 -translate-y-1/2 z-20 group flex items-center gap-1.5 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 rounded-full p-1.5 shadow-lg transition-all"
          title={`Previous: ${prevSubsection.title}`}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
        </Link>
      )}

      {/* Next Subsection (unchanged size, slightly smaller) */}
      {nextSubsection && (
        <Link
          href={`/worksheets/free-worksheets/${slug}/${moduleSlug}/${nextSubsection.slug}/printable-pdf/1`}
          className="fixed right-2 lg:right-[calc(16rem+1rem)] top-1/2 -translate-y-1/2 z-20 group flex items-center gap-1.5 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 rounded-full p-1.5 shadow-lg transition-all"
          title={`Next: ${nextSubsection.title}`}
        >
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
        </Link>
      )}
    </>
  );
}
