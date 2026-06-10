import { NextResponse } from "next/server";

const WA_SERVER_URL = process.env.WA_SERVER_URL!;

export async function GET() {
  try {
    const res = await fetch(`${WA_SERVER_URL}/status`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ connected: false });
  }
}
