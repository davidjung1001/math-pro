"use client";

export default function LessonPlanTab({ inputs, setInputs }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Topic
        </label>
        <input
          type="text"
          value={inputs.topic}
          onChange={(e) => setInputs({...inputs, topic: e.target.value})}
          placeholder="e.g., Pythagorean Theorem"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Grade Level
        </label>
        <input
          type="text"
          value={inputs.grade}
          onChange={(e) => setInputs({...inputs, grade: e.target.value})}
          placeholder="e.g., 8th Grade"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Lecture Notes or Textbook Content (Optional)
        </label>
        <textarea
          value={inputs.notes}
          onChange={(e) => setInputs({...inputs, notes: e.target.value})}
          placeholder="Paste any relevant content here..."
          rows="6"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition resize-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Specific Question (Optional)
        </label>
        <input
          type="text"
          value={inputs.question}
          onChange={(e) => setInputs({...inputs, question: e.target.value})}
          placeholder="Any specific focus for the lesson?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition text-gray-900"
        />
      </div>
    </div>
  );
}