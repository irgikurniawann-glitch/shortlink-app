"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shortlinks/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message || "Login gagal. Periksa kembali akun kamu.");
        return;
      }

      localStorage.setItem("token", result.data.token);
      setMessage("Login berhasil! Mengalihkan...");
      setTimeout(() => {
  router.push("/dashboard");
}, 500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Gagal terhubung ke server. Periksa koneksi kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl border border-gray-200/80 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Masuk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola tautan singkat kamu dalam satu tempat.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm text-center ${
                isError
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}