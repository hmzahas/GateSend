import * as mupdf from 'mupdf';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import fs from 'fs';

const buffer = fs.readFileSync('C:/Users/hamzah/Documents/20260000068050 gatepass.pdf');
const doc = mupdf.Document.openDocument(buffer, 'application/pdf');
const totalPages = doc.countPages();
console.log('Total pages:', totalPages);

const worker = await createWorker('eng');

for (let i = 0; i < totalPages; i++) {
  const page = doc.loadPage(i);
  const pixmap = page.toPixmap(mupdf.Matrix.scale(4.0, 4.0), mupdf.ColorSpace.DeviceRGB, false, false);
  const imgBuffer = await sharp(Buffer.from(pixmap.asPNG())).jpeg({ quality: 95 }).toBuffer();
  const meta = await sharp(imgBuffer).metadata();
  const cropBuffer = await sharp(imgBuffer)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.25) })
    .toBuffer();
  const { data: { text } } = await worker.recognize(cropBuffer);
  const spnu = text.match(/SPNU\d+/gi)?.[0]?.toUpperCase() || 'TIDAK ADA';
  console.log(`Page ${i + 1}: ${spnu}`);
}

await worker.terminate();
