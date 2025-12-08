'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Book, Layers, FileText, Laptop, Info, ChevronLeft, Beaker, Calculator, Home, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNavigation() {
  const [navData, setNavData] = useState([]);
  const [openCourse, setOpenCourse] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const [collapsed, setCollapsed] = useState(true); // Changed to true for default closed
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          sections (
            id,
            section_title,
            slug,
            subsections (
              id,
              subsection_title,
              slug
            )
          )
        `)
        .order('id');

      setNavData(data || []);
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  const getCourseIcon = (courseTitle) => {
    const title = courseTitle.toLowerCase();
    if (title.includes('chemistry')) return <Beaker size={18} />;
    if (title.includes('math')) return <Calculator size={18} />;
    if (title.includes('biology')) return <Book size={18} />;
    if (title.includes('physics')) return <Layers size={18} />;
    return <FileText size={18} />;
  };

  return (
    <>
      {/* MOBILE FLOATING BUTTON - Arrow pointing right */}
      <button
  onClick={() => setMobileOpen(true)}
  className="lg:hidden fixed top-12 -left-3 z-50 bg-indigo-500 text-white px-4 py-2 rounded-r-xl shadow-lg hover:bg-indigo-700 transition-all text-sm font-medium"
  aria-label="Open navigation menu"
>
  Other sections
</button>


      {/* MOBILE DRAWER SIDEBAR */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside 
            ref={mobileMenuRef} 
            className="absolute left-0 top-0 h-full w-72 bg-white text-gray-900 overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex-1 overflow-y-auto">
              <button
                onClick={() => setMobileOpen(false)}
                className="mb-4 text-gray-600 hover:text-gray-900 text-lg font-semibold"
              >
                Close ✕
              </button>

              <SidebarContent
                navData={navData}
                pathname={pathname}
                openCourse={openCourse}
                setOpenCourse={setOpenCourse}
                openSection={openSection}
                setOpenSection={setOpenSection}
                collapsed={false}
                getCourseIcon={getCourseIcon}
              />
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
              {/* AI Generator Button */}
              <Link
                href="/ai-tools"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-center py-3 px-4 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-md"
              >
                <Zap size={18} />
                AI Generator
              </Link>

              {/* Free Assessment Button */}
              <Link
                href="/diagnostic-test"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Free Assessment
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`
          hidden lg:flex lg:flex-col sticky top-0 bg-white text-gray-900 border-r border-gray-200 transition-all duration-300 shadow-sm
          ${collapsed ? "w-16" : "w-72"}
        `}
        style={{ height: '100vh' }}
      >
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight size={20} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarContent
            navData={navData}
            pathname={pathname}
            openCourse={openCourse}
            setOpenCourse={setOpenCourse}
            openSection={openSection}
            setOpenSection={setOpenSection}
            collapsed={collapsed}
            getCourseIcon={getCourseIcon}
          />
        </div>

        {/* Desktop CTA Buttons */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
            {/* AI Generator Button */}
            <Link
              href="/ai-tools"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-center py-3 px-4 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-md"
            >
              <Zap size={18} />
              AI Generator
            </Link>

            {/* Free Assessment Button */}
            <Link
              href="/diagnostic-test"
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Free Assessment
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

function SidebarContent({
  navData,
  pathname,
  openCourse,
  setOpenCourse,
  openSection,
  setOpenSection,
  collapsed,
  getCourseIcon,
}) {
  return (
    <>
      {/* Home Link at the top */}
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ease-in-out text-gray-700 mb-4 font-medium"
        title="Home"
      >
        <Home size={18} />
        {!collapsed && <span>Home</span>}
      </Link>

      <div className="mb-4 border-t border-gray-300"></div>

      <h2 className={`text-sm font-bold mb-4 text-gray-500 uppercase tracking-wide ${collapsed ? "hidden" : ""}`}>
        Worksheet Library
      </h2>

      {navData.map(course => {
        const isCourseOpen = openCourse === course.id;

        return (
          <div key={course.id} className="mb-3">
            <button
              onClick={() => setOpenCourse(isCourseOpen ? null : course.id)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ease-in-out text-gray-700 hover:text-gray-900"
              title={collapsed ? course.title : undefined}
            >
              <span className="flex items-center gap-3">
                {getCourseIcon(course.title)}
                {!collapsed && <span className="font-medium">{course.title}</span>}
              </span>
              {!collapsed && (
                <ChevronRight size={16} className={`transition-transform ${isCourseOpen ? 'rotate-90' : ''}`} />
              )}
            </button>

            {isCourseOpen && !collapsed && (
              <div className="ml-3 mt-2 space-y-2 border-l-2 border-gray-300 pl-3">
                {course.sections.map(section => {
                  const isSectionOpen = openSection === section.id;

                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => setOpenSection(isSectionOpen ? null : section.id)}
                        className="flex items-center justify-between w-full px-2 py-1.5 rounded hover:bg-gray-100 text-sm transition-colors duration-200 ease-in-out text-gray-600 hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2">
                          <Layers size={14} />
                          <span>{section.section_title}</span>
                        </span>
                        <ChevronRight size={14} className={`transition-transform ${isSectionOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {isSectionOpen && (
                        <div className="ml-3 mt-1 space-y-1 border-l border-gray-300 pl-3">
                          {section.subsections.map(sub => {
                            const highlight = pathname.includes(`/${course.slug}/${section.slug}/${sub.slug}`);

                            return (
                              <Link
                                key={sub.id}
                                href={`/worksheets/free-worksheets/${course.slug}/${section.slug}/${sub.slug}`}
                                className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors duration-200 ease-in-out ${
                                  highlight
                                    ? "bg-indigo-600 text-white font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              >
                                <FileText size={12} />
                                {sub.subsection_title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div className="my-6 border-t border-gray-300"></div>

      {!collapsed && (
        <>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Need Help? Or Get Ahead
          </h3>
          <Link
            href="/about"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ease-in-out text-gray-700 hover:text-gray-900 mb-2"
          >
            <Info size={18} />
            <span>Tutoring</span>
          </Link>

          <div className="my-6 border-t border-gray-300"></div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Practice Online
          </h3>
          <Link
            href="/courses"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ease-in-out text-gray-700 hover:text-gray-900"
          >
            <Laptop size={18} />
            <span>Digital Modules</span>
          </Link>
        </>
      )}
    </>
  );
}