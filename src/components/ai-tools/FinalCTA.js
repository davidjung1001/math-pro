import { Zap } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Ready to create your first worksheet?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Join thousands of teachers and students using AI to save time on educational materials.
        </p>
        <a
          href="#tool"
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-base hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Zap className="w-4 h-4" />
          Start Generating Free Worksheets
        </a>
      </div>
    </section>
  );
}