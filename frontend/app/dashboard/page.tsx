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
    <div className="relative flex min-h-screen flex-col bg-[#0a0c08] text-[#E8E9E3] selection:bg-[#D2FF00] selection:text-black font-['Space_Grotesk']">
      {/* Dynamic Background Decorator */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0c08]" />

        {/* Dynamic Glowing Blobs */}
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#D2FF00]/10 blur-[150px] animate-[blobMove_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-10 left-10 h-[450px] w-[450px] rounded-full bg-[#00F0FF]/10 blur-[140px] animate-[blobMove_8s_ease-in-out_infinite_alternate-reverse]" />

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

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0c08]/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="group font-['Syne'] text-xl font-extrabold tracking-tight text-white transition focus-visible:outline-none"
          >
            SHORTLINK<span className="text-[#D2FF00] inline-block transition-transform duration-300 group-hover:scale-150 group-hover:drop-shadow-[0_0_10px_#D2FF00]">.</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
          >
            Keluar
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Header Dashboard & Ringkasan Statistik */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Syne'] text-2xl font-extrabold tracking-tight text-white cursor-default select-none transition-all duration-300 hover:scale-[1.01] text-glow-hover sm:text-3xl">
                Dashboard Link
              </h1>
              <p className="mt-1 text-xs text-white/50">
                Kelola tautan singkat dan pantau statistik kunjungan kamu secara real-time.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="group rounded-[20px] border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 backdrop-blur-2xl min-w-[130px] transition-all duration-300 hover:border-[#D2FF00]/40 hover:bg-white/[0.04]">
                <span className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-[#D2FF00] transition-colors">Total Link</span>
                <span className="font-['Syne'] text-2xl font-extrabold text-[#D2FF00] transition-transform duration-300 inline-block group-hover:scale-105">{shortLinks.length}</span>
              </div>
              <div className="group rounded-[20px] border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 backdrop-blur-2xl min-w-[130px] transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.04]">
                <span className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-cyan-400 transition-colors">Total Klik</span>
                <span className="font-['Syne'] text-2xl font-extrabold text-cyan-400 transition-transform duration-300 inline-block group-hover:scale-105">{totalClicks}</span>
              </div>
            </div>
          </div>

          {/* Form Buat Link */}
          <section className="group relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-2xl transition-all duration-500 hover:border-[#D2FF00]/30 hover:bg-white/[0.04] sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h2 className="font-['Syne'] text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#D2FF00]">
              Buat Short Link Baru
            </h2>

            <form onSubmit={handleCreate} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="url"
                  className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2"
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
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
                />
              </div>

              <div>
                <label
                  htmlFor="customCode"
                  className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2"
                >
                  Custom Slug <span className="text-white/30 font-normal normal-case">(opsional)</span>
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
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
                />
              </div>

              {message && (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400 text-center backdrop-blur-xl shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#D2FF00] py-4 text-[12px] font-bold tracking-[0.15em] uppercase text-black shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all duration-300 hover:bg-[#e0ff4d] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Membuat Short Link..." : "Shorten Link"}
              </button>
            </form>
          </section>

          {/* List Link */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-['Syne'] text-lg font-bold tracking-tight text-white">
                Daftar Tautan
              </h2>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-[#D2FF00]">
                {shortLinks.length} TOTAL
              </span>
            </div>

            {fetching ? (
              <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-12 text-center text-xs text-white/40 backdrop-blur-2xl">
                Memuat data link...
              </div>
            ) : shortLinks.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.01] p-12 text-center backdrop-blur-2xl">
                <p className="text-xs font-medium text-white/40">
                  Belum ada short link yang dibuat. Mulai buat link pertama kamu di atas!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortLinks.map((link) => (
                  <div
                    key={link.id || link.code}
                    className="group rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-2xl transition-all duration-300 hover:border-[#D2FF00]/40 hover:bg-white/[0.04] hover:shadow-[0_10px_30px_-10px_rgba(210,255,0,0.15)]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-['Syne'] text-lg font-extrabold text-[#D2FF00] tracking-tight">
                            /{link.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.code)}
                            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white/80 transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                          >
                            {copiedCode === link.code ? "✓ Tersalin" : "📋 Salin"}
                          </button>
                        </div>

                        <p className="truncate text-xs text-white/50 max-w-lg transition-colors group-hover:text-white/70">
                          {link.url}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D2FF00]/10 border border-[#D2FF00]/30 px-3 py-0.5 text-[10px] font-bold text-[#D2FF00]">
                            ⚡ {link.clicks} KALI DIKLIK
                          </span>
                        </div>

                        {/* QR Code Container */}
                        {qrCode === link.code && (
                          <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
                            <div className="rounded-xl border border-white/20 bg-white p-3 shadow-lg">
                              <QRCodeCanvas
                                id={`qr-${link.code}`}
                                value={`${window.location.origin}/${link.code}`}
                                size={150}
                                level="H"
                              />
                            </div>
                            <p className="text-xs text-white/50">
                              Scan QR Code ini untuk membuka tautan langsung.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDownloadQR(link.code)}
                              className="rounded-full bg-[#D2FF00] px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-black transition-all duration-300 hover:bg-[#e0ff4d] hover:shadow-[0_0_20px_rgba(210,255,0,0.5)]"
                            >
                              Download QR (.PNG)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Control Buttons */}
                      <div className="flex shrink-0 items-center gap-2.5 border-t border-white/[0.06] pt-4 sm:border-t-0 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => setQrCode(qrCode === link.code ? null : link.code)}
                          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.1] hover:text-white"
                        >
                          {qrCode === link.code ? "Tutup QR" : "QR Code"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditing(link)}
                          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.1] hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(link.code)}
                          className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-rose-400 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-[#0a0c08] p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <h3 className="font-['Syne'] text-xl font-bold text-white">
              Edit Target URL
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Ubah tujuan URL untuk slug <span className="font-bold text-[#D2FF00]">/{editingItem.code}</span>
            </p>

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2">
                  URL Baru
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/20 backdrop-blur-xl transition duration-300 focus:border-[#D2FF00] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-full bg-[#D2FF00] px-6 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase text-black shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all duration-300 hover:bg-[#e0ff4d] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] active:scale-95 disabled:opacity-50"
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