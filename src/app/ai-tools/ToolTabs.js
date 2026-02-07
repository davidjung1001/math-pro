'use client'

import { useState } from "react"
import WorksheetTab from "@/components/ai-tools/WorksheetTab"
import PictureToNotesTab from "@/components/ai-tools/PictureToNotesTab"
import { FileText, Camera } from "lucide-react"

export default function ToolTabs() {
  const [activeTab, setActiveTab] = useState("worksheet")

  const tabs = [
    { id: "worksheet", label: "Worksheet Generator", icon: FileText },
    { id: "picture", label: "Picture to Notes", icon: Camera }
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "worksheet" && <WorksheetTab />}
        {activeTab === "picture" && <PictureToNotesTab />}
      </div>
    </div>
  )
}