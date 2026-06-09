import * as mupdf from 'mupdf';
import fs from 'fs';

const buffer = fs.readFileSync('C:/Users/hamzah/Documents/20260000068050 gatepass.pdf');
const doc = mupdf.Document.openDocument(buffer, 'application/pdf');

console.log('Total pages:', doc.countPages());

for (let i = 0; i < doc.countPages(); i++) {
  const page = doc.loadPage(i);
  const json = JSON.parse(page.toStructuredText('preserve-whitespace').asJSON());
  const text = json.blocks?.flatMap(b =>
    b.lines?.flatMap(l => l.spans?.map(s => s.text) ?? []) ?? []
  ).join(' ') ?? '';

  console.log(`\n=== Page ${i+1} ===`);
  console.log('Full text:', text || '(KOSONG - kemungkinan PDF berisi gambar/scan)');

  const spnu = text.match(/SPNU\d+/gi);
  console.log('SPNU ditemukan:', spnu || 'TIDAK ADA');
}
