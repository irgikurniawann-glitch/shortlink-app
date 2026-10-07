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
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
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
        setMessage(
          result.message || "Gagal masuk. Periksa email dan password Anda."
        );
        return;
      }

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
    <div className="min-h-screen bg-[#F0FFFF] px-6 py-12 text-[#1F2022]">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-md border border-[#E7E5E0] bg-white p-8 shadow-sm sm:p-10">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="font-serif text-2xl font-medium tracking-tight text-[#008B8B]"
            >
              ShortLink
            </Link>

            <h1 className="mt-8 font-serif text-3xl font-normal tracking-tight text-[#1F2022]">
              Selamat Datang Kembali
            </h1>

            <p className=" font-sans mt-3 text-sm leading-relaxed text-[#55575A]">
              Masuk untuk mengelola short link dan melihat analitik kamu.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
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
                className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-sans block text-sm font-medium text-[#55575A]"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="font-sans text-xs font-medium text-[#55575A] transition-colors hover:text-[#008B8B]"
                >
                  Lupa password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password kamu"
                required
                className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                role="alert"
                className={`rounded border px-4 py-3 text-sm ${
                  isError
                    ? "border-[#E7B8AE] bg-[#FFF4F1] text-[#BA5C44]"
                    : "border-[#B8D6D3] bg-[#F0FAF9] text-[#008B8B]"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="font-sans w-full rounded bg-[#008B8B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#006F6F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E7E5E0]" />
            <span className="font-sans text-xs text-[#A3A3A3]">atau</span>
            <div className="h-px flex-1 bg-[#E7E5E0]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="font-sans flex w-full items-center justify-center gap-3 rounded border border-[#D9D6D0] bg-white px-4 py-3 text-sm font-medium text-[#1F2022] transition-colors hover:bg-[#F7F5F1]"
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

          {/* Register */}
          <p className="font-sans mt-8 text-center text-sm text-[#55575A]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-sans font-medium text-[#008B8B] transition-colors hover:text-[#006F6F] hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}