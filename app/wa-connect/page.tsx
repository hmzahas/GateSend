"use client";
import { useEffect, useState } from "react";

export default function WAConnect() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [qrImg, setQrImg] = useState("");
  const [qrTs, setQrTs] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch("http://localhost:3001/qr-data");
        const data = await res.json();
        if (data.connected) {
          setStatus("connected");
          return;
        }
        setStatus("disconnected");
        if (data.qr && data.ts !== qrTs) {
          setQrImg(data.qr);
          setQrTs(data.ts);
        }
      } catch {
        setStatus("disconnected");
      }
      timer = setTimeout(poll, 4000);
    };

    poll();
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">📱 Koneksi WhatsApp</h1>

        {status === "loading" && (
          <p className="text-gray-500 text-sm">Menghubungkan ke WA server...</p>
        )}

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
            {qrImg ? (
              <>
                <p className="text-gray-600 text-sm mb-3">
                  Scan QR ini dengan WhatsApp<br />
                  <span className="text-gray-400 text-xs">Linked Devices → Link a Device</span>
                </p>
                <img src={qrImg} alt="QR WhatsApp" className="w-64 h-64 mx-auto rounded-xl border border-gray-100" />
                <p className="text-gray-400 text-xs mt-2">QR akan diperbarui otomatis jika expired</p>
              </>
            ) : (
              <div className="py-8">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Memuat QR Code...</p>
                <p className="text-gray-400 text-xs mt-1">Mohon tunggu ~30 detik</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
