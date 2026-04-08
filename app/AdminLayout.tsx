"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/app/ThemeProvider";

const ADMIN_EMAIL = "alioumcharifa307@gmail.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login"); // redirige si pas connecté
        return;
      }

      if (data.user.email !== ADMIN_EMAIL) {
        alert("Accès refusé");
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!authorized) return null;

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="flex-1 flex flex-col">
          {/* Header avec toggle dark mode */}
          <Header setSidebarOpen={() => {}} showThemeToggle />

          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}