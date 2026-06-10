import { NextResponse } from "next/server";

const WA_SERVER_URL = process.env.WA_SERVER_URL!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

export async function POST() {
  try {
    const res = await fetch(`${WA_SERVER_URL}/logout`, {
      method: "POST",
      headers: { "x-auth-secret": AUTH_SECRET },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Gagal disconnect" }, { status: 500 });
  }
}
