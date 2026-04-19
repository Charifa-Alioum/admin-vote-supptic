"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, Language } from "@/components/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (text) => text,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  // Restaurer la langue depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored === "fr" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  // Lookup instantané dans le dictionnaire — aucun appel API
  const t = useCallback(
    (text: string): string => {
      return translations[language][text] ?? text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}