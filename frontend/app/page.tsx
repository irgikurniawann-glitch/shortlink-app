"use client";

import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [shortLinks, setShortLinks] = useState<
  {
    id: string;
    code: string;
    url: string;
    clicks: number;
  }[]
>([]);
const [editingCode, setEditingCode] = useState<string | null>(null);
  useEffect(() => {
    const fetchShortLinks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/shortlinks`
        );

        const result = await response.json();

        if (response.ok) {
          setShortLinks(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil short link:", error);
      }
    };

    fetchShortLinks();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shortlinks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            code: customCode || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal membuat short link"
        );
      }

      const code = result.data.code;

      setShortUrl(
        `${window.location.origin}/${code}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[90vh] max-w-3xl items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl shadow-lg">
              🔗
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Shortlink
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Buat link pendek yang simpel dan mudah
              dibagikan.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <form onSubmit={handleSubmit}>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                URL asli
              </label>

              <input
                type="url"
                placeholder="https://contoh.com/url-panjang"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="mb-5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />

              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Nama short link
                <span className="ml-2 font-normal text-slate-400">
                  (opsional)
                </span>
              </label>

              <div className="mb-2 flex items-center rounded-xl border border-slate-300 bg-slate-50 focus-within:border-slate-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <span className="pl-4 text-sm text-slate-400">
                  /
                </span>

                <input
                  type="text"
                  placeholder="video-kucing"
                  value={customCode}
                  onChange={(e) =>
                    setCustomCode(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    )
                  }
                  className="w-full bg-transparent px-2 py-3.5 text-base outline-none"
                />
              </div>

              <p className="mb-6 text-xs text-slate-400">
                Kosongkan jika ingin nama dibuat otomatis.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Membuat..." : "Buat Short Link"}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {shortUrl && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="mb-3 text-sm font-semibold text-emerald-700">
                  ✓ Short link berhasil dibuat
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 break-all rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-emerald-400"
                  >
                    {shortUrl}
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
                    {shortLinks.length > 0 && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <h2 className="mb-5 text-xl font-bold">
                Short link saya
              </h2>

              <div className="space-y-4">
                {shortLinks.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                     <div className="min-w-0">
  {editingCode === link.code ? (
    <div className="space-y-3">
      <input
        type="url"
        defaultValue={link.url}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />

      <div className="flex gap-2">
       <button
  type="button"
  onClick={async (e) => {
    const container = e.currentTarget.parentElement;
    const input = container?.parentElement?.querySelector(
      "input"
    ) as HTMLInputElement | null;

    if (!input?.value) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shortlinks/${link.code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: input.value,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memperbarui short link"
        );
      }

      setShortLinks((currentLinks) =>
        currentLinks.map((item) =>
          item.id === link.id
            ? result.data
            : item
        )
      );

      setEditingCode(null);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    }
  }}
  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
>
  Simpan
</button>

        <button
          type="button"
          onClick={() => setEditingCode(null)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Batal
        </button>
      </div>
    </div>
  ) : (
    <>
      <a
        href={`${window.location.origin}/${link.code}`}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-semibold text-slate-900 hover:underline"
      >
        {window.location.origin}/{link.code}
      </a>

      <p className="mt-1 break-all text-sm text-slate-500">
        {link.url}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {link.clicks} klik
      </p>
    </>
  )}
</div>

                      <div className="flex gap-2">
                        <button
                           type="button"
                           onClick={() => setEditingCode(link.code)}
                           className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                            Edit
                        </button>

                       <button
  type="button"
  onClick={async () => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus /${link.code}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shortlinks/${link.code}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menghapus short link"
        );
      }

      setShortLinks((currentLinks) =>
        currentLinks.filter(
          (item) => item.id !== link.id
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    }
  }}
  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
>
  Hapus
</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Simple • Fast • Easy to share
          </p>
        </div>
      </div>
    </main>
  );
}
