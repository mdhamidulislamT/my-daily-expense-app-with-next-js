"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res.error) setError(res.error);
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Daily Expense Tracker</h1>
      <form className="p-6 border rounded space-y-4 w-80 bg-gray-800" onSubmit={handleLogin}>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full rounded text-black" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full rounded text-black" required />
        <button type="submit" className="w-full bg-green-500 py-2 rounded">Login</button>
        <button type="button" onClick={() => router.push("/register")} className="w-full bg-gray-600 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
