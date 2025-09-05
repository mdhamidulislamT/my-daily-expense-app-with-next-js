"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false); // ✅ loader only for redirect

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      setRedirecting(true);
      router.push("/"); // dashboard
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res.error) setError(res.error);
    else {
      setRedirecting(true); // show loader only while redirecting
      router.push("/"); // redirect after login
    }
  };

  // Show loader only during redirect
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* ✅ App Title */}
      <h1 className="text-3xl font-bold mb-6 mr-6">💰 Daily Expense Tracker</h1>

      <form
        onSubmit={handleLogin}
        className="p-6 bg-gray-800 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">Invalid credentials</p>}
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
        <button className="w-full bg-blue-600 py-2 rounded">Login</button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="w-full bg-gray-600 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
