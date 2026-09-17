"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // State untuk modal/inline edit
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Dashboard Link
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola dan pantau seluruh tautan singkat kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition shadow-sm"
          >
            Keluar
          </button>
        </header>

        {/* Form Buat Link */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Buat Short Link Baru
          </h2>

          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1"
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
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="customCode"
                className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1"
              >
                Custom Slug <span className="text-gray-400 font-normal">(opsional)</span>
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
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
            </div>

            {message && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Membuat..." : "Shorten Link"}
            </button>
          </form>
        </section>

        {/* List Link */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Daftar Tautan
            </h2>
            <span className="text-xs font-medium text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">
              {shortLinks.length} total
            </span>
          </div>

          {fetching ? (
            <div className="p-8 text-center text-sm text-gray-400">
              Memuat data...
            </div>
          ) : shortLinks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Belum ada short link yang dibuat.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {shortLinks.map((link) => (
                <div
                  key={link.id || link.code}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          /{link.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.code)}
                          className="text-xs text-gray-500 hover:text-black font-medium transition"
                        >
                          {copiedCode === link.code ? "✓ Tersalin" : "Salin"}
                        </button>
                      </div>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {link.url}
                      </p>
                      {qrCode === link.code && (
  <div className="mt-4 flex flex-col items-start gap-2">
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <QRCodeCanvas
  id={`qr-${link.code}`}
  value={`${window.location.origin}/${link.code}`}
  size={160}
  level="H"
/>
    </div>

    <p className="text-xs text-gray-400">
      Scan QR Code untuk membuka short link.
    </p>
    <button
  type="button"
  onClick={() => handleDownloadQR(link.code)}
  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black transition"
>
  Download QR
</button>
  </div>
)}

                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span>{link.clicks} kali diklik</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
  <button
    type="button"
    onClick={() =>
      setQrCode(qrCode === link.code ? null : link.code)
    }
    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
  >
    QR Code
  </button>

  <button
    type="button"
    onClick={() => startEditing(link)}
    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(link.code)}
    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
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

      {/* Modal Edit URL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">
              Edit Target URL
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ubah tujuan untuk slug <span className="font-bold text-gray-800">/{editingItem.code}</span>
            </p>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL Baru
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black transition disabled:opacity-50"
                >
                  {updating ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}