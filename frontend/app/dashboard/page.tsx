"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

type ShortLink = {
  id: string;
  code: string;
  url: string;
  clicks: number;
  createdAt?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // State untuk modal edit
  const [editingItem, setEditingItem] = useState<ShortLink | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  const fetchShortLinks = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/shortlinks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setShortLinks(result.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar link:", error);
    } finally {
      setFetching(false);
    }
  }, [apiUrl, getAuthToken, handleUnauthorized]);

  useEffect(() => {
    fetchShortLinks();
    const interval = setInterval(() => {
      fetchShortLinks();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchShortLinks]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/shortlinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          code: customCode || undefined,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setMessage(result.message || "Gagal membuat short link.");
        return;
      }

      setShortLinks((current) => [result.data, ...current]);
      setUrl("");
      setCustomCode("");
    } catch (error) {
      console.error(error);
      setMessage("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadQR = (code: string) => {
    const canvas = document.getElementById(
      `qr-${code}`
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `qr-${code}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const startEditing = (link: ShortLink) => {
    setEditingItem(link);
    setEditUrl(link.url);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const token = getAuthToken();
    if (!token) {
      handleUnauthorized();
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/shortlinks/${editingItem.code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: editUrl }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        alert(result.message || "Gagal memperbarui short link");
        return;
      }

      setShortLinks((current) =>
        current.map((item) =>
          item.code === editingItem.code ? { ...item, url: result.data.url } : item
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm("Yakin ingin menghapus short link ini?")) return;

    const token = getAuthToken();
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/shortlinks/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        alert(result.message || "Gagal menghapus short link");
        return;
      }

      setShortLinks((current) => current.filter((link) => link.code !== code));
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const totalClicks = shortLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Soft Background Grid Decorator */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-xs">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-slate-900 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
          >
            Shortlink<span className="text-indigo-600">.</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 active:scale-95"
          >
            Keluar
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Header Dashboard & Ringkasan Statistik */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Dashboard Link
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Kelola tautan singkat dan pantau statistik kunjungan kamu.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-3 shadow-xs min-w-[120px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Link</span>
                <span className="text-xl font-extrabold text-indigo-600">{shortLinks.length}</span>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-3 shadow-xs min-w-[120px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Klik</span>
                <span className="text-xl font-extrabold text-purple-600">{totalClicks}</span>
              </div>
            </div>
          </div>

          {/* Form Buat Link */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-base font-bold text-slate-900">
              Buat Short Link Baru
            </h2>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  URL Tujuan
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://contoh-tautan-panjang.com/halaman"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="customCode"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Custom Slug <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input
                  id="customCode"
                  type="text"
                  value={customCode}
                  onChange={(e) =>
                    setCustomCode(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="promo-2026"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              {message && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Membuat Short Link..." : "Shorten Link"}
              </button>
            </form>
          </section>

          {/* List Link */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Daftar Tautan
              </h2>
              <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-semibold text-slate-600">
                {shortLinks.length} total
              </span>
            </div>

            {fetching ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-sm text-slate-400 shadow-xs">
                Memuat data link...
              </div>
            ) : shortLinks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
                <p className="text-sm font-medium text-slate-500">
                  Belum ada short link yang dibuat. Mulai buat link pertama kamu di atas!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {shortLinks.map((link) => (
                  <div
                    key={link.id || link.code}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-indigo-600 text-base">
                            /{link.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.code)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            {copiedCode === link.code ? "✓ Tersalin" : "📋 Salin"}
                          </button>
                        </div>

                        <p className="truncate text-xs text-slate-500 max-w-lg">
                          {link.url}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                             {link.clicks} kali diklik
                          </span>
                        </div>

                        {/* QR Code Container */}
                        {qrCode === link.code && (
                          <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                              <QRCodeCanvas
                                id={`qr-${link.code}`}
                                value={`${window.location.origin}/${link.code}`}
                                size={150}
                                level="H"
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              Scan QR Code ini untuk membuka tautan langsung.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDownloadQR(link.code)}
                              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                            >
                              Download QR (.PNG)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Control Buttons */}
                      <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => setQrCode(qrCode === link.code ? null : link.code)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          {qrCode === link.code ? "Tutup QR" : "QR Code"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditing(link)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(link.code)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal Edit URL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Edit Target URL
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Ubah tujuan URL untuk slug <span className="font-semibold text-indigo-600">/{editingItem.code}</span>
            </p>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Baru
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 active:scale-95 disabled:opacity-50"
                >
                  {updating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}