// components/practice/LessonView.js
'use client'; 
// MUST be a Client Component because it uses useState (implicitly) and useRouter

import React, { useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <-- NEW IMPORT
// import { renderContent } from '@/lib/math/utils'; // Assuming this is available

// NOTE: This component no longer accepts onBack or onStartQuiz as props.
const LessonView = ({ section }) => { 
    const router = useRouter();

    // Use the actual practice sets fetched from Supabase
    const practiceSets = section.practiceSets || [];

    // The component uses the section data to build the navigation paths
    const currentLessonPath = `/practice/${section.moduleId}/${section.id}`;
    
    // Internal handler to navigate to the Quiz Page
    const handleStartQuiz = useCallback((setName) => {
        // Navigates to: /practice/[mId]/[sId]/quiz/[setName]
        router.push(`${currentLessonPath}/quiz/${setName}`);
    }, [router, currentLessonPath]);

    // Internal handler to navigate back to the main ModuleList
    const handleBackToModules = useCallback(() => {
        router.push('/practice');
    }, [router]);


    return (
        <div className="space-y-6">
            
            {/* Back Button - NOW uses the internal router handler */}
            <button
                onClick={handleBackToModules} // <-- UPDATED
                className="inline-flex items-center text-orange-600 hover:text-orange-800 p-2 rounded-lg"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Modules
            </button>

            {/* Lesson Header */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                <h1 className="text-3xl font-extrabold mb-2">{section.title}</h1>
                <p className="text-gray-600 italic">Lesson for {section.title}</p> 
            </div>

            {/* Lesson Content */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Lesson Material</h2>
                <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    // IMPORTANT: Ensure renderContent is available in this file's scope
                    dangerouslySetInnerHTML={{ __html: section.lessonContent ? renderContent(section.lessonContent) : 'No lesson content available.' }}
                />
            </div>

            {/* Practice Sets */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Practice Assignments</h2>
                <p className="text-gray-600 mb-6">
                    Select a practice set to begin your assignment. 
                </p>

                <div className="space-y-3">
                    {practiceSets.map((set) => (
                        <div
                            key={set.name}
                            className="flex justify-between items-center p-4 rounded-xl cursor-pointer transition duration-200 bg-gray-50 hover:bg-indigo-50 border border-gray-200"
                            // NAVIGATION CHANGE: Call internal handleStartQuiz
                            onClick={() => handleStartQuiz(set.name)}
                        >
                            <span className="font-medium text-gray-900">{set.name}</span>
                            <span className="text-sm text-indigo-600 font-semibold">
                                {set.questions.length} Questions
                            </span>
                        </div>
                    ))}
                    {!practiceSets.length && (
                        <p className="text-gray-500 italic">No practice sets found for this lesson.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonView;