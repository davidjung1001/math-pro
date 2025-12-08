"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getHybridTracking } from "@/lib/tracking/sessionStrategies";

export default function TrackingInitializer() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hostname === "localhost") return;

    const run = async () => {
      const { visitorId, sessionId } = getHybridTracking();
      if (!visitorId || !sessionId) return;

      const now = new Date().toISOString();

      // Check if session exists
      const { data: existingSession } = await supabase
        .from("user_sessions")
        .select("session_id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingSession) {
        await supabase
          .from("user_sessions")
          .update({ last_activity_at: now })
          .eq("session_id", sessionId);
      } else {
        await supabase.from("user_sessions").insert({
          visitor_id: visitorId,
          session_id: sessionId,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: document.referrer || null,
          last_activity_at: now,
        });
      }
    };

    run();
  }, []); // REMOVED pathname - only run once on mount

  return null;
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)/.test(ua)) return "Mobile";
  return "Desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown";
}

function getOS() {
  const p = navigator.platform || navigator.userAgentData?.platform || "Unknown";
  if (p.includes("Win")) return "Windows";
  if (p.includes("Mac")) return "MacOS";
  if (p.includes("Linux")) return "Linux";
  if (/iPhone|iPad|iPod/.test(p)) return "iOS";
  if (/Android/.test(p)) return "Android";
  return p;
}