'use client'

import { BarChart3, Users, Route, FileText } from 'lucide-react'

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'visitors', label: 'Visitors', icon: Users },
    { id: 'journeys', label: 'Journeys', icon: Route },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'behavior', label: 'Behavior', icon: FileText }
  ]

  return (
    <div className="mb-6">
      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base font-medium"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Tab buttons */}
      <div className="hidden sm:flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}