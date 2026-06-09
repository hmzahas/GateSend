const mupdf = require('mupdf');
const fs = require('fs');
const sharp = require('sharp');

async function run() {
  const buffer = fs.readFileSync('C:/Users/hamzah/Documents/20260000068050 gatepass.pdf');
  
  const doc = mupdf.Document.openDocument(buffer, 'application/pdf');
  const page = doc.loadPage(0);
  
  const bounds = page.getBounds();
  console.log('Page bounds:', bounds);

  const scale = 3.0;
  const matrix = mupdf.Matrix.scale(scale, scale);
  const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
  
  const png = pixmap.asPNG();
  const imgBuffer = await sharp(Buffer.from(png)).jpeg({ quality: 90 }).toBuffer();
  fs.writeFileSync('C:\\xampp\\htdocs\\Client\\contoh\\mupdf-test.jpg', imgBuffer);
  
  const meta = await sharp(imgBuffer).metadata();
  const stats = await sharp(imgBuffer).greyscale().stats();
  console.log('Output:', meta.width, 'x', meta.height);
  console.log('Contrast:', stats.channels[0].stdev.toFixed(1));
}
run().catch(e => console.error('ERROR:', e.message));
