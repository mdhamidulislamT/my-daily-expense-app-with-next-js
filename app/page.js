"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPageClient({ initialExpenses }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    source: "",
    note: "",
    amount: "",
    type: "out",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated, but show loader first
  useEffect(() => {
    if (status === "unauthenticated") {
      const timeout = setTimeout(() => router.push("/login"), 800); // show loader briefly
      return () => clearTimeout(timeout);
    }
  }, [status]);

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!session) return;
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    if (status === "authenticated") fetchExpenses();
  }, [status]);

  // Add / Update expense
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      setForm({
        date: new Date().toISOString().slice(0, 10),
        source: "",
        note: "",
        amount: "",
        type: "out",
      });
      setEditingId(null);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setForm({
      date: new Date(item.date).toISOString().slice(0, 10),
      source: item.source || "",
      note: item.note || "",
      amount: item.amount,
      type: item.type,
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    await fetchExpenses();
  };

  // Full-page loader
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p>{status === "loading" ? "Loading…" : "Redirecting…"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with title and logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">💰 Daily Expense Tracker</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Full-width Add/Edit Form */}
      <form
        onSubmit={submit}
        className="w-full bg-gray-800 p-6 rounded shadow mb-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h2>
        {error && <p className="text-red-500">{error}</p>}

        {/* Date, Amount, Type on the same line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="out">⬇ Expense</option>
            <option value="in">⬆ Income</option>
          </select>
        </div>

        {/* Full-width Source + Note */}
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Source (optional)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded"
        >
          {loading ? "Saving…" : editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Expenses Table */}
      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2">Source / Note</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
            <th className="p-2 min-w-[80px] w-auto">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                No expenses yet.
              </td>
            </tr>
          )}
          {expenses.map((exp) => (
            <tr key={exp.id} className="border-t border-gray-700">
              <td className="p-2">{exp.source || exp.note || "-"}</td>
              <td className="p-2">৳ {Number(exp.amount).toFixed(2)}</td>
              <td className="p-2">
                {exp.type === "in" ? "Income" : "Expense"}
              </td>
              <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(exp)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(exp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
