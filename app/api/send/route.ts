import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const DEFAULT_NUMBER = "081297973803";
const WA_SERVER_URL = process.env.WA_SERVER_URL!;
const AUTH_SECRET = process.env.AUTH_SECRET || "gatesend_secret_2024";

export async function POST(req: NextRequest) {
  try {
    const { number, spnu, imageBase64, pageIndex } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "Data gambar kosong" }, { status: 400 });

    const target = number || DEFAULT_NUMBER;
    const message = spnu ? `${spnu}` : `Halaman ${pageIndex + 1}`;

    console.log("AUTH_SECRET sent:", AUTH_SECRET);
    const res = await fetch(`${WA_SERVER_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-secret": AUTH_SECRET,
      },
      body: JSON.stringify({ number: target, message, imageBase64 }),
    });

    const data = await res.json();
    console.log("WA Server response:", res.status, JSON.stringify(data));
    if (!res.ok) return NextResponse.json({ error: data.error || "Gagal kirim" }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengirim ke WhatsApp";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
