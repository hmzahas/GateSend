"use client";
import { useEffect, useState } from "react";

export default function WAConnect() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/wa-status");
        const data = await res.json();
        if (data.connected) {
          setStatus("connected");
        } else {
          setStatus("disconnected");
          setQrSrc("/api/wa-qr?t=" + Date.now());
        }
      } catch {
        setStatus("disconnected");
      }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">📱 Koneksi WhatsApp Pengirim</h1>

        {status === "loading" && <p className="text-gray-500 text-sm">Menghubungkan ke WA server...</p>}

        {status === "connected" && (
          <div className="mt-4">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-600 font-semibold">WhatsApp Terkoneksi!</p>
            <p className="text-gray-400 text-sm mt-1">Siap mengirim dokumen</p>
            <a href="/" className="mt-4 inline-block bg-green-600 text-white text-sm px-5 py-2 rounded-xl">
              Kembali ke Beranda
            </a>
          </div>
        )}

        {status === "disconnected" && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm mb-4">
              Scan QR ini dengan WhatsApp pengirim<br />
              <span className="text-gray-400 text-xs">Linked Devices → Link a Device</span>
            </p>
            <iframe
              src={qrSrc}
              className="w-full rounded-xl border border-gray-100"
              style={{ height: 420 }}
              title="QR WhatsApp"
            />
          </div>
        )}
      </div>
    </main>
  );
}
