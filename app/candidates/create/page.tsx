"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateCandidatePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  const categories = ["Master", "Miss"];
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
      return toast.error("Remplis tous les champs");
    }

    const exists = candidates.some(
      (c) =>
        c.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        c.student_class === studentClass
    );

    if (exists) {
      return toast.error("Ce candidat existe déjà");
    }

    let photo_url = "";

    if (photoFile) {
      const fileName = `${Date.now()}.${photoFile.name.split(".").pop()}`;

      const { error: uploadError } = await supabase.storage
        .from("candidates-photos")
        .upload(fileName, photoFile);

      if (uploadError) {
        return toast.error(uploadError.message);
      }

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
      toast.success("Candidat ajouté 🎉");
      setName("");
      setCategory("");
      setStudentClass("");
      setPhotoFile(null);
      fetchCandidates();
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-[#020617] text-white">

        <h1 className="text-3xl font-bold mb-6 text-yellow-400">
          ✨ Ajouter un candidat
        </h1>

        <div className="max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">

          {/* Nom */}
          <input
            type="text"
            placeholder="Nom du candidat"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
          />

          {/* Catégorie */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700"
          >
            <option value="">Choisir catégorie</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Classe */}
          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700"
          >
            <option value="">Choisir classe</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Photo */}
          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="text-gray-300"
          />

          {/* Bouton */}
          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-lg font-semibold 
            bg-gradient-to-r from-yellow-400 to-yellow-600 
            text-black hover:scale-105 transition"
          >
            Ajouter le candidat
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}