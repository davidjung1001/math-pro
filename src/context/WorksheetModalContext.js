// context/WorksheetModalContext.js
"use client";
import { createContext, useState } from "react";
import WorksheetPreviewModal from "@/components/worksheets/WorksheetPreviewModal";

export const WorksheetModalContext = createContext();

export function WorksheetModalProvider({ children }) {
  const [previewData, setPreviewData] = useState(null);
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [includeChoices, setIncludeChoices] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const openModal = (data) => {
    setPreviewData(data);
    setIsPremium(!!data.isPremium);
  };

  const closeModal = () => {
    setPreviewData(null);
  };

  return (
    <WorksheetModalContext.Provider value={{ openModal }}>
      {children}
      {previewData && (
        <WorksheetPreviewModal
          previewData={previewData}
          includeAnswers={includeAnswers}
          setIncludeAnswers={setIncludeAnswers}
          includeChoices={includeChoices}
          setIncludeChoices={setIncludeChoices}
          generating={generating}
          isPremium={isPremium}
          onClose={closeModal}
          onDownload={() => closeModal()}
        />
      )}
    </WorksheetModalContext.Provider>
  );
}