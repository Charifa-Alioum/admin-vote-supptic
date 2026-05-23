"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaMoneyBillWave, FaCalendarDay } from "react-icons/fa";

interface Transaction {
  id: number;
  reference: string;
  amount: number;
  candidate_id: number;
  status: string;
  external_reference: string;
  created_at: string;
  candidates?: { name: string; cultural_area: string };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchTransactions = async () => {
    // 1. Récupérer les transactions
    const { data: txData, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "SUCCESS")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", JSON.stringify(error));
      setLoading(false);
      return;
    }

    // 2. Récupérer les candidats séparément
    const { data: candidatesData } = await supabase
      .from("candidates")
      .select("id, name, cultural_area");

    // 3. Joindre manuellement
    const merged = (txData || []).map((tx) => ({
      ...tx,
      candidates: candidatesData?.find((c) => c.id === tx.candidate_id) ?? null,
    }));

    setTransactions(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchTransactions()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Total général
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Total du jour
  const today = new Date().toISOString().split("T")[0];
  const todayAmount = transactions
    .filter((tx) => tx.created_at.startsWith(today))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));

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
    <div className="p-6 space-y-6">

      {/* 🔹 Header */}
      <h1 className="text-3xl font-bold text-[var(--color-gold)]">
        {t("Historique des transactions")} 💳
      </h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div
          className="p-6 rounded-2xl border border-[var(--border)] flex items-center gap-4 hover:scale-105 transition"
          style={{ background: "var(--surface)" }}
        >
          <FaMoneyBillWave className="text-[var(--color-gold)] text-3xl shrink-0" />
          <div>
            <p style={{ color: "var(--text-muted)" }}>{t("Total général")}</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {formatAmount(totalAmount)}
            </p>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl border border-[var(--border)] flex items-center gap-4 hover:scale-105 transition"
          style={{ background: "var(--surface)" }}
        >
          <FaCalendarDay className="text-[var(--color-supptic-blue)] text-3xl shrink-0" />
          <div>
            <p style={{ color: "var(--text-muted)" }}>{t("Total du jour")}</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {formatAmount(todayAmount)}
            </p>
          </div>
        </div>

      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <table className="min-w-full table-auto">

          <thead className="border-b border-[var(--border)] text-sm" style={{ color: "var(--text-muted)" }}>
            <tr>
              <th className="p-4 text-left">{t("Référence")}</th>
              <th className="p-4 text-left">{t("Candidat")}</th>
              <th className="p-4 text-left">{t("Aire culturelle")}</th>
              <th className="p-4 text-left">{t("Montant")}</th>
              <th className="p-4 text-left">{t("Date")}</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-[var(--border)] hover:bg-[var(--surface-alt)] transition"
              >
                <td className="p-4 font-mono text-sm" style={{ color: "var(--text-muted)" }}>
                  {tx.reference}
                </td>

                <td className="p-4 font-medium" style={{ color: "var(--foreground)" }}>
                  {tx.candidates?.name ?? "—"}
                </td>

                <td className="p-4" style={{ color: "var(--text-muted)" }}>
                  {tx.candidates?.cultural_area ?? "—"}
                </td>

                <td className="p-4 font-bold text-[var(--color-gold)]">
                  {formatAmount(tx.amount)}
                </td>

                <td className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  {formatDate(tx.created_at)}
                </td>

              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
                  {t("Aucune transaction enregistrée.")}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}