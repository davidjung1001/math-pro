import React from 'react';
import { Edit2, Trash2, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownKaTeX } from './MarkdownKaTeX';

export function QuestionCard({ question, isExpanded, isEditing, onToggleExpand, onEdit, onDelete, onToggleReviewed }) {
    const isReviewed = question.reviewed === true;

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
            isReviewed ? 'border-green-500' : 'border-gray-300'
        }`}>
            {/* Header */}
            <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">ID: {question.id}</span>
                        {isReviewed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Reviewed
                            </span>
                        )}
                    </div>

                    {/* Course / Subsection info */}
                    <div className="text-xs text-gray-600 mb-2 flex items-center gap-2">
                        {question.subsection?.section?.course?.title} • {question.subsection?.subsection_title}

                        {/* ✅ Display the current correct answer from the DB */}
                        {question.correct_option && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                                Correct: {question.correct_option.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Question text */}
                    <MarkdownKaTeX 
                        content={question.question_text || ''} 
                        className="text-sm font-medium text-gray-900 line-clamp-2"
                    />
                </div>

                <button
                    onClick={onToggleExpand}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {/* Expanded Options */}
            {isExpanded && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                    <div className="space-y-2">
                        {['a', 'b', 'c', 'd'].map(opt => (
                            <div key={opt} className={`p-2 rounded ${
                                question.correct_option === opt ? 'bg-green-100 border border-green-300' : 'bg-white'
                            }`}>
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-sm text-gray-700 flex-shrink-0">{opt.toUpperCase()}.</span>
                                    <MarkdownKaTeX 
                                        content={question[`option_${opt}`] || ''} 
                                        className="text-sm flex-1"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        <button
                            onClick={onEdit}
                            className="flex-1 min-w-[100px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={onToggleReviewed}
                            className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                                isReviewed
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        >
                            {isReviewed ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {isReviewed ? 'Unmark' : 'Mark'}
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
