'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SidebarNavigation from '@/components/SidebarNavigation';

export default function MobileSidebarWrapper() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-emerald-600 text-white shadow-lg lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative w-64 h-full bg-gray-900 text-gray-200 overflow-y-auto p-4">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarNavigation />
          </div>
        </div>
      )}
    </>
  );
}
