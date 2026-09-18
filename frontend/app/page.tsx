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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Decorator - Gradient Mesh & Glow ala Bitly (dengan nuansa Indigo & Purple) */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 overflow-hidden blur-3xl opacity-30">
        <div className="absolute top-[-100px] left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600"></div>
        <div className="absolute top-[100px] right-1/4 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-800"></div>
      </div>

      {/* Grid Pattern Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header / Navigasi */}
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
          aria-label="Navigasi Utama"
        >
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          >
            Shortlink<span className="text-indigo-500">.</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-95"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      {/* Konten Utama */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
          {/* Hero Section */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge Highlight */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              Platform Pemendek Link Modern
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight">
              Satu Link Singkat untuk{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Semua Kebutuhan Anda
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Perpendek URL panjang, buat link kustom yang mudah diingat, dan lacak performa klik dengan analitik real-time dalam satu platform.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-95"
              >
                Mulai Gratis Sekarang
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 px-7 py-4 text-base font-semibold text-slate-300 shadow-sm backdrop-blur-sm transition hover:border-slate-700 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>

          {/* Card Fitur (Glassmorphism & Border Gradient Style ala Bitly) */}
          <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-3 sm:mt-28">
            {FEATURES.map((feature, index) => (
              <article
                key={index}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                <h2 className="text-lg font-bold text-white">
                  {feature.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-xs font-medium text-slate-500">
            Simple • Fast • Powerful Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}