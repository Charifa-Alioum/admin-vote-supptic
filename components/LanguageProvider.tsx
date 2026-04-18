"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<Record<string, string>>;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (text) => text,
  translateBatch: async () => ({}),
  isTranslating: false,
});

// Cache global pour éviter de re-traduire les mêmes textes
const translationCache: Record<string, Record<string, string>> = {
  fr: {},
  en: {},
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [isTranslating, setIsTranslating] = useState(false);

  // Cache local pour la session courante
  const cacheRef = useRef(translationCache);

  // Traduit un lot de textes via l'API Claude
  const translateBatch = useCallback(
    async (texts: string[]): Promise<Record<string, string>> => {
      if (language === "fr") {
        // Pas de traduction nécessaire, retourner tel quel
        return Object.fromEntries(texts.map((t) => [t, t]));
      }

      // Filtrer ce qui est déjà en cache
      const toTranslate = texts.filter(
        (text) => !cacheRef.current[language]?.[text]
      );

      if (toTranslate.length === 0) {
        return Object.fromEntries(
          texts.map((t) => [t, cacheRef.current[language][t] ?? t])
        );
      }

      setIsTranslating(true);

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: `Translate the following French UI texts to English.
Return ONLY a valid JSON object where keys are the original French texts and values are the English translations.
No explanation, no markdown, no code blocks — just raw JSON.

Texts to translate:
${JSON.stringify(toTranslate)}`,
              },
            ],
          }),
        });

        const data = await response.json();
        const raw = data.content?.[0]?.text ?? "{}";

        // Nettoyage sécurisé du JSON
        const cleaned = raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed: Record<string, string> = JSON.parse(cleaned);

        // Stocker dans le cache
        if (!cacheRef.current[language]) cacheRef.current[language] = {};
        Object.assign(cacheRef.current[language], parsed);
      } catch (err) {
        console.error("Translation error:", err);
        // En cas d'erreur, garder les textes originaux
        toTranslate.forEach((text) => {
          cacheRef.current[language][text] = text;
        });
      } finally {
        setIsTranslating(false);
      }

      return Object.fromEntries(
        texts.map((t) => [t, cacheRef.current[language]?.[t] ?? t])
      );
    },
    [language]
  );

  // Fonction synchrone pour accès rapide au cache
  const t = useCallback(
    (text: string): string => {
      if (language === "fr") return text;
      return cacheRef.current[language]?.[text] ?? text;
    },
    [language]
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, translateBatch, isTranslating }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}