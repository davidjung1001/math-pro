import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Edit2, Save, X, Trash2, Search, CheckCircle, Circle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
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
        >
            {preprocessForKaTeX(content)}
        </ReactMarkdown>
    </div>
);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLessonsEditor() {
    const [lessons, setLessons] = useState([]);
    const [editingLesson, setEditingLesson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedLesson, setExpandedLesson] = useState(null);

    // Filters
    const [courses, setCourses] = useState([]);
    const [subsections, setSubsections] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [limit, setLimit] = useState(25);
    const [showOnlyUnreviewed, setShowOnlyUnreviewed] = useState(false);
    const [totalLessons, setTotalLessons] = useState(0);

    useEffect(() => {
        loadFilterOptions();
    }, [selectedCourse]);

    useEffect(() => {
        fetchLessons();
    }, [selectedCourse, selectedSubsection, limit, showOnlyUnreviewed]);

    const loadFilterOptions = async () => {
        try {
            const { data: coursesData } = await supabase
                .from('all_lessons')
                .select('course')
                .order('course');
            
            const uniqueCourses = [...new Set(coursesData?.map(item => item.course))];
            setCourses(uniqueCourses);

            if (selectedCourse) {
                const { data: subsectionsData } = await supabase
                    .from('all_lessons')
                    .select('subsection_title')
                    .eq('course', selectedCourse)
                    .order('subsection_title');
                
                const uniqueSubsections = [...new Set(subsectionsData?.map(item => item.subsection_title))];
                setSubsections(uniqueSubsections);
            }
        } catch (err) {
            console.error('Error loading filters:', err);
        }
    };

    const fetchLessons = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('all_lessons')
                .select('*', { count: 'exact' });

            if (selectedCourse) {
                query = query.eq('course', selectedCourse);
            }
            if (selectedSubsection) {
                query = query.eq('subsection_title', selectedSubsection);
            }
            if (showOnlyUnreviewed) {
                query = query.or('reviewed.is.null,reviewed.eq.false');
            }

            const { data, error, count } = await query
                .order('id', { ascending: true })
                .limit(limit);

            if (error) throw error;
            setLessons(data || []);
            setTotalLessons(count || 0);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleReviewed = async (lessonId, currentStatus) => {
        try {
            await supabase
                .from('all_lessons')
                .update({ reviewed: !currentStatus })
                .eq('id', lessonId);
            setMessage('✓ Status updated');
            fetchLessons();
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const saveLesson = async () => {
        if (!editingLesson) return;
        try {
            const { error } = await supabase
                .from('all_lessons')
                .update({
                    lesson_text: editingLesson.lesson_text,
                    keywords: editingLesson.keywords,
                })
                .eq('id', editingLesson.id);

            if (error) throw error;
            setMessage('✓ Saved successfully');
            setEditingLesson(null);
            fetchLessons();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const deleteLesson = async (lessonId) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await supabase.from('all_lessons').delete().eq('id', lessonId);
            setMessage('✓ Deleted');
            fetchLessons();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const filteredLessons = lessons.filter(l =>
        !searchTerm || 
        JSON.stringify(l).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-40 border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-blue-600" />
                        Lesson Editor
                    </h1>
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
                                {courses.map(c => <option key={c} value={c}>{c}</option>)}
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
                                    {subsections.map(s => <option key={s} value={s}>{s}</option>)}
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
                        placeholder="Search lessons..."
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

                {/* Lessons List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading lessons...</p>
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-gray-600 mb-2">
                            Showing {filteredLessons.length} of {totalLessons} lessons
                        </div>

                        <div className="space-y-3">
                            {filteredLessons.map(lesson => (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    isExpanded={expandedLesson === lesson.id}
                                    isEditing={editingLesson?.id === lesson.id}
                                    editingLesson={editingLesson}
                                    onToggleExpand={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                                    onEdit={() => setEditingLesson(lesson)}
                                    onSave={saveLesson}
                                    onCancel={() => setEditingLesson(null)}
                                    onDelete={() => deleteLesson(lesson.id)}
                                    onToggleReviewed={() => toggleReviewed(lesson.id, lesson.reviewed)}
                                    onFieldChange={(field, value) => setEditingLesson({...editingLesson, [field]: value})}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Editing Modal */}
            {editingLesson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Edit Lesson #{editingLesson.id}</h3>
                            <button onClick={() => setEditingLesson(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Course/Subsection Info */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-xs text-blue-600 font-semibold mb-1">COURSE</div>
                                <div className="text-sm font-medium text-blue-900">{editingLesson.course}</div>
                                <div className="text-xs text-blue-600 font-semibold mt-2 mb-1">SUBSECTION</div>
                                <div className="text-sm font-medium text-blue-900">{editingLesson.subsection_title}</div>
                            </div>

                            {/* Lesson Text */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Content</label>
                                <textarea
                                    value={editingLesson.lesson_text || ''}
                                    onChange={e => setEditingLesson({...editingLesson, lesson_text: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[400px] text-sm font-mono"
                                    placeholder="Enter lesson content with markdown and LaTeX..."
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    Character count: {editingLesson.lesson_text?.length || 0}
                                </div>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                                <input
                                    type="text"
                                    value={editingLesson.keywords || ''}
                                    onChange={e => setEditingLesson({...editingLesson, keywords: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Enter keywords separated by commas..."
                                />
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto">
                                    <MarkdownKaTeX 
                                        content={editingLesson.lesson_text || ''} 
                                        className="prose prose-sm max-w-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                            <button
                                onClick={saveLesson}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingLesson(null)}
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

function LessonCard({ lesson, isExpanded, onToggleExpand, onEdit, onDelete, onToggleReviewed }) {
    const isReviewed = lesson.reviewed === true;

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
            isReviewed ? 'border-green-500' : 'border-gray-300'
        }`}>
            {/* Header */}
            <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">ID: {lesson.id}</span>
                        {isReviewed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Reviewed
                            </span>
                        )}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                        {lesson.course}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                        {lesson.subsection_title}
                    </div>
                    <MarkdownKaTeX 
                        content={lesson.lesson_text || ''} 
                        className="text-sm text-gray-900 line-clamp-3"
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
                    {/* Full Lesson Content */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                        <MarkdownKaTeX 
                            content={lesson.lesson_text || ''} 
                            className="prose prose-sm max-w-none"
                        />
                    </div>

                    {/* Keywords */}
                    {lesson.keywords && (
                        <div className="text-sm">
                            <span className="font-semibold text-gray-700">Keywords: </span>
                            <span className="text-gray-600">{lesson.keywords}</span>
                        </div>
                    )}

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