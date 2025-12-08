// components/practice/ModuleList.js
'use client'; 
// Keep 'use client' because of state (openModuleId) and interactivity (toggleModule).

import React, { useState } from 'react';
import Link from 'next/link'; // Import the Next.js Link component

// 1. Component now receives 'modules' as a prop, NO local fetching or 'loading' state
const ModuleList = ({ modules }) => { 
  const [openModuleId, setOpenModuleId] = useState(null);

  // You no longer need to check for 'loading' here since the parent Server Component handles it.
  // The 'modules' prop will be defined when this component renders.

  const toggleModule = (moduleId) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  // 2. The main page title and layout structure remains the same
  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-orange-500 pb-3 uppercase tracking-wider">
        Stillwater Math Center
      </h1>

      {modules.map(module => (
        <div 
          key={module.id}
          className="mb-6 bg-white rounded-none shadow-lg overflow-hidden border-2 border-gray-900"
        >
          {/* Module Toggle remains the same */}
          <button
            onClick={() => toggleModule(module.id)}
            className="w-full p-5 flex justify-between items-center text-left bg-gray-800 text-white font-bold text-xl uppercase tracking-tight border-b-2 border-gray-900 hover:bg-orange-500 hover:text-gray-900 transition duration-150 focus:outline-none"
          >
            {module.title}
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ${openModuleId === module.id ? 'rotate-180 text-orange-400' : 'rotate-0 text-white'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openModuleId === module.id ? 'max-h-screen p-4 sm:p-6' : 'max-h-0'}`}>
            <h4 className="text-lg font-bold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2 uppercase tracking-wide">
              Sections:
            </h4>
            <div className="space-y-4">
              {module.subsections.map(section => (
                <div
                  key={section.id}
                  className="p-4 bg-white rounded-none border border-gray-300 shadow-sm transition duration-100 ease-in-out hover:border-orange-500 border-l-4"
                >
                  <span className="text-xl text-gray-900 font-semibold">{section.title}</span>
                  <p className="text-sm text-gray-500 italic mb-3">{section.description}</p>

                  {/* 3. Button is replaced with Next.js Link */}
                  <Link
                    // Dynamic route structure: /practice/[moduleId]/[sectionId]
                    href={`/practice/${module.id}/${section.id}`} 
                    className="mt-2 w-full inline-block text-center px-4 py-3 text-base font-bold text-white bg-orange-500 rounded-none shadow-md hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition transform hover:scale-[1.005] uppercase tracking-wider border-2 border-gray-900"
                  >
                    View Lesson & Practice
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleList;