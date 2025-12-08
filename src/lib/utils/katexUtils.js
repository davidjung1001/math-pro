// Subscript map for chemistry formulas
const subscriptMap = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
}

// Convert _numbers to subscripts
export const formatChemFormula = (text) =>
  text.replace(/_([0-9])/g, (_, digit) => subscriptMap[digit] || digit)


// --- NEW: convert ^ exponents to KaTeX-safe ---
const formatExponents = (text) => {
  return text

    // Case 1: ^{...}
    .replace(/\^\{([^}]+)\}/g, (_, exp) => `^{${exp}}`)

    // Case 2: ^digit  → ^{digit}
    .replace(/\^([0-9]+)/g, (_, exp) => `^{${exp}}`)

    // Case 3: ^[digit]  → ^{digit}
    .replace(/\^\[([0-9]+)\]/g, (_, exp) => `^{${exp}}`)

    // Case 4: standalone weird things like ^x → ^{x}
    .replace(/\^([A-Za-z])/g, (_, exp) => `^{${exp}}`)
}


// Preprocess text (KaTeX)
export const preprocessForKaTeX = (text) => {
  if (!text) return ''

  let clean = text
    .replace(/<[^>]*>/g, '')           // strip HTML
    .replace(/\*\*(.*?)\*\*/g, '$1')   // remove bold
    .replace(/\\text\{(.*?)\}/g, '$1') // unwrap \text{…}
    .replace(/\\\((.*?)\\\)/g, '$1')   // remove \( … \)
    .replace(/\\\[(.*?)\\\]/g, '$1')   // remove \[ … \]
    .replace(/\\%/g, '%')              // convert \% → %
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim()

  // NEW: handle ^ exponents
  clean = formatExponents(clean)

  // Chemistry: convert _digits → subscripts
  clean = formatChemFormula(clean)

  // Wrap LaTeX commands (\frac, \sqrt, \pi, etc.)
  const wrapLatexCommands = (str) => {
    return str.replace(
      /\\[a-zA-Z]+(?:\{[^{}]*\}(?:\{[^{}]*\})*)?/g,
      (match) => `$${match}$`
    )
  }

  clean = wrapLatexCommands(clean)

  // Replace \$ with text dollar
  clean = clean.replace(/\\\$/g, '\\textdollar ')

  return clean
}
