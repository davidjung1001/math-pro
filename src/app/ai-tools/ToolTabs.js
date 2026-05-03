'use client';

import { useState } from "react";
import WorksheetTab from "@/components/ai-tools/WorksheetTab";

export default function ToolTabs({ user }) {
  const [activeTab] = useState("Worksheet");

  return (
    <div className="w-full" id="tool">
      <WorksheetTab user={user} />
    </div>
  );
}