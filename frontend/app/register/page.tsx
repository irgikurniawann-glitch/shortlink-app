"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(
          result.message || "Registrasi gagal. Silakan coba lagi."
        );
        return;
      }

      setMessage(
        result.message ||
          "Registrasi berhasil. Silakan cek email untuk verifikasi."
      );

      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
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

            <h1 className="mt-8 font-serif text-3xl font-normal tracking-tight text-[#1F2022]">
              Buat Akun Baru
            </h1>

            <p className="font-sans mt-3 text-sm leading-relaxed text-[#55575A]">
              Daftar untuk mulai membuat dan mengelola short link kamu.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                autoComplete="new-password"
                className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
              >
                Konfirmasi Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Ulangi password"
                required
                minLength={6}
                autoComplete="new-password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="font-sans w-full rounded bg-[#008B8B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#006F6F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Membuat Akun..." : "Daftar Sekarang"}
            </button>
          </form>

          {/* Login */}
          <p className="font-sans mt-8 text-center text-sm text-[#55575A]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-sans font-medium text-[#008B8B] transition-colors hover:text-[#006F6F] hover:underline"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}