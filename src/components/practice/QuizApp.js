'use client'; 

import React, { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
// In a Next.js environment, this import should resolve correctly.
// For the purpose of this single-file editor, we assume its functionality.
import { useRouter } from 'next/navigation';
import katex from 'katex';
import 'katex/dist/katex.min.css';


const renderContent = (content) => {
    if (!content) return { __html: '' };

    let html = content;
    // Basic markdown conversion (e.g., **bold**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert KaTeX display mode ($$..$$)
    html = html.replace(/\$\$(.*?)\$\$/gs, (_, math) => {
        try {
            return katex.renderToString(math, { displayMode: true, throwOnError: false });
        } catch { return math; }
    });

    // Convert KaTeX inline mode ($..$)
    html = html.replace(/\$(.*?)\$/g, (_, math) => {
        try {
            return katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch { return math; }
    });

    return { __html: html };
};


const QuizApp = ({ section, practiceSetName }) => { 
    const router = useRouter()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizState, setQuizState] = useState('active'); // 'active' | 'finished'

    // --- Data Processing ---
    
    const selectedSet = useMemo(() => {
        return section.practiceSets?.find(set => set.name === practiceSetName);
    }, [section.practiceSets, practiceSetName]);

    const questions = useMemo(() => {
        return selectedSet?.questions.map((q, index) => {
            const options = {
                A: q.option_a ?? '', 
                B: q.option_b ?? '', 
                C: q.option_c ?? '', 
                D: q.option_d ?? ''
            };
            return {
                id: q.id || `q-${index}`,
                text: q.question_text ?? '',
                options: options,
                answer: q.correct_option ?? '', // e.g., 'A', 'B', 'C', or 'D'
            };
        }) ?? [];
    }, [selectedSet]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    
    // --- Navigation & Handlers (Fixed lessonPath) ---

    // Derived path: Fallback to /courses/ if slugs are missing to prevent error, 
    // but primarily use the intended dynamic route structure.
    const courseSlug = section.slug || 'unknown-course';
    const moduleId = section.moduleId || 'unknown-module';
    const sectionId = section.id || 'unknown-section';
    
    const lessonPath = `/courses/${courseSlug}/${moduleId}/${sectionId}`;
    
    
    const handleAnswerSelect = useCallback((optionKey) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionKey,
        }));
    }, [currentQuestion]);

    const handleNavigation = useCallback((direction) => {
        if (direction === 'next' && currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex, totalQuestions]);

    const handleSubmit = useCallback(() => {
        setQuizState('finished');
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, []);

    const calculateScore = useMemo(() => {
        let score = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] && userAnswers[q.id] === q.answer) {
                score++;
            }
        });
        return score;
    }, [questions, userAnswers]);

    if (!selectedSet || totalQuestions === 0) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl text-center text-gray-900 dark:text-gray-100 border border-red-400">
                <p className="text-2xl font-semibold text-red-600 mb-4">
                    Quiz Not Available
                </p>
                <p className="mb-6">
                    Error: The practice set "**{practiceSetName}**" was not found or contains no questions.
                </p>
                <button
                    onClick={() => router.push(lessonPath)}
                    className="mt-4 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold shadow-md transition duration-200"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 inline-block" /> Back to Lesson
                </button>
            </div>
        );
    }

    // --- Quiz Results View (Improved Design) ---

    if (quizState === 'finished') {
        const score = calculateScore;
        const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(0) : 0;
        const isExcellent = percentage >= 80;

        return (
            <div className="p-8 bg-white font-sans rounded-xl shadow-2xl border-t-4 border-indigo-600">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Quiz Complete!
                </h1>
                <p className="text-lg text-gray-600 mb-8">{section.title} - {practiceSetName}</p>
                
                {/* Score Summary Card */}
                <div className={`text-center p-8 rounded-xl mb-10 shadow-inner ${isExcellent ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                    <p className="text-7xl font-black mb-2" style={{color: isExcellent ? '#10B981' : '#EF4444'}}>
                        {percentage}%
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                        Score: {score} out of {totalQuestions} Correct
                    </p>
                    <p className={`mt-2 font-medium ${isExcellent ? 'text-green-600' : 'text-red-600'}`}>
                        {isExcellent ? "Great job! You've mastered this set." : "Keep practicing! Review the incorrect answers below."}
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-2">Detailed Review</h2>
                <div className="space-y-6">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer === q.answer;
                        const bgColor = isCorrect ? 'bg-green-50' : 'bg-red-50';
                        const ringColor = isCorrect ? 'ring-green-300' : 'ring-red-300';
                        const icon = isCorrect ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />;

                        return (
                            <div key={q.id} className={`p-5 rounded-xl shadow-sm ring-1 ${ringColor} ${bgColor} transition duration-300`}>
                                <div className="flex items-start mb-3">
                                    <span className="text-xl font-bold mr-3 text-indigo-700">Q{index + 1}.</span>
                                    <div className="prose max-w-none text-lg font-medium text-gray-800" dangerouslySetInnerHTML={renderContent(q.text)} />
                                </div>
                                
                                <ul className="space-y-3 pl-4 pt-3 border-t border-gray-200">
                                    {Object.entries(q.options).map(([key, value]) => {
                                        const isSelected = key === userAnswer;
                                        const isAnswer = key === q.answer;
                                        
                                        let optionClass = 'text-gray-700';
                                        let marker = <span className="w-6 h-6 mr-2"></span>;

                                        if (isAnswer) {
                                            optionClass = 'font-bold text-green-700 bg-green-200 p-2 rounded-lg';
                                            marker = <CheckCircle className="w-5 h-5 mr-2 text-green-600" />;
                                        } else if (isSelected) {
                                            optionClass = 'font-bold text-red-700 bg-red-200 p-2 rounded-lg';
                                            marker = <XCircle className="w-5 h-5 mr-2 text-red-600" />;
                                        } else {
                                            optionClass = 'text-gray-600 p-2';
                                        }

                                        return (
                                            <li key={key} className={`flex items-start text-base ${optionClass}`}>
                                                {marker}
                                                <span className="font-semibold mr-2">{key}.</span> 
                                                <div dangerouslySetInnerHTML={renderContent(value)} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-300 text-center">
                    <button
                        onClick={() => router.push(lessonPath)}
                        className="px-8 py-4 bg-indigo-600 text-white font-extrabold text-lg rounded-xl hover:bg-indigo-700 transition transform hover:scale-[1.01] shadow-lg shadow-indigo-500/50"
                    >
                        Return to Lesson Content
                    </button>
                </div>
            </div>
        );
    }

    // --- Active Quiz View (Improved Design) ---

    if (!currentQuestion) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /></div>; 

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const selectedOption = userAnswers[currentQuestion.id];

    return (
        <div className="p-8 bg-white min-h-[500px] font-sans rounded-xl shadow-2xl border-t-8 border-indigo-600">
            
            {/* Header and Progress */}
            <div className="mb-8 border-b pb-4">
                <button 
                    onClick={() => router.push(`/courses/${courseSlug}/${moduleId}/${section.subsectionSlug}`)}

                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Lesson
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{section.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{practiceSetName} Practice Set</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Question **{currentQuestionIndex + 1} of {totalQuestions}**</p>
            </div>
            
            {/* Question Text Card */}
            <div className="bg-indigo-50 p-6 rounded-xl mb-8 shadow-inner border border-indigo-200">
                <p className="text-2xl font-bold text-indigo-800 mb-4">Question {currentQuestionIndex + 1}</p>
                <div 
                    className="prose max-w-none text-gray-900 text-lg leading-relaxed" 
                    dangerouslySetInnerHTML={renderContent(currentQuestion.text)} 
                />
            </div>
            
            {/* Options */}
            <div className="space-y-4">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div
                        key={key}
                        onClick={() => handleAnswerSelect(key)}
                        className={`flex items-start p-5 rounded-xl border-2 cursor-pointer transition duration-150 shadow-md
                            ${selectedOption === key 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-300/50' 
                                : 'bg-white border-gray-300 hover:border-indigo-400 text-gray-800 hover:shadow-lg'}`
                        }
                    >
                        <span className={`text-xl font-bold mr-4 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 
                            ${selectedOption === key ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {key}
                        </span>
                        <div className={`text-base ${selectedOption === key ? 'text-white' : 'text-gray-800'}`} dangerouslySetInnerHTML={renderContent(value)} />
                    </div>
                ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl disabled:opacity-50 transition hover:bg-gray-300"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                </button>
                
                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedOption} 
                        className="px-8 py-3 bg-green-600 text-white font-extrabold rounded-xl disabled:opacity-50 hover:bg-green-700 transition transform hover:scale-[1.01] shadow-lg shadow-green-500/50"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => handleNavigation('next')}
                        disabled={!selectedOption}
                        className="px-6 py-3 bg-indigo-600 text-white font-extrabold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition transform hover:scale-[1.01] shadow-lg shadow-indigo-500/50"
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizApp;