export const metadata = {
  title: "SAT Math Tutoring – Personalized Strategy & Score Boosts",
  description:
    "Break down every SAT Math section with our targeted tutoring. We identify weaknesses using a diagnostic test and help students increase their math score by 100+ points.",
  alternates: {
    canonical: "https://www.stillymathpro.com/services/sat-math",
  },
};

import SatMathClient from './SATMathClient';

export default function SatMathPage() {
  return <SatMathClient />;
}
