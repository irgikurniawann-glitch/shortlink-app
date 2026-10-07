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
    <div className="min-h-screen bg-[#F0FFFF] px-6 py-12 text-[#1F2022]">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-md border border-[#E7E5E0] bg-white p-8 shadow-sm sm:p-10">
          {/* Brand & Header */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="font-serif text-2xl font-medium tracking-tight text-[#008B8B]"
            >
              ShortLink
            </Link>

            <h1 className="font-sans mt-8 font-serif text-3xl font-normal tracking-tight text-[#1F2022]">
              Lupa Password?
            </h1>

            <p className="font-sans mt-3 text-sm leading-relaxed text-[#55575A]">
              Masukkan email akun kamu. Jika email terdaftar,
              kami akan mengirimkan link untuk membuat password baru.
            </p>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
                autoComplete="email"
                className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />
            </div>

            {message && (
              <div
                role="alert"
                className={`rounded border px-4 py-3 text-sm leading-relaxed ${
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
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>

          <p className="font-sans mt-8 text-center text-sm text-[#55575A]">
            Ingat password kamu?{" "}
            <Link
              href="/login"
              className="font-sans font-medium text-[#008B8B] transition-colors hover:text-[#006F6F] hover:underline"
            >
              Kembali ke Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}