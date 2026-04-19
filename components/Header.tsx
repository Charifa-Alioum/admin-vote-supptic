"use client";

import { useTheme } from "@/app/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <header
      className="flex items-center justify-between px-6 py-4
      bg-[var(--header-bg)]
      border-b border-white/10
      shadow-lg transition-colors duration-300"
    >
      {/* ☰ Ouvrir/fermer sidebar */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="text-white text-xl hover:text-[var(--color-gold)] transition-colors duration-200"
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* 👑 Titre */}
      <h1 className="text-lg font-semibold text-[var(--color-gold)] tracking-wide select-none">
        SUP'PTIC VOTE
      </h1>

      {/* 🎛️ Actions droite */}
      <div className="flex items-center gap-3">

        {/* 🌐 Switch langue */}
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

        {/* 🌙 Switch thème */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          className="p-2 rounded-lg bg-white/5 border border-white/10
            hover:bg-white/15 transition-all duration-200"
        >
          {theme === "dark" ? (
            <FaSun className="text-[var(--color-gold)] text-base" />
          ) : (
            <FaMoon className="text-[var(--color-gold)] text-base" />
          )}
        </button>

      </div>
    </header>
  );
}