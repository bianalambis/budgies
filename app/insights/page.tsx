"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note: string;
};

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setInsight(null);
    setError(null);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
      });

    const dates = transactions.map((t) => t.date).sort();
    const dateRange =
      dates.length > 0
        ? { earliest: dates[0], latest: dates[dates.length - 1] }
        : null;

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalIncome,
          totalExpenses,
          balance,
          byCategory,
          transactionCount: transactions.length,
          dateRange,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setInsight(data.insight);
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-14">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">

        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors w-fit">
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Insights</h1>
            <p className="text-gray-500 mt-1.5">Get a personalized summary of your spending habits.</p>
          </div>
        </div>

        {/* Generate Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-gray-900">Budget Insight Generator</h2>
            <p className="text-sm text-gray-500">
              Uses AI to analyze your transactions and give you a short financial summary.
            </p>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400">
              No transactions yet. Add some on the{" "}
              <Link href="/transactions" className="underline hover:text-gray-600 transition-colors">
                Transactions
              </Link>{" "}
              page first.
            </p>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating…" : "Generate Insight"}
            </button>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {insight && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{insight}</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
