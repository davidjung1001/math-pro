// components/YouTubeEmbed.jsx
import React from 'react';

// Props: videoId (the YouTube ID) and title (for accessibility)
export default function YouTubeEmbed({ videoId, title }) {
  // Construct the secure, parameter-optimized embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`;

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
      {/* 56.25% padding top = 16:9 aspect ratio */}
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-2xl"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}