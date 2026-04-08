"use client";

import { createContext, useState, ReactNode } from "react";

// Types du contexte
interface LanguageContextType {
  language: "fr" | "en";
  setLanguage: (lang: "fr" | "en") => void;
}

// Création du contexte
export const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
});

// Provider à englober autour de ton app/admin
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}