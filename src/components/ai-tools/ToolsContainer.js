"use client";

export default function ToolContainer({ title, children }) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
