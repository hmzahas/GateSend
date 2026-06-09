import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import sharp from "sharp";
import { createWorker } from "tesseract.js";

export const maxDuration = 300;

const SPNU_REGEX = /SPNU\d+/gi;

function extractSPNU(text: string): string {
  const matches = text.match(SPNU_REGEX);
  return matches ? matches[0].toUpperCase() : "";
}

async function pdfToPages(buffer: Buffer): Promise<{ imageBase64: string; spnu: string }[]> {
  const mupdf = await import("mupdf");

  const doc = mupdf.Document.openDocument(buffer, "application/pdf");
  const totalPages = doc.countPages();
  const results: { imageBase64: string; spnu: string }[] = [];

  const ocrWorker = await createWorker("eng");

  for (let i = 0; i < totalPages; i++) {
    const page = doc.loadPage(i);
    const pixmap = page.toPixmap(mupdf.Matrix.scale(2.0, 2.0), mupdf.ColorSpace.DeviceRGB, false, false);
    const imgBuffer = await sharp(Buffer.from(pixmap.asPNG())).jpeg({ quality: 80 }).toBuffer();

    const meta = await sharp(imgBuffer).metadata();
    const cropBuffer = await sharp(imgBuffer)
      .extract({ left: 0, top: 0, width: meta.width!, height: Math.floor(meta.height! * 0.25) })
      .resize({ width: 800 })
      .toBuffer();

    const { data: { text } } = await ocrWorker.recognize(cropBuffer);
    const spnu = extractSPNU(text);

    results.push({ imageBase64: imgBuffer.toString("base64"), spnu });
  }

  await ocrWorker.terminate();
  return results;
}

async function wordToPages(buffer: Buffer): Promise<{ imageBase64: string; spnu: string }[]> {
  const { value: text } = await mammoth.extractRawText({ buffer });
  const spnu = extractSPNU(text);

  const width = 1240;
  const lineHeight = 30;
  const lines = text.split("\n").filter((l) => l.trim()).slice(0, 50);
  const height = Math.max(300, lines.length * lineHeight + 100);

  const svgLines = lines
    .map(
      (line, i) =>
        `<text x="50" y="${70 + i * lineHeight}" font-size="20" fill="#222" font-family="Arial">${line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .substring(0, 85)}</text>`
    )
    .join("\n");

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="white"/>
    ${svgLines}
  </svg>`;

  const imgBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer();
  return [{ imageBase64: imgBuffer.toString("base64"), spnu }];
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();

    let pages: { imageBase64: string; spnu: string }[];

    if (name.endsWith(".pdf")) {
      pages = await pdfToPages(buffer);
    } else if (name.endsWith(".doc") || name.endsWith(".docx")) {
      pages = await wordToPages(buffer);
    } else {
      return NextResponse.json({ error: "Format tidak didukung. Gunakan PDF, DOC, atau DOCX." }, { status: 400 });
    }

    return NextResponse.json({
      pages: pages.map((p, i) => ({ pageIndex: i, ...p })),
    });
  } catch (err: unknown) {
    console.error("PROCESS ERROR:", err);
    const msg = err instanceof Error ? err.message : "Gagal memproses file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
