// lib/normalizeMathDelimiters.js
export function normalizeMathDelimiters(raw) {
  if (!raw) return ''
  
  // 1. Collapse double-escaped backslashes (common when DB stored escaped strings)
  let s = String(raw).replace(/\\\\/g, '\\')

  // 2. Unify patterns: ( \ ... \ ) and [ \ ... \ ] to $...$ and $$...$$
  
  // Pattern 1: Match Display Math (Block) - Captures any content between brackets
  // E.g., [ \frac{1}{2} \ ] or [\frac{1}{2}] or [ \frac{1}{2}]
  s = s.replace(/\[\s*([\s\S]+?)\s*\]/g, (_, inner) => {
      let content = inner.trim();
      // Remove optional leading/trailing backslashes inside the brackets if they exist
      content = content.replace(/^\\/, '').replace(/\\$/, '');
      return `$$${content.trim()}$$`;
  });

  // Pattern 2: Match Inline Math (Span) - Captures any content between parentheses
  // E.g., ( \frac{1}{2} \ ) or (\frac{1}{2}) or ( \frac{1}{2})
  s = s.replace(/\(\s*([\s\S]+?)\s*\)/g, (_, inner) => {
      let content = inner.trim();
      // Remove optional leading/trailing backslashes inside the parentheses if they exist
      content = content.replace(/^\\/, '').replace(/\\$/, '');
      return `$${content.trim()}$`;
  });

  // NOTE: The previous third and fourth regexes are no longer needed, 
  // as the unified approach above covers all common bracketed variants.

  return s.trim()
}