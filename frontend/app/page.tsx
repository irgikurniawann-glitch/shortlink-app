"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ShortlinkResult = {
  shortUrl: string;
  originalUrl: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortlinkResult | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setResult(null);
    setCopied(false);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setMessage("Masukkan URL terlebih dahulu.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setMessage("Masukkan URL yang valid.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/shortlinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Gagal membuat short link."
        );
        return;
      }

      /*
       * Backend project kamu mungkin mengembalikan
       * shortUrl / shortLink / shortCode.
       *
       * Kita coba beberapa bentuk response supaya
       * UI tidak mudah rusak.
       */
      let shortUrl = "";

      if (data.data?.shortUrl) {
        shortUrl = data.data.shortUrl;
      } else if (data.data?.shortLink) {
        shortUrl = data.data.shortLink;
      } else if (data.shortUrl) {
        shortUrl = data.shortUrl;
      } else if (data.shortLink) {
        shortUrl = data.shortLink;
      } else if (data.data?.shortCode) {
        shortUrl = `${window.location.origin}/${data.data.shortCode}`;
      } else if (data.shortCode) {
        shortUrl = `${window.location.origin}/${data.shortCode}`;
      }

      if (!shortUrl) {
        setMessage(
          "Short link berhasil dibuat, tetapi response server belum dikenali."
        );
        return;
      }

      setResult({
        shortUrl,
        originalUrl: trimmedUrl,
      });
    } catch (error) {
      console.error(error);
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMessage("Gagal menyalin link.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF] text-[#1F2022] selection:bg-[#E7E5E0] selection:text-[#1F2022]">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E7E5E0] bg-[#E0FFFF]/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-serif text-2xl font-medium tracking-tight text-[#008B8B]"
          >
            ShortLink
            
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="font-sans text-sm font-medium text-[#55575A] transition-colors hover:text-[#1F2022]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="font-sans text-sm font-medium text-[#55575A] transition-colors hover:text-[#1F2022]"
            >
              How it works
            </a>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="rounded bg-[#696969] px-3.5 py-1.5 text-sm font-medium text-[#F8F8FF] transition-colors hover:text-[#F8F8FF] hover:bg-[#1F2055] "
              >
            
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded bg-[#008B8B] px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1F2055]"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-24">
         

          <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[1.2] tracking-tight text-[#008B8B] sm:text-6xl">
            Shorter Link 
          </h1>

         

          {/* Shortener */}
          <div className="mt-10 w-full max-w-xl">
            <form
              onSubmit={handleShorten}
              className="flex flex-col gap-2 rounded-md border border-[#E7E5E0] bg-white p-1.5 shadow-sm transition focus-within:border-[#4D5D4B] focus-within:ring-1 focus-within:ring-[#4D5D4B]/30 sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center px-3">
               

                <input
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://your-long-url.com/very-long-link"
                  required
                  className="w-full border-0 bg-transparent py-2 text-sm font-mono text-[#1F2022] outline-none placeholder:text-[#A3A3A3] focus:ring-0"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded bg-[#008B8B] px-5 py-2.5 text-sm font-semimedium text-white transition-colors hover:bg-[#1F2055] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Shortening..." : "Shorten link "}
              </button>
            </form>

            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#55575A]">
            
              <span className="text-[#D6D3CE]">·</span>
            
            </p>

            {message && (
              <p className="mt-4 text-sm text-[#BA5C44]">
                {message}
              </p>
            )}
          </div>
        </section>

        {/* Result */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="font-sans text-xs font-medium uppercase tracking-wider text-[#55575A]">
                Link output
              </span>

              <span className="font-mono text-xs text-[#A3A3A3]">
                {result ? "Status: Active" : "Siap"}
              </span>
            </div>

            <div className="rounded-md border border-[#E7E5E0] bg-white p-5 shadow-sm">
              {result ? (
                <>
                  <div className="flex flex-col justify-between gap-4 border-b border-[#E7E5E0] pb-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#A3A3A3]">
                        Shortened link
                      </span>

                      <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate font-mono text-base font-semibold text-[#1F2022] transition-colors hover:text-[#4D5D4B]"
                      >
                        {result.shortUrl}
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 rounded border border-[#E7E5E0] bg-[#F4F1EB] px-3 py-1.5 font-mono text-xs font-medium text-[#1F2022] transition-colors hover:bg-[#E7E5E0]"
                    >
                      {copied ? "Copied ✓" : "Copy link"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="shrink-0 font-mono text-[#A3A3A3]">
                        Original:
                      </span>

                      <span
                        className="truncate font-mono text-[#55575A]"
                        title={result.originalUrl}
                      >
                        {result.originalUrl}
                      </span>
                    </div>

                    <span className="shrink-0 font-mono text-[#55575A]">
                      Newly created
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-5 text-center">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#A3A3A3]">
                    Your shortened link will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-[#E7E5E0] bg-[#E0FFFF]/50 py-16"
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 max-w-md">
              <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-[#008B8B]">
                Proses
              </span>

              <h2 className="font-serif text-2xl font-normal text-[#1F2022] sm:text-3xl">
                Memiliki 3 urutan Langkah
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-t border-[#E7E5E0] pt-4">
                <span className="mb-2 block font-mono text-xs text-[#008B8B]">
                  01
                </span>

                <h3 className="font-sans mb-1.3 text-base font-semibold text-[#1F2022]">
                  Tempelkan URL Anda
                </h3>

                <p className="font-sans text-sm leading-relaxed text-[#55575A]">
                  Tempelkan URL yang panjang dan ubah menjadi tautan pendek menjadi rapi.
                </p>
              </div>

              <div className="border-t border-[#E7E5E0] pt-4">
                <span className="mb-2 block font-mono text-xs text-[#008B8B]">
                  02
                </span>

                <h3 className="font-sans mb-1.5 text-base font-semibold text-[#1F2022]">
                  Dapatkan tautan pendek Anda
                </h3>

                <p className="font-sans text-sm leading-relaxed text-[#55575A]">
                  Dapatkan tautan sederhana yang mudah diingat dan dibagikan.
                </p>
              </div>

              <div className="border-t border-[#E7E5E0] pt-4">
                <span className="mb-2 block font-mono text-xs text-[#008B8B]">
                  03
                </span>

                <h3 className="font-sans mb-1.5 text-base font-semibold text-[#1F2022]">
                  Lacak tautan Anda
                </h3>

                <p className="font-sans text-sm leading-relaxed text-[#55575A]">
                  Lihat aktivitas klik dasar dari dasbor Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-5xl px-6 py-20"
        >
          <div className="mb-12 max-w-xl">
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-[#008B8B]">
              Filosofi Desain
            </span>

            <h2 className="mb-3 font-serif text-3xl font-normal text-[#1F2022]">
              Dibuat untuk kegunaan praktis.
            </h2>

            <p className="font-sans text-sm leading-relaxed text-[#55575A]">
              Buat tautan pendek yang sederhana, kelola semuanya di satu tempat, dan pantau kinerjanya.
            </p>
          </div>

          <div className="font-sans grid grid-cols-1 gap-x-12 gap-y-10 border-t border-[#E7E5E0] pt-8 md:grid-cols-2">
            <Feature
              title="Buat tautan pendek"
              description="Ubah URL yang panjang menjadi tautan yang rapi dan ringkas, serta mudah dibagikan dan dikelola."
            />

            <Feature
              title="Manajemen dasbor"
              description="Kelola tautan yang telah Anda buat dari satu dasbor terpusat."
            />

            <Feature
              title="Pelacakan klik dasar"
              description="Lihat jumlah klik dasar untuk tautan Anda dan pahami kinerjanya."
            />

            <Feature
              title="Akun & autentikasi"
              description="Daftar, verifikasi email Anda, dan atur ulang kata sandi jika diperlukan."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="flex flex-col items-center rounded-md border border-[#E7E5E0] bg-white p-8 text-center sm:p-12">
            <h2 className="mb-3 font-serif text-3xl font-normal text-[#1F2022] sm:text-4xl">
              Siap menyederhanakan tautan Anda?
            </h2>

            <p className="font-sans mb-6 max-w-md text-sm leading-relaxed text-[#55575A] sm:text-base">
              Buat tautan yang rapi dalam hitungan detik, lacak klik dasar,
              dan kelola semuanya dari dasbor yang sederhana.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="rounded bg-[#008B8B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1F2055]"
              >
                Get started
              </Link>

              <Link
                href="/login"
                className="rounded bg-[#696969] px-5 py-2.5 text-sm font-medium text-[#F8F8FF] transition-colors hover:text-[#F8F8FF] hover:bg-[#1F2055] "
              >
                Sign in 
              </Link>
            </div>
          </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E0] bg-[#E0FFFF] py-12">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-8 px-6 md:flex-row md:items-baseline">
          <div>
            <Link
              href="/"
              className="font-serif text-xl font-medium tracking-tight text-[#008B8B]"
            >
              ShortLink
              <span className="text-[#BA5C44]"></span>
            </Link>

            
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#55575A]">
            <a
              href="#features"
              className="transition-colors hover:text-[#1F2022]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#1F2022]"
            >
              How it works
            </a>

            <Link
              href="/login"
              className="transition-colors hover:text-[#1F2022]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-[#1F2022]"
            >
              Register
            </Link>

            <span className="text-[#D6D3CE]">|</span>

            <span className="font-mono text-[#A3A3A3]">
              © Shortlink By Irgi Kurniawan
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-[#1F2022]">
        <span className="font-mono text-sm text-[#4D5D4B]">—</span>
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[#55575A]">
        {description}
      </p>
    </div>
  );
}