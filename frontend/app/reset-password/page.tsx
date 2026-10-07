"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Token reset password tidak ditemukan.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal reset password.");
        return;
      }

      setMessage(data.message || "Password berhasil diubah.");

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF] px-6 py-12 text-[#1F2022]">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-md border border-[#E7E5E0] bg-white p-8 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="font-serif text-2xl font-medium tracking-tight text-[#008B8B]"
            >
              ShortLink
            </Link>

            <h1 className="font-sans mt-8 font-serif text-3xl font-normal tracking-tight text-[#1F2022]">
              Reset Password
            </h1>

            <p className="font-sans mt-3 text-sm leading-relaxed text-[#55575A]">
              Buat password baru untuk akun kamu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Baru */}
            <div>
              <label
                htmlFor="password"
                className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
              >
                Password Baru
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password baru"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />

              <p className="font-sans mt-2 text-xs text-[#999B9D]">
                Minimal 6 karakter.
              </p>
            </div>

            {/* Konfirmasi Password */}
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
                placeholder="Masukkan ulang password"
                required
                minLength={6}
                autoComplete="new-password"
                className=" font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
              />
            </div>

            {/* Success Message */}
            {message && (
              <div
                role="alert"
                className="rounded border border-[#B8D6D3] bg-[#F0FAF9] px-4 py-3 text-sm leading-relaxed text-[#008B8B]"
              >
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded border border-[#E7B8AE] bg-[#FFF4F1] px-4 py-3 text-sm leading-relaxed text-[#BA5C44]"
              >
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="font-sans w-full rounded bg-[#008B8B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#006F6F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="font-sans mt-8 text-center text-sm text-[#55575A]">
            Sudah ingat password kamu?{" "}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F0FFFF] px-6">
          <p className="text-sm text-[#77797C]">
            Memuat...
          </p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}