"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      title={language === "fr" ? "Switch to English" : "Passer en français"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
        border border-white/20 bg-white/5
        hover:bg-white/15 transition-all duration-200 text-white tracking-wider cursor-pointer"
    >
      <span>{language === "fr" ? "🇫🇷" : "🇬🇧"}</span>
      <span>{language === "fr" ? "FR" : "EN"}</span>
    </button>
  );
}