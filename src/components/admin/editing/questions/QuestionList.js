import React from 'react';
import { QuestionCard } from './QuestionCard';

export const QuestionList = ({
    filteredQuestions, totalQuestions, loading,
    expandedQuestion, setExpandedQuestion,
    editingQuestion, setEditingQuestion,
    saveQuestion, deleteQuestion, toggleReviewed,
    selectedIds, setSelectedIds, bulkMarkReviewed
}) => {
    if (loading) return (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
    );

    const allSelected = filteredQuestions.length > 0 && filteredQuestions.every(q => selectedIds.has(q.id));
    const someSelected = selectedIds.size > 0;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredQuestions.map(q => q.id)));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded text-blue-600 border-gray-300"
                        />
                        <span className="text-gray-600 text-xs font-semibold uppercase">
                            {someSelected ? `${selectedIds.size} selected` : 'Select all'}
                        </span>
                    </label>
                </div>

                {someSelected && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => bulkMarkReviewed(true)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
                        >
                            Mark Reviewed
                        </button>
                        <button
                            onClick={() => bulkMarkReviewed(false)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
                        >
                            Unmark
                        </button>
                    </div>
                )}

                <span className="text-sm text-gray-600 ml-auto">
                    Showing {filteredQuestions.length} of {totalQuestions}
                </span>
            </div>

            <div className="space-y-3">
                {filteredQuestions.map(q => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        isExpanded={expandedQuestion === q.id}
                        isEditing={editingQuestion?.id === q.id}
                        isSelected={selectedIds.has(q.id)}
                        onToggleSelect={() => toggleSelectOne(q.id)}
                        onToggleExpand={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                        onEdit={() => setEditingQuestion(q)}
                        onSave={saveQuestion}
                        onDelete={() => deleteQuestion(q.id)}
                        onToggleReviewed={() => toggleReviewed(q.id, q.reviewed)}
                    />
                ))}
            </div>
        </>
    );
};
