// components/YouTubeEmbed.js
import React from 'react';

// Props: videoId (the YouTube ID) and title (for accessibility)
export default function YouTubeEmbed({ videoId, title }) {
  // Use the privacy-enhanced domain (youtube-nocookie.com)
  // 
  // Parameters explained:
  // 1. modestbranding=1: Shows only the YouTube text logo in the controls, not the full logo.
  // 2. rel=0: Prevents related videos from the same channel from showing at the end. (Required for modestbranding to work effectively.)
  // 3. showinfo=0: Hides the video title and uploader at the top before playback. (Crucial for a clean look.)
  // 4. fs=0: Hides the full-screen button (optional, but makes it look less like the standard player).
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0&showinfo=0&fs=0`;

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
      {/* 56.25% padding top = 16:9 aspect ratio */}
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-2xl"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // Since we used fs=0, you can technically remove the allowFullScreen attribute
      ></iframe>
    </div>
  );
}