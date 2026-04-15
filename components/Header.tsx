"use client";

import { useTheme } from "@/app/ThemeProvider";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";

export default function Header({ setSidebarOpen }: any) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="flex items-center justify-between px-6 py-4
      bg-[var(--color-deep-black)] 
      border-b border-white/10
      shadow-lg"
    >
      {/* ☰ Bouton */}
      <button
        onClick={() => setSidebarOpen((prev: boolean) => !prev)}
        className="text-white text-xl hover:text-[var(--color-gold)] transition"
      >
        <FaBars />
      </button>

      {/* 👑 Title */}
      <h1 className="text-lg font-semibold text-[var(--color-gold)] tracking-wide">
        SUP’PTIC VOTE
      </h1>

      {/* 🌙 Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg 
        bg-white/5 border border-white/10
        hover:bg-white/10 transition"
      >
        {theme === "dark" ? (
          <FaSun className="text-[var(--color-gold)]" />
        ) : (
          <FaMoon className="text-[var(--color-supptic-blue)]" />
        )}
      </button>
    </header>
  );
}
