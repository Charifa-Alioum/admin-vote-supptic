"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Candidate {
  id?: number;
  name: string;
  category: string;
  student_class: string;
  votes: number;
  photo_url?: string;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchCandidates = async () => {
    const { data, error } = await supabase.from("candidates").select("*");
    if (error) console.error(error);
    else setCandidates(data || []);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmed = confirm("⚠️ Supprimer ce candidat ?");
    if (!confirmed) return;

    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) console.error(error);
    else fetchCandidates();
  };

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">

        {/* 🔹 Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[var(--color-gold)]">
            Candidats 👑
          </h1>

          <a
            href="/candidates/create"
            className="px-6 py-2 rounded-xl font-semibold 
            bg-[var(--color-gold)] text-black
            hover:bg-[var(--color-supptic-blue)] hover:text-white
            transition"
          >
            + Ajouter
          </a>
        </div>

        {/* 🔹 Table */}
        <div
          className="overflow-x-auto rounded-2xl 
          bg-white/5 backdrop-blur-lg 
          border border-white/10 shadow-xl"
        >
          <table className="min-w-full table-auto">
            
            {/* HEAD */}
            <thead className="border-b border-white/10 text-gray-300 text-sm">
              <tr>
                <th className="p-4 text-left">Photo</th>
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Catégorie</th>
                <th className="p-4 text-left">Classe</th>
                <th className="p-4 text-left">Votes</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {candidates.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 
                  hover:bg-white/5 transition"
                >
                  {/* 📸 Photo */}
                  <td className="p-4">
                    {c.photo_url ? (
                      <img
                        src={c.photo_url}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover 
                        border-2 border-[var(--color-gold)]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700" />
                    )}
                  </td>

                  {/* 👤 Nom */}
                  <td className="p-4 text-white font-medium">
                    {c.name}
                  </td>

                  {/* 🏷 Catégorie */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.category === "Miss"
                          ? "bg-pink-500/20 text-pink-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {c.category}
                    </span>
                  </td>

                  {/* 🎓 Classe */}
                  <td className="p-4 text-gray-300">
                    {c.student_class}
                  </td>

                  {/* 🗳 Votes */}
                  <td className="p-4 text-white font-bold">
                    {c.votes}
                  </td>

                  {/* ⚙ Actions */}
                  <td className="p-4 flex gap-3">

                    {/* ✏ Modifier */}
                    <a
                      href={`/candidates/${c.id}/edit`}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg 
                      bg-[var(--color-supptic-blue)] hover:bg-blue-800 
                      text-white transition"
                    >
                      <FaEdit />
                      Modifier
                    </a>

                    {/* 🗑 Supprimer */}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg 
                      bg-red-500/80 hover:bg-red-600 
                      text-white transition"
                    >
                      <FaTrash />
                      Supprimer
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </ProtectedRoute>
  );
}