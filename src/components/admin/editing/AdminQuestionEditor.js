import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Edit2, Save, X, Trash2, Search, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessForKaTeX } from '@/lib/utils/lessonKatex';

const MarkdownKaTeX = ({ content, className }) => (
    <div className={className}>
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{ p: ({ node, ...props }) => <span {...props} /> }}
        >
            {preprocessForKaTeX(content)}
        </ReactMarkdown>
    </div>
);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminQuestionsEditor() {
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    // Filters
    const [courses, setCourses] = useState([]);
    const [subsections, setSubsections] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [limit, setLimit] = useState(25);
    const [showOnlyUnreviewed, setShowOnlyUnreviewed] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        loadFilterOptions();
    }, [selectedCourse]);

    useEffect(() => {
        fetchQuestions();
    }, [selectedCourse, selectedSubsection, limit, showOnlyUnreviewed]);

    const loadFilterOptions = async () => {
        try {
            const { data: coursesData } = await supabase
                .from('courses')
                .select('id, title')
                .order('title');
            setCourses(coursesData || []);

            if (selectedCourse) {
                const { data: sectionsData } = await supabase
                    .from('sections')
                    .select('id')
                    .eq('course_id', selectedCourse);

                const sectionIds = sectionsData?.map(s => s.id) || [];

                if (sectionIds.length > 0) {
                    const { data: subsectionsData } = await supabase
                        .from('subsections')
                        .select('id, subsection_title')
                        .in('section_id', sectionIds);
                    setSubsections(subsectionsData || []);
                } else {
                    setSubsections([]);
                }
            }
        } catch (err) {
            console.error('Error loading filters:', err);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('questions')
                .select(
                    `*, subsection:subsection_id(id, subsection_title, section:section_id(id, section_title, course:course_id(id, title)))`,
                    { count: 'exact' }
                );

            if (selectedSubsection) {
                query = query.eq('subsection_id', selectedSubsection);
            } else if (selectedCourse) {
                const { data: sectionsData } = await supabase
                    .from('sections')
                    .select('id')
                    .eq('course_id', selectedCourse);
                const sectionIds = sectionsData?.map(s => s.id) || [];
                if (sectionIds.length > 0) {
                    const { data: subsectionsData } = await supabase
                        .from('subsections')
                        .select('id')
                        .in('section_id', sectionIds);
                    const subsectionIds = subsectionsData?.map(s => s.id) || [];
                    query = query.in('subsection_id', subsectionIds);
                } else {
                    query = query.in('id', [0]);
                }
            }

            if (showOnlyUnreviewed) {
                query = query.or('reviewed.is.null,reviewed.eq.false');
            }

            const { data, error, count } = await query
                .order('id', { ascending: true })
                .limit(limit);

            if (error) throw error;
            setQuestions(data || []);
            setTotalQuestions(count || 0);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleReviewed = async (questionId, currentStatus) => {
        try {
            await supabase
                .from('questions')
                .update({ reviewed: !currentStatus })
                .eq('id', questionId);
            setMessage('✓ Status updated');
            fetchQuestions();
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const saveQuestion = async () => {
        if (!editingQuestion) return;
        try {
            const { error } = await supabase
                .from('questions')
                .update({
                    question_text: editingQuestion.question_text,
                    option_a: editingQuestion.option_a,
                    option_b: editingQuestion.option_b,
                    option_c: editingQuestion.option_c,
                    option_d: editingQuestion.option_d,
                    correct_option: editingQuestion.correct_option,
                })
                .eq('id', editingQuestion.id);

            if (error) throw error;
            setMessage('✓ Saved successfully');
            setEditingQuestion(null);
            fetchQuestions();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const deleteQuestion = async (questionId) => {
        if (!confirm('Delete this question?')) return;
        try {
            await supabase.from('questions').delete().eq('id', questionId);
            setMessage('✓ Deleted');
            fetchQuestions();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const filteredQuestions = questions.filter(q =>
        !searchTerm || 
        JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-40 border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Question Editor</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Course</label>
                            <select
                                value={selectedCourse}
                                onChange={e => {
                                    setSelectedCourse(e.target.value);
                                    setSelectedSubsection('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">All Courses</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>

                        {selectedCourse && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Subsection</label>
                                <select
                                    value={selectedSubsection}
                                    onChange={e => setSelectedSubsection(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">All Subsections</option>
                                    {subsections.map(s => <option key={s.id} value={s.id}>{s.subsection_title}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <select
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showOnlyUnreviewed}
                                onChange={e => setShowOnlyUnreviewed(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600"
                            />
                            <span className="font-medium">Unreviewed Only</span>
                        </label>

                        {(selectedCourse || selectedSubsection || showOnlyUnreviewed) && (
                            <button
                                onClick={() => {
                                    setSelectedCourse('');
                                    setSelectedSubsection('');
                                    setShowOnlyUnreviewed(false);
                                    setSearchTerm('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                        message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Questions List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading questions...</p>
                    </div>
                ) : (
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
                                    editingQuestion={editingQuestion}
                                    onToggleExpand={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                                    onEdit={() => setEditingQuestion(q)}
                                    onSave={saveQuestion}
                                    onCancel={() => setEditingQuestion(null)}
                                    onDelete={() => deleteQuestion(q.id)}
                                    onToggleReviewed={() => toggleReviewed(q.id, q.reviewed)}
                                    onFieldChange={(field, value) => setEditingQuestion({...editingQuestion, [field]: value})}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Editing Modal */}
            {editingQuestion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Edit Question #{editingQuestion.id}</h3>
                            <button onClick={() => setEditingQuestion(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                                <textarea
                                    value={editingQuestion.question_text || ''}
                                    onChange={e => setEditingQuestion({...editingQuestion, question_text: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm"
                                    placeholder="Enter question text..."
                                />
                            </div>

                            {/* Options */}
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <div key={opt}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Option {opt.toUpperCase()}
                                        {editingQuestion.correct_option === opt && (
                                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Correct</span>
                                        )}
                                    </label>
                                    <textarea
                                        value={editingQuestion[`option_${opt}`] || ''}
                                        onChange={e => setEditingQuestion({...editingQuestion, [`option_${opt}`]: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[60px] text-sm"
                                        placeholder={`Enter option ${opt.toUpperCase()}...`}
                                    />
                                </div>
                            ))}

                            {/* Correct Answer */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer</label>
                                <select
                                    value={editingQuestion.correct_option || ''}
                                    onChange={e => setEditingQuestion({...editingQuestion, correct_option: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Select correct option</option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="c">C</option>
                                    <option value="d">D</option>
                                </select>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                            <button
                                onClick={saveQuestion}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function QuestionCard({ question, isExpanded, isEditing, onToggleExpand, onEdit, onDelete, onToggleReviewed }) {
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
                    <div className="text-xs text-gray-600 mb-2">
                        {question.subsection?.section?.course?.title} • {question.subsection?.subsection_title}
                    </div>
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

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                    {/* Options */}
                    <div className="space-y-2">
                        {['a', 'b', 'c', 'd'].map(opt => (
                            <div key={opt} className={`p-2 rounded ${
                                question.correct_option === opt ? 'bg-green-100 border border-green-300' : 'bg-white'
                            }`}>
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-sm text-gray-700 flex-shrink-0">
                                        {opt.toUpperCase()}.
                                    </span>
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