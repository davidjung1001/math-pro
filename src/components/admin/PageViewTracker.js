"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getHybridTracking } from "@/lib/tracking/sessionStrategies";

export default function PageViewTracker({
  courseName = null,
  sectionName = null,
  subsectionName = null,
  quizId = null
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hostname === "localhost") return;

    const logPageViewWhenReady = async () => {
      const { visitorId, sessionId } = getHybridTracking();
      if (!visitorId || !sessionId) return;

      const interval = setInterval(async () => {
        const { data: exists } = await supabase
          .from("user_sessions")
          .select("session_id")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (exists) {
          clearInterval(interval);

          // Get current logged-in user
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id || null;
          const userEmail = user?.email || null;

          await supabase.from("page_views").insert({
            session_id: sessionId,
            visitor_id: visitorId,
            user_id: userId,
            user_email: userEmail,
            page_path: pathname,
            page_title: document.title,
            referrer: document.referrer || null,
            course_name: courseName,
            section_name: sectionName,
            subsection_name: subsectionName,
            quiz_id: quizId,
            viewed_at: new Date().toISOString(),
          });
        }
      }, 200);
    };

    logPageViewWhenReady();
  }, [pathname, courseName, sectionName, subsectionName, quizId]);

  return null;
}
