import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPNU WA Sender",
  description: "Kirim dokumen SPNU ke WhatsApp otomatis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
