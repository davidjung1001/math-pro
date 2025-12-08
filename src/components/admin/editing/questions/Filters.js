import React from 'react';

export const Filters = ({
    courses, subsections, selectedCourse, setSelectedCourse,
    selectedSubsection, setSelectedSubsection,
    limit, setLimit,
    showOnlyUnreviewed, setShowOnlyUnreviewed,
    // NEW PROP
    markSubsectionReviewed
}) => (
    <div className="bg-white shadow-md sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Question Editor</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
                    {/* Course Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Course</label>
                        <select
                            value={selectedCourse}
                            onChange={e => { setSelectedCourse(e.target.value); setSelectedSubsection(''); }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">All Courses</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>

                    {/* Subsection Filter (with color styling) */}
                    {selectedCourse && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Subsection</label>
                            <select
                                value={selectedSubsection}
                                onChange={e => setSelectedSubsection(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">All Subsections</option>
                                {subsections.map(s => (
                                    // Conditional styling for complete subsections
                                    <option 
                                        key={s.id} 
                                        value={s.id}
                                        className={s.is_complete ? 'bg-green-100 text-green-700 font-medium' : ''}
                                    >
                                        {s.subsection_title} {s.is_complete ? ' (Complete)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Limit Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Limit</label>
                        <select
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    {/* Unreviewed Toggle */}
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 text-sm cursor-pointer pt-6">
                            <input
                                type="checkbox"
                                checked={showOnlyUnreviewed}
                                onChange={e => setShowOnlyUnreviewed(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="font-medium text-gray-700 uppercase text-xs">Unreviewed Only</span>
                        </label>
                    </div>

                    {/* Mark Subsection Complete Button */}
                    {selectedSubsection && (
                        <button
                            onClick={markSubsectionReviewed}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap pt-3"
                        >
                            Mark Subsection Complete
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);