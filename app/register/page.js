"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Success message state

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear previous success

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setSuccess("Registration successful! You can now login."); // ✅ Show success
      setEmail("");
      setPassword("");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* ✅ App Title */}
      <h1 className="text-3xl font-bold mb-6 mr-6">💰 Daily Expense Tracker</h1>

      <form
        onSubmit={handleRegister}
        className="p-6 bg-gray-800 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>} {/* ✅ Success message */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 py-2 rounded">Register</button>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-gray-600 py-2 rounded"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
