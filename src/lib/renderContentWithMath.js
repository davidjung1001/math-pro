// FILE: lib/renderContentWithMath.js
// ... existing imports

export const renderContent = (content) => {
    if (!content) return { __html: '' }

    const fixed = fixMathSymbols(content)
    let html = fixed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // --- NEW PRE-PROCESSING STEP ---
    // If you are stuck with ( math \times ) style, replace it with $ math \times $
    // This regex looks for content in parentheses that contains a math command (\times, \div, etc.)
    // You might need to adjust the content inside the parentheses to be specific.
    html = html.replace(/\((.*?)(\\(times|div|frac|sqrt)).*?\)/g, '$$$$1$$$$')
    // --------------------------------
    
    // Handle display math $$...$$
    html = html.replace(/\$\$(.*?)\$\$/gs, (_, math) => {
        try { return katex.renderToString(math, { displayMode: true, throwOnError: false }) }
        catch { return math }
    })

    // Handle inline math $...$
    html = html.replace(/\$(.*?)\$/g, (_, math) => {
        try { return katex.renderToString(math, { displayMode: false, throwOnError: false }) }
        catch { return math }
    })

    // ... (rest of the \(...\) and \[...\] logic)

    return { __html: html }
}