"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        setMessage(result.message || "Gagal masuk. Periksa email dan password Anda.");
        return;
      }

      
     // Simpan token dari response API
if (result.data?.token) {
  localStorage.setItem("token", result.data.token);
}

      setMessage("Login berhasil! Mengalihkan...");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Decorator - Glowing Glow Effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden blur-3xl opacity-25">
        <div className="absolute top-0 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600"></div>
        <div className="absolute bottom-0 right-1/3 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-800"></div>
      </div>

      {/* Grid Pattern Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <main className="w-full max-w-md">
        {/* Card Form */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
          {/* Logo Brand / Heading */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-black tracking-tight text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md mb-2"
            >
              Shortlink<span className="text-indigo-500">.</span>
            </Link>

            <h1 className="text-xl font-bold tracking-tight text-white">
              Selamat Datang Kembali
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Masuk untuk mengelola short link dan melihat analitik kamu.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password kamu"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {message && (
              <div
                role="alert"
                className={`p-3.5 rounded-xl text-sm font-medium text-center backdrop-blur-sm border ${
                  isError
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}