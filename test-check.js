const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const canvas = require('canvas');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class NodeCanvasFactory {
  create(w, h) { const c = canvas.createCanvas(w, h); return { canvas: c, context: c.getContext('2d') }; }
  reset(d, w, h) { d.canvas.width = w; d.canvas.height = h; }
  destroy(d) { d.canvas.width = 0; d.canvas.height = 0; }
}
global.Image = canvas.Image;

async function run() {
  const buffer = fs.readFileSync('C:/Users/hamzah/Documents/20260000068050 gatepass.pdf');
  const standardFontDataUrl = path.join(require.resolve('pdfjs-dist/package.json'), '../standard_fonts/');
  const canvasFactory = new NodeCanvasFactory();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer), standardFontDataUrl, canvasFactory }).promise;

  const page = await pdf.getPage(1);
  
  // Cek semua viewport info
  const vp = page.getViewport({ scale: 1.0 });
  console.log('viewBox:', vp.viewBox);
  console.log('width x height (scale 1):', vp.width, 'x', vp.height);

  // Render scale 4 tanpa modifikasi
  const vp4 = page.getViewport({ scale: 4.0 });
  const data = canvasFactory.create(vp4.width, vp4.height);
  await page.render({ canvasContext: data.context, viewport: vp4, canvasFactory }).promise;
  
  const imgBuffer = data.canvas.toBuffer('image/jpeg');
  fs.writeFileSync('check.jpg', imgBuffer);
  
  const meta = await sharp(imgBuffer).metadata();
  console.log('Output:', meta.width, 'x', meta.height);
}
run().catch(e => console.error(e.message));
