import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const DEFAULT_NUMBER = "085199564516";
const WA_SERVER_URL = process.env.WA_SERVER_URL!;
const AUTH_SECRET = process.env.AUTH_SECRET || "gatesend_secret_2024";

export async function POST(req: NextRequest) {
  try {
    const { number, spnu, imageBase64, pageIndex } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "Data gambar kosong" }, { status: 400 });

    const target = number || DEFAULT_NUMBER;
    const message = spnu ? `${spnu}` : `Halaman ${pageIndex + 1}`;

    const res = await fetch(`${WA_SERVER_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-secret": AUTH_SECRET,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ number: target, message, imageBase64 }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error || "Gagal kirim" }, { status: res.status });

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengirim ke WhatsApp";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
