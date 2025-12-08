import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search } from 'lucide-react';
import { MarkdownKaTeX } from './MarkdownKaTeX';
import { Filters } from './Filters';
import { QuestionList } from './QuestionList';
import { EditModal } from './EditModal';

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

    const [courses, setCourses] = useState([]);
    const [subsections, setSubsections] = useState([]); // Now stores status data
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [limit, setLimit] = useState(25);
    const [showOnlyUnreviewed, setShowOnlyUnreviewed] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => { loadFilterOptions(); }, [selectedCourse]);
    useEffect(() => { fetchQuestions(); }, [selectedCourse, selectedSubsection, limit, showOnlyUnreviewed]);

    const loadFilterOptions = async () => {
        try {
            const { data: coursesData } = await supabase.from('courses').select('id, title').order('title');
            setCourses(coursesData || []);
            setSubsections([]); // Clear subsections when course changes

            if (selectedCourse) {
                const { data: sectionsData } = await supabase.from('sections').select('id').eq('course_id', selectedCourse);
                const sectionIds = sectionsData?.map(s => s.id) || [];

                if (sectionIds.length) {
                    // 1. Fetch all subsections for the course
                    let { data: subsectionsData, error: subError } = await supabase
                        .from('subsections')
                        .select('id, subsection_title')
                        .in('section_id', sectionIds);
                    
                    if (subError) throw subError;
                    const subsectionIds = subsectionsData?.map(s => s.id) || [];

                    if (subsectionIds.length) {
                        // 2. Fetch all questions review status for these subsections (for dropdown color calculation)
                        const { data: statusData, error: statusError } = await supabase
                            .from('questions')
                            .select('subsection_id, reviewed')
                            .in('subsection_id', subsectionIds);
                        
                        if (statusError) throw statusError;

                        // 3. Compute status: Group and check for completeness
                        const questionsBySubsection = statusData.reduce((acc, q) => {
                            if (q.subsection_id) {
                                acc[q.subsection_id] = acc[q.subsection_id] || { total: 0, unreviewed: 0 };
                                acc[q.subsection_id].total++;
                                if (!q.reviewed) {
                                    acc[q.subsection_id].unreviewed++;
                                }
                            }
                            return acc;
                        }, {});

                        // 4. Attach is_complete status to each subsection object
                        const updatedSubsections = subsectionsData.map(s => {
                            const status = questionsBySubsection[s.id] || { total: 0, unreviewed: 0 };
                            // A subsection is complete if it has questions AND zero unreviewed questions
                            s.is_complete = (status.total > 0 && status.unreviewed === 0);
                            return s;
                        });
                        
                        setSubsections(updatedSubsections);
                    } else {
                        setSubsections([]);
                    }
                } else setSubsections([]);
            }
        } catch (err) { console.error('Error loading filters or statuses:', err); }
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

            if (selectedSubsection) query = query.eq('subsection_id', selectedSubsection);
            else if (selectedCourse) {
                // Logic to filter by all subsections in a course
                const { data: sectionsData } = await supabase.from('sections').select('id').eq('course_id', selectedCourse);
                const sectionIds = sectionsData?.map(s => s.id) || [];
                if (sectionIds.length) {
                    const { data: subsectionsData } = await supabase
                        .from('subsections')
                        .select('id')
                        .in('section_id', sectionIds);
                    const subsectionIds = subsectionsData?.map(s => s.id) || [];
                    query = query.in('subsection_id', subsectionIds);
                } else query = query.in('id', [0]);
            }

            if (showOnlyUnreviewed) query = query.or('reviewed.is.null,reviewed.eq.false');

            const { data, error, count } = await query.order('id', { ascending: true }).limit(limit);
            if (error) throw error;

            setQuestions(data || []);
            setTotalQuestions(count || 0);
        } catch (err) { setMessage(`Error: ${err.message}`); }
        finally { setLoading(false); }
    };

    const toggleReviewed = async (questionId, currentStatus) => {
        try {
            await supabase.from('questions').update({ reviewed: !currentStatus }).eq('id', questionId);
            setMessage('✓ Status updated'); loadFilterOptions(); fetchQuestions();
            setTimeout(() => setMessage(''), 2000);
        } catch (err) { setMessage(`Error: ${err.message}`); }
    };

    const markSubsectionReviewed = async () => {
        if (!selectedSubsection) {
            setMessage('Error: Please select a subsection first to mark it complete.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        if (!window.confirm('Are you sure you want to mark ALL questions in this subsection as reviewed? This action cannot be easily undone.')) {
            return;
        }

        try {
            setLoading(true);
            
            // 1. Get all question IDs in the subsection
            const { data: questionIdsData, error: fetchError } = await supabase
                .from('questions')
                .select('id')
                .eq('subsection_id', selectedSubsection);

            if (fetchError) throw fetchError;

            const questionIds = questionIdsData.map(q => q.id);

            if (questionIds.length === 0) {
                setMessage('No questions found in this subsection to mark reviewed.');
                setTimeout(() => setMessage(''), 3000);
                return;
            }

            // 2. Perform the bulk update
            const { error: updateError } = await supabase
                .from('questions')
                .update({ reviewed: true })
                .in('id', questionIds);

            if (updateError) throw updateError;

            setMessage(`✅ Successfully marked ${questionIds.length} questions in the subsection as reviewed.`);
            loadFilterOptions(); // Re-calculate and refresh subsection statuses
            fetchQuestions(); // Refresh the main question list
            setTimeout(() => setMessage(''), 4000);

        } catch (err) {
            setMessage(`Error marking subsection reviewed: ${err.message}`);
        } finally {
            setLoading(false);
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
            setMessage('✓ Saved successfully'); setEditingQuestion(null); loadFilterOptions(); fetchQuestions();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage(`Error: ${err.message}`); }
    };

    const deleteQuestion = async (questionId) => {
        if (!window.confirm('Delete this question?')) return;
        try { await supabase.from('questions').delete().eq('id', questionId);
            setMessage('✓ Deleted'); loadFilterOptions(); fetchQuestions(); setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage(`Error: ${err.message}`); }
    };

    const filteredQuestions = questions.filter(q =>
        !searchTerm || JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            <Filters
                courses={courses}
                subsections={subsections}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedSubsection={selectedSubsection}
                setSelectedSubsection={setSelectedSubsection}
                limit={limit}
                setLimit={setLimit}
                showOnlyUnreviewed={showOnlyUnreviewed}
                setShowOnlyUnreviewed={setShowOnlyUnreviewed}
                markSubsectionReviewed={markSubsectionReviewed} // Pass the new function
            />

            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
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

                {message && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                        message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}

                <QuestionList
                    filteredQuestions={filteredQuestions}
                    totalQuestions={totalQuestions}
                    loading={loading}
                    expandedQuestion={expandedQuestion}
                    setExpandedQuestion={setExpandedQuestion}
                    editingQuestion={editingQuestion}
                    setEditingQuestion={setEditingQuestion}
                    saveQuestion={saveQuestion}
                    deleteQuestion={deleteQuestion}
                    toggleReviewed={toggleReviewed}
                />
            </div>

            {editingQuestion && (
                <EditModal
                    editingQuestion={editingQuestion}
                    setEditingQuestion={setEditingQuestion}
                    saveQuestion={saveQuestion}
                />
            )}
        </div>
    );
}
export { supabase, MarkdownKaTeX };