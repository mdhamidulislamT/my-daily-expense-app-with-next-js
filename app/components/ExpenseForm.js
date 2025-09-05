"use client";
import { useState, useEffect } from "react";

export default function ExpenseForm({ onSubmit, editingData, cancelEdit }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    source: "",
    note: "",
    amount: "",
    type: "out",
  });

  useEffect(() => {
    if (editingData) {
      setForm({
        date: new Date(editingData.date).toISOString().slice(0, 10),
        source: editingData.source || "",
        note: editingData.note || "",
        amount: editingData.amount,
        type: editingData.type,
      });
    }
  }, [editingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!editingData) {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        source: "",
        note: "",
        amount: "",
        type: "out",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800 rounded shadow mb-6 w-full max-w-md"
    >
      <h2 className="text-xl font-bold mb-2">
        {editingData ? "Edit Expense" : "Add Expense"}
      </h2>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 mb-2"
        required
      />
      <input
        type="text"
        placeholder="Source (optional)"
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 mb-2"
      />
      <input
        type="text"
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 mb-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 mb-2"
        required
      />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 mb-2"
      >
        <option value="out">Expense</option>
        <option value="in">Income</option>
      </select>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 py-2 px-4 rounded flex-1">
          {editingData ? "Update" : "Add"}
        </button>
        {editingData && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-600 py-2 px-4 rounded flex-1"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
