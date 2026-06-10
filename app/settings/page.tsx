"use client";
import { useEffect, useState } from "react";

type NumberEntry = { label: string; value: string };

export default function Settings() {
  const [numbers, setNumbers] = useState<NumberEntry[]>([
    { label: "Nomor 1", value: "" },
    { label: "Nomor 2", value: "" },
    { label: "Nomor 3", value: "" },
  ]);
  const [saved, setSaved] = useState(false);
  const [waConnected, setWaConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => setNumbers(data.numbers));
    fetch("/api/wa-status").then(r => r.json()).then(data => setWaConnected(data.connected));
  }, []);

  async function save() {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <a href="/" className="text-gray-400 hover:text-gray-600">← Kembali</a>
          <h1 className="text-xl font-bold text-gray-800">⚙️ Pengaturan</h1>
        </div>

        {/* Status WA Pengirim */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="font-medium text-gray-700 mb-3">📱 WhatsApp Pengirim</p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${waConnected ? "text-green-600" : "text-red-500"}`}>
              {waConnected === null ? "Memeriksa..." : waConnected ? "✅ Terkoneksi" : "❌ Tidak Terkoneksi"}
            </span>
            <a
              href="/wa-connect"
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {waConnected ? "Ganti Pengirim" : "Hubungkan"}
            </a>
          </div>
        </div>

        {/* Nomor Tujuan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="font-medium text-gray-700 mb-4">📲 Nomor Tujuan WhatsApp</p>
          <div className="flex flex-col gap-3">
            {numbers.map((n, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Label (cth: HRD)`}
                  value={n.label}
                  onChange={e => setNumbers(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-28 focus:outline-none focus:border-green-400"
                />
                <input
                  type="text"
                  placeholder={`Nomor ${i + 1} (08xxx)`}
                  value={n.value}
                  onChange={e => setNumbers(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:border-green-400"
                />
              </div>
            ))}
          </div>
          <button
            onClick={save}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl text-sm transition-colors"
          >
            {saved ? "✓ Tersimpan!" : "Simpan"}
          </button>
        </div>
      </div>
    </main>
  );
}
