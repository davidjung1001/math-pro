// SUPER CLEAN KATEX PREPROCESSOR
// Only fixes subscripts and superscripts.
// DOES NOT wrap anything in $
// DOES NOT touch arrows, fractions, LaTeX commands, reactions, etc.

// Convert _number → _{number}
const fixSubscripts = (text) => {
  return text.replace(/_([0-9]+)/g, '_{$1}');
};

// Convert ^number or ^+/- → ^{...}
const fixSuperscripts = (text) => {
  return text
    // ^2 → ^{2}
    .replace(/\^([0-9]+)/g, '^{$1}')
    // ^+ or ^- → ^{+} or ^{-}
    .replace(/\^([+-])/g, '^{$1}');
};

// MAIN FUNCTION
export const preprocessForKaTeX = (text) => {
  if (!text) return "";
  
  let output = text;

  // Apply basic formatting
  output = fixSubscripts(output);
  output = fixSuperscripts(output);

  // Return CLEAN result
  return output;
};
