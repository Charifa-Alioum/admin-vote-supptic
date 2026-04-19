"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/components/LanguageProvider";

export default function CreateCandidatePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const { t } = useLanguage();

  const categories = ["Mister", "Miss"];
  const classes = ["ADM 1", "ADM 2", "IT 1", "IT 2", "IPT 1", "IPT 2", "IPT 3", "ITT 1A", "ITT 1B", "ITT 2A", "ITT 2B", "ITT 3"];

  const fetchCandidates = async () => {
    const { data } = await supabase.from("candidates").select("*");
    setCandidates(data || []);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleAdd = async () => {
    if (!name || !category || !studentClass) {
      return toast.error(t("Remplis tous les champs"));
    }

    const exists = candidates.some(
      (c) =>
        c.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        c.student_class === studentClass
    );

    if (exists) {
      return toast.error(t("Ce candidat existe déjà"));
    }

    let photo_url = "";

    if (photoFile) {
      const fileName = `${Date.now()}.${photoFile.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("candidates-photos")
        .upload(fileName, photoFile);

      if (uploadError) return toast.error(uploadError.message);

      const { data } = supabase.storage
        .from("candidates-photos")
        .getPublicUrl(fileName);

      photo_url = data.publicUrl;
    }

    const { error } = await supabase.from("candidates").insert({
      name,
      category,
      student_class: studentClass,
      votes: 0,
      photo_url,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("Candidat ajouté 🎉"));
      setName("");
      setCategory("");
      setStudentClass("");
      setPhotoFile(null);
      fetchCandidates();
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6" style={{ color: "var(--foreground)" }}>

        <h1 className="text-3xl font-bold mb-6 text-[var(--color-gold)]">
          {t("✨ Ajouter un candidat")}
        </h1>

        <div
          className="max-w-2xl rounded-2xl p-6 space-y-5 shadow-xl
          border border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <input
            type="text"
            placeholder={t("Nom du candidat")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--border)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
            style={{ background: "var(--surface-alt)", color: "var(--foreground)" }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--border)]"
            style={{ background: "var(--surface-alt)", color: "var(--foreground)" }}
          >
            <option value="">{t("Choisir catégorie")}</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--border)]"
            style={{ background: "var(--surface-alt)", color: "var(--foreground)" }}
          >
            <option value="">{t("Choisir classe")}</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            style={{ color: "var(--text-muted)" }}
          />

          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-lg font-semibold
            bg-[var(--color-gold)] text-black
            hover:bg-[var(--color-supptic-blue)] hover:text-white
            transition-all duration-300"
          >
            {t("Ajouter le candidat")}
          </button>
        </div>

      </div>
    </ProtectedRoute>
  );
}