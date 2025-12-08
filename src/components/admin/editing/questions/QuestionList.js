import React from 'react';
import { QuestionCard } from './QuestionCard';

export const QuestionList = ({
    filteredQuestions, totalQuestions, loading,
    expandedQuestion, setExpandedQuestion,
    editingQuestion, setEditingQuestion,
    saveQuestion, deleteQuestion, toggleReviewed
}) => {
    if (loading) return (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
    );

    return (
        <>
            <div className="text-sm text-gray-600 mb-2">
                Showing {filteredQuestions.length} of {totalQuestions} questions
            </div>

            <div className="space-y-3">
                {filteredQuestions.map(q => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        isExpanded={expandedQuestion === q.id}
                        isEditing={editingQuestion?.id === q.id}
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
