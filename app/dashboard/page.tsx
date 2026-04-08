"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUser, FaVoteYea, FaCrown, FaMapMarkerAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Candidate {
  id: number;
  name: string;
  category: string;
  votes: number;
  photo_url?: string;
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("candidates")
      .select("*");

    if (!error && data) {
      setCandidates(data);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("realtime-candidates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidates" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalCandidates = candidates.length;
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  const topMiss = candidates
    .filter((c) => c.category === "Miss")
    .sort((a, b) => b.votes - a.votes)[0];

  const topMaster = candidates
    .filter((c) => c.category === "Master")
    .sort((a, b) => b.votes - a.votes)[0];

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-10">

        {/* 🎉 HERO SECTION */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-black via-[#0f172a] to-[#020617] border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between">

          {/* Texte */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-gold)] flex items-center gap-3">
              <FaCrown /> Élection Miss & Master
            </h1>

            <p className="text-gray-300 text-lg">
              🎉 Événement : <span className="text-white font-semibold">Journée culturelle</span>
            </p>

            <p className="text-gray-300 text-lg flex items-center gap-2">
              <FaMapMarkerAlt className="text-[var(--color-supptic-blue)]" />
              Lieu : <span className="text-white font-semibold">Sup’ptic</span>
            </p>

            <p className="text-sm text-gray-400">
              Suivi en temps réel des votes et des performances des candidats 👑
            </p>
          </div>

          {/* Logo */}
          <div className="mt-4 md:mt-0">
            <img
              src="/supptic-logo.jpg" // 👉 mets ton logo dans /public
              alt="Sup'ptic Logo"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4 hover:scale-105 transition">
            <FaUser className="text-[var(--color-gold)] text-3xl" />
            <div>
              <p className="text-gray-400">Candidats inscrits</p>
              <p className="text-white text-2xl font-bold">{totalCandidates}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4 hover:scale-105 transition">
            <FaVoteYea className="text-[var(--color-supptic-blue)] text-3xl" />
            <div>
              <p className="text-gray-400">Votes exprimés</p>
              <p className="text-white text-2xl font-bold">{totalVotes}</p>
            </div>
          </div>

        </div>

        {/* 🏆 TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {topMiss && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black shadow-xl hover:scale-105 transition">
              <div className="flex items-center space-x-4">
                <img
                  src={topMiss.photo_url}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm">👑 Top Miss</p>
                  <p className="text-xl font-bold">{topMiss.name}</p>
                  <p>{topMiss.votes} votes</p>
                </div>
              </div>
            </div>
          )}

          {topMaster && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-supptic-blue)] to-blue-800 text-white shadow-xl hover:scale-105 transition">
              <div className="flex items-center space-x-4">
                <img
                  src={topMaster.photo_url}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm">👑 Top Master</p>
                  <p className="text-xl font-bold">{topMaster.name}</p>
                  <p>{topMaster.votes} votes</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 📊 GRAPH */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg text-[var(--color-gold)] mb-4">
            📊 Dynamique des votes
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidates}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="votes" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </ProtectedRoute>
  );
}