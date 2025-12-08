export const metadata = {
  title: "Free Diagnostic Math Test | Personalized by Grade Level",
  description:
    "Get a custom diagnostic math test tailored to your student's current class and grade level. Built by a Georgia Tech tutor to identify strengths and weaknesses.",
  keywords: [
    "diagnostic math test",
    "free math placement test",
    "personalized math test",
    "math tutoring Stillwater",
    "Georgia Tech tutor",
    "middle school math",
    "high school math",
  ],
  openGraph: {
    title: "Free Diagnostic Math Test | Personalized by Grade Level",
    description:
      "This free diagnostic test is built to match your student’s level and uncover exactly where they need support.",
    url: "https://stillymathpro.com/diagnostic-test",
    siteName: "Stillwater Math Tutoring",
    type: "website",
  },
};

import DiagnosticForm from "./DiagnosticForm";

export default function DiagnosticTestPage() {
  return <DiagnosticForm />;
}
