# SPNU WA Sender

Upload file PDF/Word → Convert tiap halaman ke JPG → Deteksi kode SPNU → Kirim otomatis ke WhatsApp `081380680631`.

## Setup Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Konfigurasi WhatsApp (Fonnte)

1. Daftar gratis di https://fonnte.com
2. Login → **Device** → **Add Device** → Scan QR dengan HP pengirim
3. Copy **Token**
4. Isi di `.env.local`:
   ```
   FONNTE_TOKEN=token_anda_disini
   ```

## Deploy ke Vercel

1. Push folder ini ke GitHub
2. Import di https://vercel.com
3. Tambah **Environment Variable**:
   - Key: `FONNTE_TOKEN`
   - Value: token dari Fonnte
4. Deploy

## Alur Sistem

```
Upload File (PDF/DOCX)
       ↓
Convert tiap halaman → JPG
       ↓
Deteksi kode SPNU per halaman
       ↓
Preview di browser
       ↓
Kirim ke WA 081380680631
Format: "Halo, terlampir dokumen dengan kode SPNU409093. Mohon diproses. Terima kasih."
```
