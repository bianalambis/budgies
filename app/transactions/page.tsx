"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note: string;
};

const emptyForm = {
  type: "expense" as "income" | "expense",
  amount: "",
  category: "",
  date: "",
  note: "",
};

export default function TransactionsPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [success, setSuccess] = useState(false);
  const isFirstRender = useRef(true);

  const categories = [...new Set(transactions.map((t) => t.category))];
  const filtered = categoryFilter === "all" ? transactions : transactions.filter((t) => t.category === categoryFilter);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever transactions change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function handleEdit(t: Transaction) {
    setEditingId(t.id);
    setEditForm({ type: t.type, amount: String(t.amount), category: t.category, date: t.date, note: t.note });
  }

  function handleSave(id: string) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, type: editForm.type, amount: Number(editForm.amount), category: editForm.category.trim(), date: editForm.date, note: editForm.note.trim() }
          : t
      )
    );
    setEditingId(null);
  }

  function validate() {
    const next: Partial<typeof emptyForm> = {};
    if (!form.amount || Number(form.amount) <= 0) next.amount = "Enter a valid amount.";
    if (!form.category.trim()) next.category = "Category is required.";
    if (!form.date) next.date = "Date is required.";
    return next;
  }

  function handleSubmit() {
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: form.type,
      amount: Number(form.amount),
      category: form.category.trim(),
      date: form.date,
      note: form.note.trim(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setForm(emptyForm);
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1.5">Add and view your income and expenses.</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <section className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-5">
          <h2 className="text-base font-semibold text-gray-900">Add a Transaction</h2>

          <div className="flex flex-col gap-4">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: undefined }); }}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${errors.amount ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gray-300"}`}
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                placeholder="e.g. Food, Rent, Salary"
                value={form.category}
                onChange={(e) => { setForm({ ...form, category: e.target.value }); if (errors.category) setErrors({ ...errors, category: undefined }); }}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${errors.category ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gray-300"}`}
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => { setForm({ ...form, date: e.target.value }); if (errors.date) setErrors({ ...errors, date: undefined }); }}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${errors.date ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gray-300"}`}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            {/* Note (optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Note <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Weekly grocery run"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-1 w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Add Transaction
            </button>
            {success && (
              <p className="text-xs text-green-600 text-center">Transaction added successfully.</p>
            )}
          </div>
        </section>

        {/* Transaction List */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Transactions</h2>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
              No transactions yet. Add one above.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((t) => (
                <li
                  key={t.id}
                  className="bg-white border border-gray-200 rounded-2xl px-5 py-5 flex flex-col gap-3"
                >
                  {editingId === t.id ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <input
                          type="text"
                          placeholder="Note (optional)"
                          value={editForm.note}
                          onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                          className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(t.id)}
                          className="text-xs font-medium bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900">{t.category}</span>
                        <span className="text-xs text-gray-400">
                          {t.date}{t.note ? ` · ${t.note}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-base font-semibold ${
                            t.type === "income" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-gray-300 hover:text-blue-400 transition-colors text-xs"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  );
}
