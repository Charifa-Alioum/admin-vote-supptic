"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaMoon } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    router.push("/login");
  };

  // 🌙 Dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  // 🎯 Style actif
  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      pathname === path
        ? "bg-[var(--color-gold)] text-black shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed md:static z-20 inset-y-0 left-0 w-64 
      bg-gradient-to-b 
      from-[var(--color-deep-black)] 
      via-[var(--color-supptic-blue)] 
      to-[var(--color-deep-black)]
      text-white transform md:translate-x-0 transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-6">

        {/* 👑 Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[var(--color-gold)]">
            SUP’PTIC
          </h1>
          <p className="text-xs text-gray-400">Miss & Master</p>
        </div>

        {/* 🔹 Navigation */}
        <nav className="flex flex-col gap-3">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <FaTachometerAlt />
            Dashboard
          </Link>

          <Link href="/candidates" className={linkClass("/candidates")}>
            <FaUsers />
            Candidats
          </Link>
        </nav>

        {/* 🔻 Bottom */}
        <div className="mt-auto space-y-3">

          {/* 🌙 Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl 
            bg-white/5 border border-white/10
            hover:bg-white/10 transition"
          >
            <FaMoon className="text-[var(--color-gold)]" />
            Mode sombre
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl 
            bg-red-500/80 hover:bg-red-600 
            transition shadow-lg"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>

        </div>
      </div>
    </aside>
  );
}