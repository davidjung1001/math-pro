import { supabase } from "@/lib/supabaseClient"
import OpenAI from "openai"

export const runtime = "nodejs"

export async function POST(req) {
  const { subsection_id, topic, difficulty, numProblems = 10, aiFallback = false } = await req.json()

  // Step 1: Try to fetch questions from your DB
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .ilike("topic", `%${topic || ''}%`)
    .eq("difficulty", difficulty)
    .limit(numProblems)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Step 2: If found enough questions, render worksheet from them
  if (questions && questions.length > 0) {
    const worksheet = questions
      .map((q, i) => `${i + 1}. ${q.question_text}`)
      .join("\n\n")

    return new Response(JSON.stringify({ worksheet }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Step 3: Optional fallback to AI if not enough questions exist
  if (aiFallback) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const prompt = `
Generate ${numProblems} ${difficulty}-level math questions about ${topic}.
Format each problem like:
1. Problem text
(use $$...$$ for block math)
`
    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const worksheet = aiResponse.choices[0].message.content.trim()
    return new Response(JSON.stringify({ worksheet }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Step 4: If no results and no AI fallback
  return new Response(JSON.stringify({ worksheet: "No questions available." }), {
    status: 404,
  })
}
