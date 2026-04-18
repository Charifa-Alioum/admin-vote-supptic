"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/app/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import toast from "react-hot-toast";

import {
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t("Déconnexion réussie"));
    router.push("/login");
  };

  // 🔥 Fermer menu (mobile UX)
  const handleNavigation = () => setSidebarOpen(false);

  // 🎯 Style lien actif/inactif
  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      pathname === path
        ? "bg-[var(--color-gold)] text-black font-semibold shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* 🔥 Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed md:static z-20 inset-y-0 left-0 w-64
          bg-gradient-to-b
          from-[var(--sidebar-bg-from)]
          via-[var(--sidebar-bg-via)]
          to-[var(--sidebar-bg-to)]
          text-white transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-6">

          {/* 👑 Logo */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-[var(--color-gold)]">
              SUP'PTIC
            </h1>
            <p className="text-xs text-gray-400">Miss &amp; Master</p>
          </div>

          {/* 🔹 Navigation */}
          <nav className="flex flex-col gap-3">
            <Link href="/dashboard" className={linkClass("/dashboard")} onClick={handleNavigation}>
              <FaTachometerAlt />
              {t("Dashboard")}
            </Link>

            <Link href="/candidates" className={linkClass("/candidates")} onClick={handleNavigation}>
              <FaUsers />
              {t("Candidats")}
            </Link>
          </nav>

          {/* 🔻 Bottom */}
          <div className="mt-auto space-y-3">

            {/* 🌙 Dark mode — synchronisé avec le contexte */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                hover:bg-white/10 transition-all duration-200"
            >
              {theme === "dark" ? (
                <FaSun className="text-[var(--color-gold)]" />
              ) : (
                <FaMoon className="text-[var(--color-gold)]" />
              )}
              <span>{t(theme === "dark" ? "Mode clair" : "Mode sombre")}</span>
            </button>

            {/* 🚪 Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                bg-red-500/80 hover:bg-red-600
                transition-all duration-200 shadow-lg"
            >
              <FaSignOutAlt />
              {t("Déconnexion")}
            </button>

          </div>
        </div>
      </aside>
    </>
  );
}