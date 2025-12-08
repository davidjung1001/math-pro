// src/app/worksheets/layout.js
import { WorksheetModalProvider } from "@/context/WorksheetModalContext";

export default function WorksheetsLayout({ children }) {
  return <WorksheetModalProvider>{children}</WorksheetModalProvider>;
}