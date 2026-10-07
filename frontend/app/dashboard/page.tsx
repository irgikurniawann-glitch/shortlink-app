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

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
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

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();

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
          body: JSON.stringify({
            url: editUrl,
          }),
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
          item.code === editingItem.code
            ? { ...item, url: result.data.url }
            : item
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
    if (!window.confirm("Yakin ingin menghapus short link ini?")) {
      return;
    }

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

      setShortLinks((current) =>
        current.filter((link) => link.code !== code)
      );
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const totalClicks = shortLinks.reduce(
    (acc, curr) => acc + (curr.clicks || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F0FFFF] text-[#1F2022]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#DDEDEC] bg-[#E0FFFF]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-serif text-2xl font-medium tracking-tight text-[#008B8B]"
          >
            ShortLink
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="font-sans rounded border border-[#D9D6D0] bg-white px-4 py-2 text-sm font-medium text-[#55575A] transition-colors hover:border-[#008B8B] hover:text-[#008B8B]"
          >
            Keluar
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="px-6 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Dashboard Header */}
          <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-sm font-medium text-[#008B8B]">
                Dashboard
              </p>

              <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#1F2022] sm:text-4xl">
                Kelola Short Link
              </h1>

              <p className="font-sans mt-3 max-w-xl text-sm leading-relaxed text-[#55575A]">
                Kelola tautan singkat dan pantau statistik kunjungan
                kamu secara real-time.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="font-sans min-w-[120px] rounded-md border border-[#E7E5E0] bg-white px-5 py-4 shadow-sm">
                <span className="block text-xs font-medium text-[#77797C]">
                  Total Link
                </span>

                <span className="mt-1 block font-serif text-2xl text-[#008B8B]">
                  {shortLinks.length}
                </span>
              </div>

              <div className="font-sans min-w-[120px] rounded-md border border-[#E7E5E0] bg-white px-5 py-4 shadow-sm">
                <span className="block text-xs font-medium text-[#77797C]">
                  Total Klik
                </span>

                <span className="mt-1 block font-serif text-2xl text-[#BA5C44]">
                  {totalClicks}
                </span>
              </div>
            </div>
          </section>

          {/* Create Short Link */}
          <section className="rounded-md border border-[#E7E5E0] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1F2022]">
                Buat Short Link Baru
              </h2>

              <p className="font-sans mt-2 text-sm text-[#55575A]">
                Masukkan URL tujuan dan gunakan custom slug jika
                diperlukan.
              </p>
            </div>

            <form onSubmit={handleCreate} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="url"
                  className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
                >
                  URL Tujuan
                </label>

                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://contoh.com/halaman-panjang"
                  required
                  className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="customCode"
                  className="font-sans mb-2 block text-sm font-medium text-[#55575A]"
                >
                  Custom Slug{" "}
                  <span className="font-sans font-normal text-[#999B9D]">
                    (opsional)
                  </span>
                </label>

                <input
                  id="customCode"
                  type="text"
                  value={customCode}
                  onChange={(event) =>
                    setCustomCode(
                      event.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="promo-2026"
                  className="font-sans w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] placeholder:text-[#A3A3A3] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
                />
              </div>

              {message && (
                <div
                  role="alert"
                  className="rounded border border-[#E7B8AE] bg-[#FFF4F1] px-4 py-3 text-sm text-[#BA5C44]"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="font-sans w-full rounded bg-[#008B8B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#006F6F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Membuat Short Link..." : "Buat Short Link"}
              </button>
            </form>
          </section>

          {/* Link List */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1F2022]">
                  Daftar Tautan
                </h2>

                <p className="font-sans mt-1 text-sm text-[#77797C]">
                  Semua short link yang kamu buat.
                </p>
              </div>

              <span className="font-sans text-sm font-medium text-[#008B8B]">
                {shortLinks.length} link
              </span>
            </div>

            {fetching ? (
              <div className="rounded-md border border-[#E7E5E0] bg-white p-12 text-center shadow-sm">
                <p className="text-sm text-[#77797C]">
                  Memuat data link...
                </p>
              </div>
            ) : shortLinks.length === 0 ? (
              <div className="rounded-md border border-dashed border-[#C9D8D7] bg-white p-12 text-center">
                <p className="font-sans text-sm text-[#77797C]">
                  Belum ada short link yang dibuat.
                </p>

                <p className="font-sans mt-1 text-sm text-[#999B9D]">
                  Buat link pertama kamu menggunakan form di atas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortLinks.map((link) => (
                  <div
                    key={link.id || link.code}
                    className="rounded-md border border-[#E7E5E0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Link Info */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-xl text-[#008B8B]">
                            /{link.code}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopy(link.code)}
                            className="rounded border border-[#D9D6D0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#55575A] transition-colors hover:border-[#008B8B] hover:text-[#008B8B]"
                          >
                            {copiedCode === link.code
                              ? "✓ Tersalin"
                              : "Salin"}
                          </button>
                        </div>

                        <p className="mt-3 max-w-2xl truncate text-sm text-[#77797C]">
                          {link.url}
                        </p>

                        <div className="mt-3">
                          <span className="inline-flex rounded bg-[#F0FAF9] px-3 py-1 text-xs font-medium text-[#008B8B]">
                            {link.clicks} kali diklik
                          </span>
                        </div>

                        {/* QR Code */}
                        {qrCode === link.code && (
                          <div className="mt-5 rounded-md border border-[#E7E5E0] bg-[#FAF8F5] p-5">
                            <div className="inline-block rounded border border-[#E7E5E0] bg-white p-3">
                              <QRCodeCanvas
                                id={`qr-${link.code}`}
                                value={`${window.location.origin}/${link.code}`}
                                size={150}
                                level="H"
                              />
                            </div>

                            <p className="mt-4 text-sm text-[#77797C]">
                              Scan QR Code ini untuk membuka tautan
                              langsung.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadQR(link.code)
                              }
                              className="mt-4 rounded border border-[#008B8B] px-4 py-2 text-sm font-medium text-[#008B8B] transition-colors hover:bg-[#008B8B] hover:text-white"
                            >
                              Download QR (.PNG)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap gap-2 border-t border-[#E7E5E0] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setQrCode(
                              qrCode === link.code
                                ? null
                                : link.code
                            )
                          }
                          className="rounded border border-[#D9D6D0] bg-white px-4 py-2 text-sm font-medium text-[#55575A] transition-colors hover:border-[#008B8B] hover:text-[#008B8B]"
                        >
                          {qrCode === link.code
                            ? "Tutup QR"
                            : "QR Code"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditing(link)}
                          className="rounded border border-[#D9D6D0] bg-white px-4 py-2 text-sm font-medium text-[#55575A] transition-colors hover:border-[#008B8B] hover:text-[#008B8B]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(link.code)}
                          className="rounded border border-[#E7B8AE] bg-[#FFF8F6] px-4 py-2 text-sm font-medium text-[#BA5C44] transition-colors hover:bg-[#BA5C44] hover:text-white"
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

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2022]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-[#E7E5E0] bg-white p-7 shadow-xl">
            <h3 className="font-serif text-2xl font-normal tracking-tight text-[#1F2022]">
              Edit Target URL
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[#77797C]">
              Ubah tujuan URL untuk slug{" "}
              <span className="font-medium text-[#008B8B]">
                /{editingItem.code}
              </span>
            </p>

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="editUrl"
                  className="mb-2 block text-sm font-medium text-[#55575A]"
                >
                  URL Baru
                </label>

                <input
                  id="editUrl"
                  type="url"
                  value={editUrl}
                  onChange={(event) =>
                    setEditUrl(event.target.value)
                  }
                  required
                  className="w-full rounded border border-[#D9D6D0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F2022] outline-none transition focus:border-[#008B8B] focus:ring-1 focus:ring-[#008B8B]/20"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E7E5E0] pt-5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded border border-[#D9D6D0] bg-white px-5 py-2.5 text-sm font-medium text-[#55575A] transition-colors hover:border-[#1F2022] hover:text-[#1F2022]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="rounded bg-[#008B8B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006F6F] disabled:cursor-not-allowed disabled:opacity-60"
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