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

export default function SummaryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      color: "text-green-600",
      prefix: "+",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      color: "text-red-500",
      prefix: "-",
    },
    {
      label: "Balance",
      value: Math.abs(balance),
      color: balance >= 0 ? "text-green-600" : "text-red-500",
      prefix: balance >= 0 ? "+" : "-",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-14">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">

        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors w-fit">
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Summary</h1>
            <p className="text-gray-500 mt-1.5">An overview of your income, expenses, and balance.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-3"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {card.label}
              </span>
              <span className={`text-3xl font-bold ${card.color}`}>
                {card.prefix}${card.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {transactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center">
            No transactions yet. Add some on the{" "}
            <Link href="/transactions" className="underline hover:text-gray-600 transition-colors">
              Transactions
            </Link>{" "}
            page.
          </p>
        )}

      </div>
    </main>
  );
}
