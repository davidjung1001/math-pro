import OpenAI from "openai";

// Normalize LaTeX delimiters
function normalizeLatex(text) {
  if (!text) return '';
  return text
    // Fix escaped parentheses/brackets to dollar signs
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    // Fix broken fractions
    .replace(/\\frac\$\{([^{}]+)\}\{([^{}]+)\}/g, '\\frac{$1}{$2}')
    // Remove markdown code blocks if present
    .replace(/```markdown\n?/g, '')
    .replace(/```\n?/g, '');
}

export async function POST(req) {
  const { toolType, inputData, user } = await req.json();

  if (toolType !== "Worksheet" && toolType !== "PictureToNotes") {
    return new Response(JSON.stringify({ error: "Invalid tool type" }), { status: 400 });
  }

  // ==================== YOUR ORIGINAL WORKSHEET CODE (UNCHANGED) ====================
  if (toolType === "Worksheet") {
    const { topic, numQuestions, difficulty = "Medium", notes = "" } = inputData;

    // AI prompt - generates structured multiple choice questions
    const prompt = `
Generate exactly ${numQuestions} multiple-choice questions about "${topic}" at ${difficulty} difficulty level.

${notes ? `Use this context for question generation:\n${notes}\n` : ''}

Format EXACTLY as follows:

1. [Question text here]
a. [Option A]
b. [Option B]
c. [Option C]
d. [Option D]
**Answer:** [letter]
**Explanation:** [brief explanation]

2. [Question text here]
a. [Option A]
b. [Option B]
c. [Option C]
d. [Option D]
**Answer:** [letter]
**Explanation:** [brief explanation]

CRITICAL RULES:
- Use KaTeX format for math: $x^2$ for inline, $$\\frac{a}{b}$$ for display
- Fractions MUST use \\frac{numerator}{denominator}
- Each question MUST have exactly 4 options (a, b, c, d)
- Each question MUST have an answer and explanation
- Use double asterisks for **Answer:** and **Explanation:** labels
- Separate questions with blank lines
- Do NOT use markdown headers, code blocks, or extra formatting
- Do NOT add intro text or conclusion - ONLY the numbered questions
`;

    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const rawText = response.choices[0].message.content;
      const normalized = normalizeLatex(rawText);

      // Parse the response into structured questions
      const questions = parseWorksheet(normalized);

      return new Response(
        JSON.stringify({
          success: true,
          questions: questions,
          locked: !user?.loggedIn,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate worksheet" }),
        { status: 500 }
      );
    }
  }

  // ==================== NEW: PICTURE TO NOTES ====================
  if (toolType === "PictureToNotes") {
    const { image, outputFormat = "organized" } = inputData;

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }

    const formatInstructions = {
      organized: "Convert the notes into well-organized, clearly formatted study notes with headers, bullet points, and proper structure. Use markdown formatting.",
      flashcards: "Convert the notes into flashcard format. For each flashcard, use this format:\n\n**Q:** [Question or term]\n**A:** [Answer or definition]\n\nCreate at least 10 flashcards covering all major concepts.",
      summary: "Create a concise summary of the main concepts and key points from the notes. Include the most important information in a clear, digestible format."
    };

    const prompt = `You are an expert at extracting and organizing information from handwritten or typed notes.

Analyze the provided image and extract all text content. Then, ${formatInstructions[outputFormat]}

FORMATTING RULES:
- Use clear headers (use ## for main topics, ### for subtopics)
- Use bullet points (•) for lists
- Use **bold** for important terms and concepts
- Use *italics* for emphasis or examples
- For math notation, use standard text representation (e.g., x^2, sqrt(x), a/b)
- Make it clean, readable, and well-structured
- If the image is unclear or text is ambiguous, do your best to interpret it
- Maintain the logical flow and organization of the original notes

OUTPUT ONLY THE FORMATTED NOTES - no preamble, no "Here are your notes:", just start with the content.`;

    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { 
                  url: image,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const notesContent = response.choices[0].message.content;

      return new Response(
        JSON.stringify({
          success: true,
          notes: {
            content: notesContent,
            format: outputFormat
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("OpenAI Vision API Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process image. Please try again." }),
        { status: 500 }
      );
    }
  }
}

// Parse AI response into structured question objects
function parseWorksheet(text) {
  const questions = [];
  
  // Split by question numbers (1., 2., 3., etc.)
  const questionBlocks = text.split(/\n(?=\d+\.\s)/).filter(block => block.trim());

  questionBlocks.forEach((block, idx) => {
    const lines = block.split('\n').filter(line => line.trim());
    
    const question = {
      id: idx,
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: '',
      short_explanation: ''
    };

    // Extract question text (first line after number)
    const questionMatch = lines[0]?.match(/^\d+\.\s*(.+)$/);
    if (questionMatch) {
      question.question_text = questionMatch[1].trim();
    }

    // Extract options and metadata
    lines.forEach(line => {
      const optionMatch = line.match(/^([a-d])\.\s*(.+)$/i);
      if (optionMatch) {
        const letter = optionMatch[1].toLowerCase();
        question[`option_${letter}`] = optionMatch[2].trim();
      }

      const answerMatch = line.match(/\*\*Answer:\*\*\s*([a-d])/i);
      if (answerMatch) {
        question.correct_option = answerMatch[1].toUpperCase();
      }

      const explanationMatch = line.match(/\*\*Explanation:\*\*\s*(.+)$/i);
      if (explanationMatch) {
        question.short_explanation = explanationMatch[1].trim();
      }
    });

    if (question.question_text) {
      questions.push(question);
    }
  });

  return questions;
}