"use client";

import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
    >
      {language === "fr" ? "FR" : "EN"}
    </button>
  );
}