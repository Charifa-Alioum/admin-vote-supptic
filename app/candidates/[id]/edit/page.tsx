"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditCandidatePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState("");

  const categories = ["Master", "Miss"];
  const classes = ["ADM 1", "ADM 2", "IT 1", "IT 2", "IPT 1", "IPT 2", "IPT 3"];

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
      .update({
        name,
        category,
        student_class: studentClass,
        photo_url,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Candidat mis à jour ✨");
      router.push("/candidates");
    }
  };

  if (loading) return <p className="p-6 text-white">Chargement...</p>;

  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-[#020617] text-white">

        <h1 className="text-3xl font-bold mb-6 text-yellow-400">
          ✏️ Modifier candidat
        </h1>

        <div className="max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700"
          >
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Photo actuelle */}
          {currentPhoto && (
            <img
              src={currentPhoto}
              className="w-24 h-24 object-cover rounded-full border-2 border-yellow-400"
            />
          )}

          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleUpdate}
            className="w-full py-3 rounded-lg font-semibold 
            bg-gradient-to-r from-yellow-400 to-yellow-600 
            text-black hover:scale-105 transition"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}