import { Suspense } from "react";
import "./globals.css";
import "katex/dist/katex.min.css";

import Footer from "../components/Footer";
import SidebarNavigation from "@/components/SidebarNavigation";
import TrackingInitializer from "@/components/admin/TrackingInitializer";
import { Analytics } from "@vercel/analytics/next";
import UserHeader from "@/components/UserHeader";
import PageViewTracker from "@/components/admin/PageViewTracker";

export const metadata = {
  title: "Stilly Math Pro",
  description: "Free Printable Worksheets and Lessons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        
        {/* MUST BE IN SUSPENSE */}
        <Suspense fallback={null}>
          <TrackingInitializer />
        </Suspense>

        <PageViewTracker />

        {/* Header - Full width, not constrained */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <UserHeader />
        </div>

        {/* Main Layout Container */}
        <div className="flex min-h-screen w-full">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="no-print flex-shrink-0">
            <SidebarNavigation />
          </div>

          {/* Main Content - Takes remaining space */}
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="no-print bg-gray-50 border-t border-gray-200 w-full">
          <Footer />
          <Analytics />
        </footer>
      </body>
    </html>
  );
}