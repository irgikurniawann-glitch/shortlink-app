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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0c08] px-4 py-12 text-[#E8E9E3] selection:bg-[#D2FF00] selection:text-black font-['Space_Grotesk']">
      {/* Background Decorator - Dynamic Blobs + Grid + Noise */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0c08]" />

        {/* Dynamic Glowing Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#D2FF00]/10 blur-[150px] animate-[blobMove_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#00F0FF]/10 blur-[130px] animate-[blobMove_8s_ease-in-out_infinite_alternate-reverse]" />

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,12,8,0.85)_100%)]" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;700&display=swap');

        @keyframes blobMove {
          0% { transform: translate(-50%, -10%) scale(1); }
          50% { transform: translate(-45%, 5%) scale(1.1); }
          100% { transform: translate(-55%, -5%) scale(1.05); }
        }

        .text-glow-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .text-glow-hover:hover {
          text-shadow: 0 0 25px rgba(210, 255, 0, 0.75), 0 0 40px rgba(210, 255, 0, 0.4);
        }
      `}</style>

      <main className="w-full max-w-md">
        {/* Card Form */}
        <div className="group relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 backdrop-blur-2xl transition-all duration-500 hover:border-[#D2FF00]/30 hover:bg-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Logo Brand / Heading */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="group/brand inline-block font-['Syne'] text-2xl font-extrabold tracking-tight text-white transition focus-visible:outline-none mb-3"
            >
              SHORTLINK<span className="text-[#D2FF00] inline-block transition-transform duration-300 group-hover/brand:scale-150 group-hover/brand:drop-shadow-[0_0_10px_#D2FF00]">.</span>
            </Link>

            <h1 className="font-['Syne'] text-2xl font-bold tracking-tight text-white cursor-default select-none transition-all duration-300 hover:scale-[1.02] text-glow-hover">
              Selamat Datang Kembali
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-white/50">
              Masuk untuk mengelola short link dan melihat analitik kamu.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
              />
            </div>

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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password kamu"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
              />
            </div>

            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-xs text-white/50 hover:text-[#D2FF00] transition-colors duration-300 hover:underline"
              >
                Lupa password?
              </a>
            </div>

            {message && (
              <div
                role="alert"
                className={`p-3.5 rounded-2xl text-xs font-semibold text-center backdrop-blur-xl border ${
                  isError
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                    : "bg-[#D2FF00]/10 text-[#D2FF00] border-[#D2FF00]/30 shadow-[0_0_15px_rgba(210,255,0,0.15)]"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D2FF00] py-4 px-4 text-[12px] font-bold tracking-[0.15em] uppercase text-black shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all duration-300 hover:bg-[#e0ff4d] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">ATAU</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-3.5 px-4 text-[12px] font-bold tracking-[0.15em] uppercase text-white transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.98]"
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

          <p className="mt-8 text-center text-xs text-white/40">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-[#D2FF00] hover:underline transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(210,255,0,0.8)]"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}