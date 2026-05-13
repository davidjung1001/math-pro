import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return profile?.is_admin ? user : null;
}

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { course, section_title, subsection_title, set_number, num_questions, difficulty, premium } = await req.json();

  if (!course || !section_title || !subsection_title || !set_number || !num_questions || !difficulty) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const prompt = `You are a professional Math SAT questions generator.

Generate exactly ${num_questions} multiple-choice math questions for:
- Course: "${course}"
- Section: "${section_title}"
- Subsection: "${subsection_title}"
- Difficulty: ${difficulty}
- Practice Set: ${set_number}

Requirements:
1. All math formulas and equations MUST be in raw LaTeX wrapped in $...$ for inline math.
   Examples: $x^2$, $\\frac{1}{2}$, $\\sqrt{x}$
2. Do NOT use unicode math symbols (√, π, ±, ≤, ≥, ×, ÷) — use LaTeX instead.
3. Do NOT use markdown bold/italic, HTML, or code fences.
4. Return a JSON object with a single key "questions" containing an array of exactly ${num_questions} objects.

Each object must have exactly these keys:
{
  "course": "${course}",
  "section_title": "${section_title}",
  "subsection_title": "${subsection_title}",
  "set_number": ${set_number},
  "difficulty": "${difficulty}",
  "sort_order": <integer 1 to ${num_questions}>,
  "question_text": "<question using $...$ for math>",
  "image_url": "",
  "option_a": "<choice A using $...$ if math>",
  "option_b": "<choice B using $...$ if math>",
  "option_c": "<choice C using $...$ if math>",
  "option_d": "<choice D using $...$ if math>",
  "correct_option": "<A, B, C, or D>",
  "correct_answer_text": "<the correct answer text using $...$ if math>",
  "premium": ${premium ? 'true' : 'false'},
  "short_explanation": "<1-2 sentence explanation using $...$ for any math>"
}`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0].message.content.trim();
    const data = JSON.parse(raw);

    let questions = Array.isArray(data) ? data : (data.questions || Object.values(data)[0]);
    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'Unexpected response format from AI' }, { status: 500 });
    }

    // Ensure fields are correct
    questions = questions.map((q) => ({
      ...q,
      course,
      section_title,
      subsection_title,
      set_number: Number(set_number),
      difficulty,
      premium: Boolean(premium),
    }));

    return NextResponse.json({ success: true, questions });
  } catch (err) {
    console.error('Question generation error:', err);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
