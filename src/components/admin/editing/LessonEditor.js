'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { createClient } from '@supabase/supabase-js';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex';

export default function LessonEditor({ lesson, isAdmin }) {
  const [lessonText, setLessonText] = useState(lesson.lesson_text);
  const [saving, setSaving] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const saveLesson = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('all_lessons')
      .update({ lesson_text: lessonText })
      .eq('id', lesson.id);

    setSaving(false);
    if (error) alert('Failed to save lesson: ' + error.message);
    else alert('Lesson saved!');
  };

  return (
    <div className="lesson-content text-base sm:text-lg text-gray-800 leading-relaxed space-y-4">
      {isAdmin ? (
        <>
          <textarea
            className="w-full border border-gray-300 p-2 rounded min-h-[200px]"
            value={lessonText}
            onChange={(e) => setLessonText(e.target.value)}
          />
          <button
            onClick={saveLesson}
            disabled={saving}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Lesson'}
          </button>
        </>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {preprocessForKaTeX(lessonText)}
        </ReactMarkdown>
      )}
    </div>
  );
}
