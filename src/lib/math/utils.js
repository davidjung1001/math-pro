// src\lib\math\utils.js

// Utility function to safely render content with LaTeX-style math for simple cases
// This performs simple string replacement for basic equations and symbols for display.
// NOTE: For robust mathematical rendering, consider integrating a library like KaTeX or MathJax.
export const renderContent = (content) => {
    
    // 🛡️ THE FIX: Ensure content is a string. If it's undefined or null, default to an empty string ('').
    const safeContent = content ?? '';

    // Replace LaTeX-style inline math with a simple span for styling
    let html = safeContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Simple replacement for basic equations and symbols for display purposes.
    html = html.replace(/\$(.*?)\$/g, '<span class="font-serif italic text-lg text-blue-800">$1</span>');
    html = html.replace(/\\pi/g, '&pi;');
    html = html.replace(/\\approx/g, '&asymp;');
    html = html.replace(/\\times/g, '&times;');
    html = html.replace(/\\neq/g, '&ne;');
    html = html.replace(/x\^2/g, 'x&sup2;');
    html = html.replace(/r\^2/g, 'r&sup2;');

    return html;
};