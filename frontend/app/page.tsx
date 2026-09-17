import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          Shortlink
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Masuk
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Daftar
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900 text-2xl">
            🔗
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Buat link lebih singkat.
            <br />
            Bagikan lebih mudah.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            Ubah URL panjang menjadi link singkat yang mudah
            dibagikan dan dikelola dalam satu tempat.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              Mulai Gratis
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Saya Sudah Punya Akun
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 text-2xl">🔗</div>

            <h2 className="font-semibold text-gray-900">
              Link Singkat
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Buat URL yang lebih pendek dan mudah dibagikan.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 text-2xl">✏️</div>

            <h2 className="font-semibold text-gray-900">
              Custom Link
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Gunakan nama link sendiri agar lebih mudah diingat.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 text-2xl">📊</div>

            <h2 className="font-semibold text-gray-900">
              Track Clicks
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Lihat berapa kali link kamu sudah dikunjungi.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6">
        <p className="text-center text-xs text-gray-400">
          Simple • Fast • Easy to share
        </p>
      </footer>
    </main>
  );
}
