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

      // Beri waktu agar user bisa membaca pesan sukses
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0c08] px-4 py-12 text-[#E8E9E3] selection:bg-[#D2FF00] selection:text-black font-['Space_Grotesk']">
      {/* Dynamic Background Decorator */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0c08]" />

        {/* Dynamic Glowing Blobs */}
        <div className="absolute top-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-[#D2FF00]/10 blur-[150px] animate-[blobMove_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-1/4 -left-20 h-[450px] w-[450px] rounded-full bg-[#00F0FF]/10 blur-[140px] animate-[blobMove_8s_ease-in-out_infinite_alternate-reverse]" />

        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,12,8,0.85)_100%)]" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;700&display=swap');

        @keyframes blobMove {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); }
          50% { transform: scale(1.15) translate(-3%, 4%) rotate(3deg); }
          100% { transform: scale(1.25) translate(4%, -3%) rotate(-3deg); }
        }

        .text-glow-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .text-glow-hover:hover {
          text-shadow: 0 0 25px rgba(210, 255, 0, 0.75), 0 0 40px rgba(210, 255, 0, 0.4);
        }
      `}</style>

      <main className="w-full max-w-md">
        <div className="group relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#D2FF00]/30 hover:bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:p-10">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="group/logo inline-block font-['Syne'] text-2xl font-extrabold tracking-tight text-white focus-visible:outline-none mb-3"
            >
              SHORTLINK<span className="text-[#D2FF00] inline-block transition-transform duration-300 group-hover/logo:scale-150 group-hover/logo:drop-shadow-[0_0_10px_#D2FF00]">.</span>
            </Link>

            <h1 className="font-['Syne'] text-xl font-bold tracking-tight text-white cursor-default select-none transition-all duration-300 hover:scale-[1.01] text-glow-hover sm:text-2xl">
              Buat Akun Baru
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-white/50">
              Daftar untuk mulai membuat dan mengelola short link kamu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2"
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
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2"
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
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2"
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
                placeholder="Ulangi password kamu"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
              />
            </div>

            {/* Message Alert */}
            {message && (
              <div
                role="alert"
                className={`rounded-2xl border p-3.5 text-center text-xs font-semibold backdrop-blur-xl transition-all duration-300 ${
                  isError
                    ? "border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                    : "border-[#D2FF00]/30 bg-[#D2FF00]/10 text-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.1)]"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D2FF00] py-4 text-[12px] font-bold tracking-[0.15em] uppercase text-black shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all duration-300 hover:bg-[#e0ff4d] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Membuat Akun..." : "Daftar Sekarang"}
            </button>
          </form>

          {/* Link to Login */}
          <p className="mt-8 text-center text-xs text-white/40">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-[#D2FF00] transition-all duration-300 hover:underline hover:drop-shadow-[0_0_10px_rgba(210,255,0,0.5)]"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}