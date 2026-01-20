"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getHybridTracking } from "@/lib/tracking/sessionStrategies";

// Bot detection utility
function isLikelyBot() {
  if (typeof window === "undefined") return true;

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Common bot patterns
  const botPatterns = [
    'bot', 'crawl', 'spider', 'scrape', 'slurp', 'mediapartners',
    'adsbot', 'bingbot', 'googlebot', 'baiduspider', 'yandex',
    'duckduckbot', 'teoma', 'ia_archiver', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora',
    'showyoubot', 'outbrain', 'pinterest', 'developers.google.com',
    'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
    'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
    'nuzzel', 'discordbot', 'qwantify', 'pinterestbot', 'bitrix',
    'headless', 'phantomjs', 'slimerjs', 'selenium', 'webdriver'
  ];

  // Check user agent for bot patterns
  if (botPatterns.some(pattern => userAgent.includes(pattern))) {
    return true;
  }

  // Check for headless browsers
  if (navigator.webdriver) {
    return true;
  }

  // Check for missing properties that real browsers have
  if (!navigator.language || !navigator.languages) {
    return true;
  }

  // Check for suspiciously fast page loads (bots often don't wait)
  if (performance.timing && performance.timing.domContentLoadedEventEnd) {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    if (loadTime < 50) { // Less than 50ms is suspiciously fast
      return true;
    }
  }

  // Check for plugins (most bots have none)
  if (navigator.plugins && navigator.plugins.length === 0) {
    // Additional check: real browsers usually have some plugins
    // But mobile browsers might not, so we check screen size too
    if (window.screen.width > 1024 && window.screen.height > 768) {
      return true;
    }
  }

  return false;
}

// Check if interaction seems human-like
function hasHumanInteraction() {
  // Check if user has moved mouse, scrolled, or touched
  return new Promise((resolve) => {
    let hasInteracted = false;
    const timeout = setTimeout(() => resolve(hasInteracted), 3000); // Wait 3 seconds

    const markInteraction = () => {
      hasInteracted = true;
      clearTimeout(timeout);
      resolve(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', markInteraction);
      window.removeEventListener('scroll', markInteraction);
      window.removeEventListener('touchstart', markInteraction);
      window.removeEventListener('click', markInteraction);
      window.removeEventListener('keydown', markInteraction);
    };

    window.addEventListener('mousemove', markInteraction, { once: true });
    window.addEventListener('scroll', markInteraction, { once: true });
    window.addEventListener('touchstart', markInteraction, { once: true });
    window.addEventListener('click', markInteraction, { once: true });
    window.addEventListener('keydown', markInteraction, { once: true });
  });
}

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

    // Immediate bot check
    if (isLikelyBot()) {
      console.log("Bot detected, skipping tracking");
      return;
    }

    const { visitorId, sessionId } = getHybridTracking();
    if (!visitorId || !sessionId) return;

    const key = `${sessionId}:${pathname}`;
    if (trackedRef.current.has(key)) return;

    trackedRef.current.add(key);

    (async () => {
      // Wait for human interaction before logging
      const hasInteraction = await hasHumanInteraction();
      
      if (!hasInteraction) {
        console.log("No human interaction detected, skipping tracking");
        trackedRef.current.delete(key); // Remove from tracked so it can retry
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      // Additional metadata for bot analysis
      const metadata = {
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
      };

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
        metadata: metadata, // Store metadata as JSONB column
        is_likely_human: true, // Flag that passed bot checks
      });
    })();
  }, [pathname, courseName, sectionName, subsectionName, quizId]);

  return null;
}