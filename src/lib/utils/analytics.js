export function getTrafficSource(referrer) {
  if (!referrer) return 'Direct'
  
  // Search Engines
  if (referrer.includes('google.com') || referrer.includes('google.')) return 'Google Search'
  if (referrer.includes('bing.com')) return 'Bing'
  if (referrer.includes('yahoo.com')) return 'Yahoo Search'
  if (referrer.includes('duckduckgo.com')) return 'DuckDuckGo'
  if (referrer.includes('baidu.com')) return 'Baidu'
  if (referrer.includes('yandex.com') || referrer.includes('yandex.ru')) return 'Yandex'
  if (referrer.includes('ask.com')) return 'Ask.com'
  if (referrer.includes('ecosia.org')) return 'Ecosia'
  if (referrer.includes('brave.com')) return 'Brave Search'
  if (referrer.includes('yahoo')) return 'Yahoo'
  
  // Social Media
  if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'Facebook'
  if (referrer.includes('instagram.com')) return 'Instagram'
  if (referrer.includes('twitter.com') || referrer.includes('t.co') || referrer.includes('x.com')) return 'Twitter/X'
  if (referrer.includes('linkedin.com')) return 'LinkedIn'
  if (referrer.includes('youtube.com')) return 'YouTube'
  if (referrer.includes('reddit.com')) return 'Reddit'
  if (referrer.includes('pinterest.com')) return 'Pinterest'
  if (referrer.includes('tiktok.com')) return 'TikTok'
  if (referrer.includes('snapchat.com')) return 'Snapchat'
  if (referrer.includes('discord.com') || referrer.includes('discord.gg')) return 'Discord'
  if (referrer.includes('telegram.org') || referrer.includes('t.me')) return 'Telegram'
  if (referrer.includes('whatsapp.com')) return 'WhatsApp'
  
  // Forums & Communities
  if (referrer.includes('stackoverflow.com')) return 'Stack Overflow'
  if (referrer.includes('stackexchange.com')) return 'Stack Exchange'
  if (referrer.includes('quora.com')) return 'Quora'
  if (referrer.includes('medium.com')) return 'Medium'
  if (referrer.includes('substack.com')) return 'Substack'
  
  // Education
  if (referrer.includes('github.com')) return 'GitHub'
  if (referrer.includes('wikipedia.org')) return 'Wikipedia'
  if (referrer.includes('coursera.org')) return 'Coursera'
  if (referrer.includes('khanacademy.org')) return 'Khan Academy'
  
  // News & Content
  if (referrer.includes('news.ycombinator.com')) return 'Hacker News'
  if (referrer.includes('producthunt.com')) return 'Product Hunt'
  
  // Get domain from other referrers
  try {
    const url = new URL(referrer)
    return url.hostname.replace('www.', '')
  } catch {
    return 'Other'
  }
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',    // e.g., "Nov"
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true       // local 12-hour format
  });
}
