'use client';

import { useState } from "react";
import WorksheetTab from "@/components/ai-tools/WorksheetTab";

export default function ToolTabs({ user }) {
  const [activeTab] = useState("Worksheet");

  return (
    <div className="w-full max-w-5xl mx-auto" id="tool">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          AI Worksheet Generator
        </h1>
        <p className="text-slate-400">
          Describe what you need and let AI create a customized worksheet
        </p>
      </div>

      <WorksheetTab user={user} />
    </div>
  );
}