import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join("/tmp", "settings.json");

const DEFAULT = {
  numbers: [
    { label: "Nomor 1", value: "085199564516" },
    { label: "Nomor 2", value: "" },
    { label: "Nomor 3", value: "" },
  ],
};

async function readSettings() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT;
  }
}

export async function GET() {
  return NextResponse.json(await readSettings());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await fs.writeFile(FILE, JSON.stringify(body));
  return NextResponse.json({ success: true });
}
