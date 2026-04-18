"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      // ✅ Tout utilisateur connecté dans Supabase est autorisé
      // (la restriction par email a été retirée — voir objectif 3)
      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--foreground)] text-sm opacity-60">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex h-screen bg-[var(--background)] transition-colors duration-300">
      {/* ✅ sidebarOpen correctement passé */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ setSidebarOpen correctement passé */}
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}