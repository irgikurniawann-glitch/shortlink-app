import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "Link Singkat & Cepat",
    description: "Ubah URL panjang menjadi link pendek yang rapi dan siap dibagikan dalam hitungan detik.",
  },
  {
    icon: "🎯",
    title: "Custom Domain & Link",
    description: "Sesuaikan nama belakang link agar terlihat profesional dan terpercaya bagi audiens Anda.",
  },
  {
    icon: "📈",
    title: "Analitik Real-time",
    description: "Pantau setiap klik, lokasi pengunjung, dan perangkat yang digunakan secara mendalam.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0c08] text-[#E8E9E3] selection:bg-[#D2FF00] selection:text-black font-['Space_Grotesk']">
      {/* === BG LANDO NORRIS VIBES - HIGH OCTANE & GLOW === */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Base Background */}
        <div className="absolute inset-0 bg-[#0a0c08]" />

        {/* Dynamic Glowing Blobs */}
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#D2FF00]/15 blur-[140px] animate-[blobMove_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-[#00F0FF]/10 blur-[130px] animate-[blobMove_10s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-[#D2FF00]/10 blur-[150px] animate-[blobMove_12s_ease-in-out_infinite_alternate]" />

        {/* Tech Grid Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Noise Grain overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Vignette Accent */}
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

        .text-glow-cyan:hover {
          text-shadow: 0 0 25px rgba(0, 240, 255, 0.75), 0 0 40px rgba(0, 240, 255, 0.4);
        }
      `}</style>

      {/* Header - Minimalist Bold F1 Style */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0c08]/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="group font-['Syne'] text-[22px] font-extrabold tracking-tight text-white">
            SHORTLINK<span className="text-[#D2FF00] inline-block transition-transform duration-300 group-hover:scale-150 group-hover:drop-shadow-[0_0_10px_#D2FF00]">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="rounded-full px-5 py-2.5 text-[12px] font-bold tracking-[0.15em] uppercase text-white/70 hover:text-white transition duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="relative group overflow-hidden rounded-full bg-[#D2FF00] px-6 py-2.5 text-[12px] font-bold tracking-[0.15em] uppercase text-black transition-all duration-300 hover:bg-[#e3ff4f] active:scale-95 shadow-[0_0_25px_rgba(210,255,0,0.4)] hover:shadow-[0_0_35px_rgba(210,255,0,0.7)]"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-32">
          {/* Hero Content */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#D2FF00]/30 bg-[#D2FF00]/10 px-5 py-2 backdrop-blur-xl shadow-[0_0_20px_rgba(210,255,0,0.15)] transition-transform duration-300 hover:scale-105">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#D2FF00]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D2FF00]">
                Platform Pemendek Link Modern
              </span>
            </div>

            {/* Main Interactive Hover Glow Title */}
            <h1 className="font-['Syne'] text-[46px] font-[800] leading-[0.92] tracking-[-0.04em] text-white sm:text-[76px] cursor-default select-none">
              <span className="inline-block transition-all duration-300 hover:scale-[1.02] hover:text-[#ffffff] text-glow-hover">
                SATU LINK
              </span>
              <br />
              <span className="text-[#D2FF00] inline-block transition-all duration-300 hover:scale-[1.03] text-glow-hover">
                SINGKAT
              </span>{" "}
              <span className="inline-block transition-all duration-300 hover:scale-[1.02] hover:text-cyan-300 text-glow-cyan">
                UNTUK SEMUA.
              </span>
            </h1>

            {/* Subtitle with subtle glow on hover */}
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.8] text-white/60 transition-colors duration-300 hover:text-white/90">
              Perpendek URL panjang, buat link kustom yang mudah diingat, dan lacak performa klik dengan analitik real-time dalam satu platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link 
                href="/register" 
                className="group relative inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-white px-8 py-4 text-[12px] font-bold tracking-[0.15em] uppercase text-black transition-all duration-300 hover:bg-[#D2FF00] active:scale-95 hover:shadow-[0_0_30px_rgba(210,255,0,0.5)]"
              >
                Mulai Gratis Sekarang
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </Link>
              <Link 
                href="/login" 
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-[12px] font-bold tracking-[0.15em] uppercase text-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.1] hover:text-white hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>

          {/* Features Cards with Glassmorphism + Neon Border Hover */}
          <div className="mx-auto mt-24 grid max-w-5xl gap-6 sm:mt-32 sm:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <article
                key={index}
                className="group relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D2FF00]/40 hover:bg-white/[0.05] hover:shadow-[0_10px_40px_-10px_rgba(210,255,0,0.15)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl group-hover:bg-[#D2FF00] group-hover:text-black group-hover:border-[#D2FF00] group-hover:shadow-[0_0_20px_rgba(210,255,0,0.5)] transition-all duration-300">
                  {feature.icon}
                </div>
                <h2 className="font-['Syne'] text-[20px] font-bold leading-tight text-white transition-colors duration-300 group-hover:text-[#D2FF00]">
                  {feature.title}
                </h2>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/50 group-hover:text-white/80 transition-colors duration-300">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D2FF00]/0 to-transparent group-hover:via-[#D2FF00]/60 transition-all duration-500" />
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0a0c08]/80 py-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white/70 transition-colors">
            Simple • Fast • Powerful Analytics
          </p>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white/70 transition-colors">
            © 2026 Shortlink — Built by Irgi
          </p>
        </div>
      </footer>
    </div>
  );
}