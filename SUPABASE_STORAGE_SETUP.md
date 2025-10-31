# Supabase Storage Setup Guide

Panduan untuk setup Supabase Storage untuk QR Code storage.

## 📋 Prerequisites

1. Akun Supabase (sudah ada)
2. Project Supabase (sudah ada)
3. Supabase URL dan Anon Key

## 🔑 Get Supabase Credentials

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik **Settings** (icon gear) di sidebar kiri
4. Klik **API** di menu Settings
5. Copy credentials berikut:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

## ⚙️ Configuration

Update file `.env` dengan credentials Supabase:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_STORAGE_BUCKET=qr-codes
```

**PENTING**: Ganti `your-project-id` dan `your-anon-key-here` dengan credentials yang sudah di-copy.

## 🪣 Create Storage Bucket

### Option 1: Automatic Setup (Recommended)

Jalankan script setup otomatis:

```bash
npm run supabase:setup
```

Script ini akan:
- ✅ Check apakah bucket sudah ada
- ✅ Create bucket 'qr-codes' jika belum ada
- ✅ Set bucket sebagai public
- ✅ Set file size limit 1MB
- ✅ Set allowed MIME types: image/png

### Option 2: Manual Setup via Dashboard

1. Buka Supabase Dashboard
2. Klik **Storage** di sidebar kiri
3. Klik **Create a new bucket**
4. Isi form:
   - **Name**: `qr-codes`
   - **Public bucket**: ✅ (centang)
   - **File size limit**: `1048576` (1MB)
   - **Allowed MIME types**: `image/png`
5. Klik **Create bucket**

## 🔒 Storage Policies (Optional)

Jika ingin restrict upload/delete operations, tambahkan policies:

### Allow Public Read (Already enabled by public bucket)

```sql
-- Sudah otomatis enabled karena public bucket
```

### Allow Authenticated Upload

```sql
CREATE POLICY "Allow authenticated users to upload QR codes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'qr-codes');
```

### Allow Authenticated Delete

```sql
CREATE POLICY "Allow authenticated users to delete QR codes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'qr-codes');
```

**Note**: Untuk aplikasi ini, backend menggunakan `anon` key, jadi policies di atas optional. Jika ingin lebih secure, gunakan `service_role` key di backend (tapi jangan expose ke frontend).

## ✅ Verify Setup

Test apakah storage sudah berfungsi:

1. Start development server:
   ```bash
   npm run dev
   ```

2. Create lansia baru via API:
   ```bash
   POST http://localhost:5000/api/lansia
   ```

3. Check response, seharusnya ada `qr_code_url` dengan format:
   ```
   https://your-project-id.supabase.co/storage/v1/object/public/qr-codes/lansia-id.png
   ```

4. Buka URL tersebut di browser, seharusnya muncul QR code image.

## 🔍 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi**: Pastikan `.env` sudah di-update dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.

### Error: "Failed to upload QR Code to Supabase"

**Solusi**: 
1. Check apakah bucket `qr-codes` sudah dibuat
2. Check apakah bucket di-set sebagai public
3. Verify credentials di `.env` sudah benar

### QR Code URL tidak bisa diakses (403 Forbidden)

**Solusi**: Pastikan bucket di-set sebagai **public bucket**. Check di Supabase Dashboard → Storage → qr-codes → Settings → Public bucket harus ON.

### Error: "Bucket already exists"

**Solusi**: Ini bukan error, bucket sudah ada. Skip create bucket step.

## 📊 Storage Limits

Supabase Free Tier:
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **File uploads**: Unlimited

Untuk aplikasi Posyandu Lansia:
- QR code size: ~5-10KB per file
- 1GB = ~100,000 - 200,000 QR codes
- Lebih dari cukup untuk use case ini

## 🚀 Migration dari Local Storage

Jika sebelumnya sudah ada QR codes di folder `./uploads/qr`, tidak perlu migrate karena:
1. QR codes akan di-regenerate saat create lansia baru
2. Existing lansia akan regenerate QR code saat pertama kali diakses
3. Old QR codes di local folder bisa dihapus

## 📝 Notes

- QR codes di-generate on-demand saat create lansia
- QR codes di-store dengan nama file: `{lansia_id}.png`
- Public URL format: `https://{project}.supabase.co/storage/v1/object/public/qr-codes/{lansia_id}.png`
- QR codes bisa diakses langsung via URL tanpa authentication
- Upsert enabled: jika QR code sudah ada, akan di-overwrite

## 🎉 Done!

Sekarang aplikasi sudah menggunakan Supabase Storage untuk QR codes. Ready untuk deploy ke Render!
