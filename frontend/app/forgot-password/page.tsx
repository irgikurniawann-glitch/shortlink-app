"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(
          result.message || "Gagal memproses permintaan."
        );
        return;
      }

      setMessage(
        result.message ||
          "Jika email terdaftar, link reset password akan dikirim."
      );
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden blur-3xl opacity-25">
        <div className="absolute left-1/3 top-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600" />
        <div className="absolute bottom-0 right-1/3 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-800" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <main className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-2 inline-block rounded-md text-2xl font-black tracking-tight text-white transition hover:opacity-90"
            >
              Shortlink<span className="text-indigo-500">.</span>
            </Link>

            <h1 className="text-xl font-bold tracking-tight text-white">
              Lupa Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Masukkan email akun kamu. Jika email terdaftar,
              kami akan mengirimkan link untuk membuat password baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {message && (
              <div
                role="alert"
                className={`rounded-xl border p-3.5 text-center text-sm font-medium ${
                  isError
                    ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Ingat password kamu?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
            >
              Kembali ke Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}