"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function NotecardsTab({ user }) {
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/ai-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolType: "Notecards",
        inputData: { text, topic },
        user
      }),
    });
    const data = await res.json();
    setOutput(data.answer || data.error);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional)"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text or notes to create notecards"
        />
      </div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Notecards"}
      </button>

      {output && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <ReactMarkdown>{output}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
