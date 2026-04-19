"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔓 Déconnexion pour inactivité
  const handleInactivityLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast("⏱ Session expirée par inactivité. Veuillez vous reconnecter.", {
      icon: "🔒",
      duration: 4000,
    });
    router.push("/login");
  }, [router]);

  // ⏱ Réinitialise le timer à chaque activité
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_LIMIT_MS);
  }, [handleInactivityLogout]);

  // 👂 Écoute les événements d'activité utilisateur
  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    // Démarre le timer dès le montage
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  // 🔐 Vérification de session + écoute des changements d'auth
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // 👁 Détecte le retour sur l'onglet (visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        // Vérifie si la session est toujours valide au retour
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          toast("⏱ Session expirée. Veuillez vous reconnecter.", {
            icon: "🔒",
            duration: 4000,
          });
          router.push("/login");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Vérification de la session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}