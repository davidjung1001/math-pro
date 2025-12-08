// app/services/subject-tutoring/page.js

import SubjectTutoringClient from "./SubjectTutoringClient";

export const metadata = {
  title: "Subject Tutoring - Math, Chemistry & Physics | StillyMathPro",
  description:
    "Master Math, Chemistry, and Physics with personalized tutoring. Get expert guidance from someone who excelled in AP and college-level courses.",
  alternates: {
    canonical: "https://www.stillymathpro.com/services/subject-tutoring",
  },
};

export default function SubjectTutoringPage() {
  return <SubjectTutoringClient />;
}
