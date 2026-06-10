import { NextResponse } from "next/server";

const WA_SERVER_URL = process.env.WA_SERVER_URL!;

export async function GET() {
  try {
    const res = await fetch(`${WA_SERVER_URL}/qr`);
    const html = await res.text();
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch {
    return new NextResponse("<p>Gagal mengambil QR</p>", { headers: { "Content-Type": "text/html" } });
  }
}
