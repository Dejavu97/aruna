# Aruna

Undangan pernikahan digital: pilih tema, unggah foto, order masuk admin, RSVP tersimpan.

## Jalankan di laptop

```bash
cd aruna-undangan
npm install
npm run dev
```

Buka http://127.0.0.1:5173

## Deploy ke Vercel (tanpa VPS)

Bisa. Vercel yang menampung website + API. Yang tidak bisa hanya folder file biasa — di Vercel file itu hilang tiap deploy. Makanya pakai **Vercel Blob** (gratis) untuk foto dan data order.

1. Push folder ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → Add New → Project → pilih repo itu.
3. Deploy sekali (biar project terbentuk).
4. Di project: **Storage** → Create Database → **Blob** → Connect to this project.  
   Ini otomatis menambah `BLOB_READ_WRITE_TOKEN`.
5. **Settings → Environment Variables**, isi:
   - `ADMIN_PASSWORD` — ganti dari `aruna2026`
   - `OWNER_BANK` — contoh `BCA`
   - `OWNER_BANK_NAME` — nama rekening
   - `OWNER_BANK_NUMBER` — nomor rekening
6. Redeploy (Deployments → … → Redeploy).

Selesai. URL-nya langsung `https://nama-project.vercel.app`.

Tanpa langkah 4 (Blob), landing dan preview tema tetap hidup, tapi **order dan foto tidak tersimpan**.

## Jualan dari laptop (tanpa Vercel)

```bash
npm run build
npm start
```

Buka http://127.0.0.1:8787

## Yang harus diganti

- `src/data/site.js` — brand, WhatsApp, harga
- Lokal: `server/data/settings.json`
- Vercel: environment variables di atas
