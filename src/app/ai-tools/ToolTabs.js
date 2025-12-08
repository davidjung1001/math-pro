'use client';

import { useState } from "react";
import WorksheetTab from "@/components/ai-tools/WorksheetTab";

export default function ToolTabs({ user }) {
  // You can keep a "tab" state if you plan to add more later, but currently only one tab
  const [activeTab] = useState("Worksheet");

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header or title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {activeTab} Tool
        </h1>
      </div>

      {/* Render the single tab content directly */}
      <WorksheetTab user={user} />
    </div>
  );
}
