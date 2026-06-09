import fs from 'fs';

const FONNTE_TOKEN = 'bbtUVDmAc7ARx5ZQrm8r';
const TARGET = '081380680631';
const base64 = fs.readFileSync('contoh/mupdf-test.jpg', 'base64');

// Cara 1: base64 dengan prefix data URI
console.log('Test cara 1: base64 data URI...');
const form1 = new FormData();
form1.append('target', TARGET);
form1.append('message', 'test cara 1');
form1.append('file', `data:image/jpeg;base64,${base64}`);
const res1 = await fetch('https://api.fonnte.com/send', {
  method: 'POST',
  headers: { Authorization: FONNTE_TOKEN },
  body: form1,
});
console.log('Cara 1:', await res1.text());
