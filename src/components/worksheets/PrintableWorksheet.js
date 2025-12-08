'use client';


import KaTeXRenderer from '@/components/KaTeXRenderer';

export default function PrintableWorksheet({ subsection, quiz, questions }) {
  return (
    <div className="overflow-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md mx-auto p-6 max-w-3xl">
        <h1 className="text-center text-2xl font-bold">{subsection.subsection_title}</h1>
        <p className="text-center text-sm text-gray-700">
          {subsection.sections.section_title} • {subsection.sections.courses.title}
        </p>
        <p className="text-center text-sm text-gray-700">{quiz.name} — {quiz.difficulty}</p>
        <hr className="my-4" />

        {questions.map((q, idx) => (
          <div key={q.id} className="mb-6 overflow-x-auto">
            <KaTeXRenderer content={`${idx + 1}. ${q.question_text}`} />
            <ul className="list-none pl-4 mt-2">
              {q.option_a && <li>A. <KaTeXRenderer content={q.option_a} /></li>}
              {q.option_b && <li>B. <KaTeXRenderer content={q.option_b} /></li>}
              {q.option_c && <li>C. <KaTeXRenderer content={q.option_c} /></li>}
              {q.option_d && <li>D. <KaTeXRenderer content={q.option_d} /></li>}
            </ul>
            {q.correct_option && (
              <p className="mt-1 text-green-700 font-semibold">
                Answer: {q.correct_option}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
