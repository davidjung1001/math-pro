'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

export default function VisitorDetailsTab({ visitorDetails }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredVisitors = visitorDetails?.filter(visitor =>
    visitor.session_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by session, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 px-2">
        Showing {filteredVisitors.length} visitor{filteredVisitors.length !== 1 ? 's' : ''}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Session ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Browser</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">First Visit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Page Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVisitors.map((visitor, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    {visitor.session_id?.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {visitor.city}, {visitor.country}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{visitor.device_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{visitor.browser}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(visitor.first_visit).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{visitor.page_views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredVisitors.map((visitor, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            {/* Session ID */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Session</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {visitor.session_id}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Views</div>
                <div className="text-lg font-bold text-indigo-600">
                  {visitor.page_views}
                </div>
              </div>
            </div>

            {/* Location & Device Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Location</div>
                <div className="text-gray-900">{visitor.city}</div>
                <div className="text-gray-600 text-xs">{visitor.country}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Device</div>
                <div className="text-gray-900">{visitor.device_type}</div>
                <div className="text-gray-600 text-xs">{visitor.browser}</div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 font-semibold uppercase mb-1">First Visit</div>
              <div className="text-sm text-gray-900">
                {new Date(visitor.first_visit).toLocaleDateString()} at{' '}
                {new Date(visitor.first_visit).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVisitors.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 text-lg">No visitors found</p>
          {searchTerm && (
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search filters
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Users({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}