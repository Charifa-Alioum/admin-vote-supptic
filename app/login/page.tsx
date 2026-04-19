"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace("/dashboard");
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("Connexion réussie 👑"));
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br
      from-[var(--color-deep-black)]
      via-[var(--color-supptic-blue)]
      to-[var(--color-deep-black)]"
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl shadow-2xl
        p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-gold)]">
            {t("SUP'PTIC ADMIN")}
          </h1>
          <p className="text-gray-300 text-sm mt-2">
            {t("Élection Miss & Master 👑")}
          </p>
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg
            bg-white/10 text-white placeholder-gray-400
            border border-white/10
            focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            placeholder={t("Mot de passe")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg
            bg-white/10 text-white placeholder-gray-400
            border border-white/10
            focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold
          bg-[var(--color-gold)] text-black
          hover:bg-[var(--color-supptic-blue)] hover:text-white
          transition-all duration-300 disabled:opacity-50"
        >
          {loading ? t("Connexion...") : t("Se connecter")}
        </button>

        <p className="text-center text-xs text-gray-400">
          {t("Accès réservé à l'administration")}
        </p>
      </form>
    </div>
  );
}