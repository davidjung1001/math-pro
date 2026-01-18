"use client";

import { useEffect, useRef } from "react";
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
  const trackedRef = useRef(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hostname === "localhost") return;

    const { visitorId, sessionId } = getHybridTracking();
    if (!visitorId || !sessionId) return;

    const key = `${sessionId}:${pathname}`;
    if (trackedRef.current.has(key)) return;

    trackedRef.current.add(key);

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("page_views").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        user_id: user?.id || null,
        user_email: user?.email || null,
        page_path: pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        course_name: courseName,
        section_name: sectionName,
        subsection_name: subsectionName,
        quiz_id: quizId,
        viewed_at: new Date().toISOString(),
      });
    })();
  }, [pathname]);

  return null;
}
