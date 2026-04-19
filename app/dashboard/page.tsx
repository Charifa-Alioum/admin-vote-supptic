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
    const { data, error } = await supabase.from("candidates").select("*");
    if (!error && data) setCandidates(data);
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

    return () => { supabase.removeChannel(channel); };
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
        <div
          className="rounded-2xl p-6 border border-[var(--border)] shadow-xl
          flex flex-col md:flex-row items-center justify-between"
          style={{ background: "var(--surface)" }}
        >
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-gold)] flex items-center gap-3">
              <FaCrown /> Élection Miss &amp; Mister
            </h1>

            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              🎉 Événement :{" "}
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                Journée culturelle
              </span>
            </p>

            <p className="text-lg flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <FaMapMarkerAlt className="text-[var(--color-supptic-blue)]" />
              Lieu :{" "}
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                Sup'ptic
              </span>
            </p>

            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Suivi en temps réel des votes et des performances des candidats 👑
            </p>
          </div>

          {/* Logo */}
          <div className="mt-4 md:mt-0">
            <img
              src="/supptic-logo.jpg"
              alt="Sup'ptic Logo"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div
            className="p-6 rounded-2xl border border-[var(--border)]
            flex items-center space-x-4 hover:scale-105 transition"
            style={{ background: "var(--surface)" }}
          >
            <FaUser className="text-[var(--color-gold)] text-3xl shrink-0" />
            <div>
              <p style={{ color: "var(--text-muted)" }}>Candidats inscrits</p>
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {totalCandidates}
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border border-[var(--border)]
            flex items-center space-x-4 hover:scale-105 transition"
            style={{ background: "var(--surface)" }}
          >
            <FaVoteYea className="text-[var(--color-supptic-blue)] text-3xl shrink-0" />
            <div>
              <p style={{ color: "var(--text-muted)" }}>Votes exprimés</p>
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {totalVotes}
              </p>
            </div>
          </div>

        </div>

        {/* 🏆 TOP CANDIDATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {topMiss && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black shadow-xl hover:scale-105 transition">
              <div className="flex items-center space-x-4">
                <img
                  src={topMiss.photo_url}
                  alt={topMiss.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm opacity-80">👑 Top Miss</p>
                  <p className="text-xl font-bold">{topMiss.name}</p>
                  <p className="text-sm">{topMiss.votes} votes</p>
                </div>
              </div>
            </div>
          )}

          {topMaster && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-supptic-blue)] to-blue-800 text-white shadow-xl hover:scale-105 transition">
              <div className="flex items-center space-x-4">
                <img
                  src={topMaster.photo_url}
                  alt={topMaster.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-sm opacity-80">👑 Top Mister</p>
                  <p className="text-xl font-bold">{topMaster.name}</p>
                  <p className="text-sm">{topMaster.votes} votes</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 📊 GRAPHIQUE */}
        <div
          className="p-6 rounded-2xl border border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <h3 className="text-lg text-[var(--color-gold)] mb-4">
            📊 Dynamique des votes
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidates}>
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: "var(--foreground)" }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Bar dataKey="votes" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </ProtectedRoute>
  );
}