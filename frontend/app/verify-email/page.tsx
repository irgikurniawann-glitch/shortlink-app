"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Memverifikasi email...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      console.log("Token ditemukan:", !!token);

      if (!token) {
        setIsError(true);
        setMessage("Token verifikasi tidak ditemukan.");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(
          `${apiUrl}/api/shortlinks/verify-email?token=${encodeURIComponent(token)}`
        );

        const result = await response.json();

        if (!response.ok) {
          setIsError(true);
          setMessage(
            result.message || "Verifikasi email gagal."
          );
          return;
        }

        setMessage("Email berhasil diverifikasi!");
      } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);
        setIsError(true);
        setMessage("Gagal terhubung ke server.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Verifikasi Email
        </h1>

        <p
          className={
            isError
              ? "mb-6 text-red-600"
              : "mb-6 text-green-600"
          }
        >
          {message}
        </p>

        <Link
          href="/login"
          className="inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Ke Halaman Login
        </Link>
      </div>
    </main>
  );
}