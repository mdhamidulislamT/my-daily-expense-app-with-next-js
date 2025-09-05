"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [expenses, setExpenses] = useState([]);
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

  // Fetch expenses
  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    if (status === "authenticated") fetchExpenses();
  }, [status]);

  // Submit add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());
      setForm({ date: new Date().toISOString().slice(0, 10), source: "", note: "", amount: "", type: "out" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      date: new Date(exp.date).toISOString().slice(0, 10),
      source: exp.source || "",
      note: exp.note || "",
      amount: exp.amount,
      type: exp.type,
    });
    setEditingId(exp.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE", credentials: "include" });
    fetchExpenses();
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please login</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daily Expense Tracker</h1>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </div>

      {/* Form */}
      <form className="bg-gray-800 p-4 rounded mb-6 space-y-3" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="border p-2 rounded text-black" required />
          <input type="text" placeholder="Source" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="border p-2 rounded text-black" />
          <input type="text" placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="border p-2 rounded text-black" />
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border p-2 rounded text-black" required />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border p-2 rounded text-black">
            <option value="out">Expense</option>
            <option value="in">Income</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-green-500 py-2 px-4 rounded mt-2">
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-2">Date</th>
              <th className="border border-gray-700 p-2">Type</th>
              <th className="border border-gray-700 p-2">Source</th>
              <th className="border border-gray-700 p-2">Note</th>
              <th className="border border-gray-700 p-2">Amount</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="bg-gray-700">
                <td className="border border-gray-600 p-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="border border-gray-600 p-2">{exp.type === "in" ? "Income" : "Expense"}</td>
                <td className="border border-gray-600 p-2">{exp.source}</td>
                <td className="border border-gray-600 p-2">{exp.note}</td>
                <td className="border border-gray-600 p-2">{Number(exp.amount).toFixed(2)}</td>
                <td className="border border-gray-600 p-2 space-x-2">
                  <button onClick={() => handleEdit(exp)} className="bg-blue-500 px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="bg-red-500 px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
