// app/services/summer-programs/page.js

import SummerProgramsClient from "./SummerProgramsClient";

export const metadata = {
  title: "Summer Enrichment Programs – Get Ahead & Bridge Learning Gaps",
  description:
    "Join customized summer programs to get ahead on next year's topics or bridge learning gaps. Personalized learning to keep you confident and prepared.",
  
};

export default function SummerProgramsPage() {
  return <SummerProgramsClient />;
}
