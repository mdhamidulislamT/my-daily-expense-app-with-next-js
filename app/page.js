"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
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
  const [filter, setFilter] = useState("all");

  // Fetch all expenses
  const fetchItems = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
      await fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  // Edit expense
  const handleEdit = (item) => {
    const dateValue = new Date(item.date).toISOString().slice(0, 10);
    setForm({
      date: dateValue,
      source: item.source || "",
      note: item.note || "",
      amount: item.amount,
      type: item.type,
    });
    setEditingId(item.id);
  };

  const filteredItems = items.filter((i) =>
    filter === "all" ? true : i.type === filter
  );

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💰 Expense Tracker</h1>

      {/* Form */}
      <form onSubmit={submit} className="mb-6 space-y-3">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Source (optional)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="out">⬇ Expense</option>
          <option value="in">⬆ Income</option>
        </select>

        {error && <p className="text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {loading ? "Saving…" : editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2"
        >
          <option value="all">All</option>
          <option value="in">Income Only</option>
          <option value="out">Expense Only</option>
        </select>
      </div>

      {/* List */}
      <ul className="divide-y">
        {filteredItems.map((i) => (
          <li key={i.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">
                {i.type === "in" ? "⬆ Income" : "⬇ Expense"}
                {i.source ? ` — ${i.source}` : ""} — ৳{" "}
                {Number(i.amount).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(i.date).toLocaleDateString()}{" "}
                {i.note ? `• ${i.note}` : ""}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(i)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
