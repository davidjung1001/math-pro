"use client";

import Link from "next/link";

export default function ConsultationSection() {
  return (
    <section className="bg-blue-50 py-16 px-6 sm:px-12 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-6">
          Still Unsure?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Not sure where your student stands or what kind of support they really need? 
          Let’s talk it through. In a free consultation, we’ll figure out how they’re doing and 
          what will help them thrive.
        </p>
        <Link
          href="/booking" // replace with your real booking route
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full transition-colors duration-300"
        >
          Book a Free Consultation
        </Link>
      </div>
    </section>
  );
}
