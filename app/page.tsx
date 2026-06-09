"use client";
import { useState, useRef } from "react";

type PageItem = {
  pageIndex: number;
  spnu: string;
  imageBase64: string;
  status: "idle" | "sending" | "sent" | "error";
};

export default function Home() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  // const TARGET_NUMBER = "085199564516";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    setPages([]);
    setFileName(file.name);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/process", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses file");
      setPages(data.pages.map((p: Omit<PageItem, "status">) => ({ ...p, status: "idle" })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function sendPage(idx: number) {
    const page = pages[idx];
    setPages((prev) => prev.map((p, i) => i === idx ? { ...p, status: "sending" } : p));
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // number: TARGET_NUMBER,
          spnu: page.spnu,
          imageBase64: page.imageBase64,
          pageIndex: page.pageIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal kirim");
      setPages((prev) => prev.map((p, i) => i === idx ? { ...p, status: "sent" } : p));
    } catch {
      setPages((prev) => prev.map((p, i) => i === idx ? { ...p, status: "error" } : p));
    }
  }

  async function sendAll() {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].status !== "sent") await sendPage(i);
    }
  }

  const badge = (s: PageItem["status"]) => {
    const cls = { idle: "bg-gray-100 text-gray-500", sending: "bg-yellow-100 text-yellow-700 animate-pulse", sent: "bg-green-100 text-green-700", error: "bg-red-100 text-red-700" };
    const lbl = { idle: "Belum dikirim", sending: "Mengirim...", sent: "✓ Terkirim", error: "✗ Gagal" };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls[s]}`}>{lbl[s]}</span>;
  };

  const sentCount = pages.filter((p) => p.status === "sent").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">📄 GateSend </h1>
          <p className="text-gray-500 text-sm">Upload PDF/Word → Convert per halaman → Kirim otomatis ke WhatsApp</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-1.5 rounded-full">
            <span>📱</span> Kirim via WhatsApp
          </div>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="bg-white border-2 border-dashed border-green-300 hover:border-green-500 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6 shadow-sm"
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
          <div className="text-5xl mb-3">📂</div>
          <p className="font-semibold text-gray-700">Klik untuk pilih file</p>
          <p className="text-gray-400 text-sm mt-1">Format: PDF, DOC, DOCX</p>
          {fileName && <p className="mt-2 text-green-600 text-sm font-medium">📎 {fileName}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Memproses file ...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">⚠️ {error}</div>
        )}

        {/* Results */}
        {pages.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">{pages.length} halaman terdeteksi</p>
                {sentCount > 0 && <p className="text-green-600 text-sm">{sentCount}/{pages.length} sudah terkirim</p>}
              </div>
              <button
                onClick={sendAll}
                disabled={sentCount === pages.length}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                📤 Kirim Semua ke WA
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pages.map((page, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="relative bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/jpeg;base64,${page.imageBase64}`}
                      alt={`Halaman ${page.pageIndex + 1}`}
                      className="w-full object-contain max-h-72"
                    />
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      Hal. {page.pageIndex + 1}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-400">Kode SPNU</p>
                        <p className="font-bold text-gray-800">{page.spnu || <span className="text-gray-400 font-normal italic">Tidak ditemukan</span>}</p>
                      </div>
                      {badge(page.status)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 mb-3 text-xs text-gray-500 leading-relaxed">
                      {page.spnu ? `kode ${page.spnu}` : `halaman ${page.pageIndex + 1}`}
                    </div>
                    <button
                      onClick={() => sendPage(idx)}
                      disabled={page.status === "sending" || page.status === "sent"}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-xl text-sm transition-colors"
                    >
                      {page.status === "sending" ? "Mengirim..." : page.status === "sent" ? "✓ Terkirim" : "Kirim ke WA"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
