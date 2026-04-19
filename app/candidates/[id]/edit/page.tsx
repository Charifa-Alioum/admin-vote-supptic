"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/components/LanguageProvider";

export default function EditCandidatePage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState("");

  const categories = ["Mister", "Miss"];
  const classes = ["ADM 1", "ADM 2", "IT 1", "IT 2", "IPT 1", "IPT 2", "IPT 3", "ITT 1A", "ITT 1B", "ITT 2A", "ITT 2B", "ITT 3"];

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return console.error(error);

      setName(data.name);
      setCategory(data.category);
      setStudentClass(data.student_class);
      setCurrentPhoto(data.photo_url || "");
      setLoading(false);
    };

    fetchCandidate();
  }, [id]);

  const handleUpdate = async () => {
    let photo_url = currentPhoto;

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

    const { error } = await supabase
      .from("candidates")
      .update({ name, category, student_class: studentClass, photo_url })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("Candidat mis à jour ✨"));
      router.push("/candidates");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {t("Chargement...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6" style={{ color: "var(--foreground)" }}>

        <h1 className="text-3xl font-bold mb-6 text-[var(--color-gold)]">
          {t("✏️ Modifier candidat")}
        </h1>

        <div
          className="max-w-2xl rounded-2xl p-6 space-y-5 shadow-xl
          border border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <input
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
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {currentPhoto && (
            <img
              src={currentPhoto}
              alt={name}
              className="w-24 h-24 object-cover rounded-full border-2 border-[var(--color-gold)]"
            />
          )}

          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            style={{ color: "var(--text-muted)" }}
          />

          <button
            onClick={handleUpdate}
            className="w-full py-3 rounded-lg font-semibold
            bg-[var(--color-gold)] text-black
            hover:bg-[var(--color-supptic-blue)] hover:text-white
            transition-all duration-300"
          >
            {t("Enregistrer les modifications")}
          </button>
        </div>

      </div>
    </ProtectedRoute>
  );
}