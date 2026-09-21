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

  const handleGoogleLogin = () => {
  window.location.href =
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};

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
          <div className="my-6 flex items-center gap-3">
  <div className="h-px flex-1 bg-slate-800" />
  <span className="text-xs text-slate-500">ATAU</span>
  <div className="h-px flex-1 bg-slate-800" />
</div>

<button
  type="button"
  onClick={handleGoogleLogin}
  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white py-3.5 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]"
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
    />
    <path
      fill="#34A853"
      d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
    />
    <path
      fill="#FBBC05"
      d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.59V7.88H3.3A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.98 1.05 4.12l3.24-2.53Z"
    />
    <path
      fill="#EA4335"
      d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.5 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"
    />
  </svg>

  Lanjutkan dengan Google
</button>

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