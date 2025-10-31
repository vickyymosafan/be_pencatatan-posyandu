# 🚀 Quick Start Guide - Supabase Storage & Render Deployment

Panduan cepat untuk setup dan deploy backend dengan Supabase Storage.

## ✅ What Changed?

QR Code storage sudah di-refactor dari **local filesystem** ke **Supabase Storage**:

- ❌ ~~`./uploads/qr/` folder~~ → ✅ Supabase Storage bucket
- ❌ ~~Local file system~~ → ✅ Cloud storage (scalable & persistent)
- ❌ ~~Manual file serving~~ → ✅ Public URLs (CDN-ready)

## 📋 Prerequisites Checklist

- [x] Supabase Database (sudah migrate)
- [ ] Supabase Anon Key (perlu di-copy)
- [ ] Supabase Storage Bucket (akan dibuat)
- [ ] GitHub Repository (untuk deploy)

## 🎯 Setup Steps (5 menit)

### Step 1: Get Supabase Keys

Baca panduan lengkap: `GET_SUPABASE_KEYS.md`

**Quick version**:
1. Buka https://app.supabase.com
2. Pilih project → Settings → API
3. Copy **Project URL** dan **anon public** key

### Step 2: Update .env

Buka `be/.env` dan update:

```env
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_STORAGE_BUCKET=qr-codes
```

### Step 3: Install Dependencies

```bash
cd be
npm install
```

### Step 4: Setup Supabase Storage

```bash
npm run supabase:setup
```

Expected output:
```
✅ Bucket 'qr-codes' created successfully
✨ Supabase Storage setup completed!
```

### Step 5: Test Locally

```bash
npm run dev
```

Test create lansia:
```bash
curl -X POST http://localhost:5000/api/lansia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nama": "Test Lansia",
    "nik": "1234567890123456",
    "tanggal_lahir": "1950-01-01",
    "alamat": "Test Address",
    "penyakit_bawaan": "None",
    "kontak_keluarga": "08123456789"
  }'
```

Response akan include `qr_code_url` dengan format:
```json
{
  "qr_code_url": "https://darbuzbbbwpfqskaqebt.supabase.co/storage/v1/object/public/qr-codes/xxx.png"
}
```

Buka URL tersebut di browser → QR code akan muncul! ✅

## 🚀 Deploy to Render (10 menit)

Baca panduan lengkap: `RENDER_DEPLOYMENT.md`

**Quick version**:

### 1. Push to GitHub

```bash
git add .
git commit -m "Refactor to Supabase Storage"
git push origin main
```

### 2. Create Web Service

1. Login ke https://dashboard.render.com
2. New + → Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `be`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`

### 3. Add Environment Variables

Copy semua dari `.env` ke Render Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=posyandu-lansia-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_STORAGE_BUCKET=qr-codes
```

### 4. Deploy

Klik **Create Web Service** → Wait 5-10 minutes → Done! 🎉

### 5. Test Deployment

```bash
curl https://your-app.onrender.com/health
```

## 📚 Documentation Index

| File | Description |
|------|-------------|
| `GET_SUPABASE_KEYS.md` | Cara mendapatkan Supabase credentials |
| `SUPABASE_STORAGE_SETUP.md` | Setup Supabase Storage bucket (detail) |
| `RENDER_DEPLOYMENT.md` | Deploy ke Render (detail) |
| `QUICK_START.md` | This file (quick reference) |

## 🐛 Common Issues

### "Missing Supabase environment variables"

**Fix**: Update `.env` dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

### "Failed to create bucket"

**Fix**: Bucket mungkin sudah ada. Check di Supabase Dashboard → Storage

### "QR Code upload failed"

**Fix**: 
1. Verify Supabase keys benar
2. Run `npm run supabase:setup` ulang
3. Check bucket `qr-codes` exists dan public

### Build failed di Render

**Fix**:
1. Check `package.json` syntax
2. Verify all dependencies installed
3. Check build logs untuk specific error

## 💡 Tips

- **Local Development**: Gunakan `.env` file
- **Production**: Set environment variables di Render Dashboard
- **Testing**: Test locally dulu sebelum deploy
- **Monitoring**: Check Render logs untuk errors
- **Cold Start**: Free tier sleep after 15 min (upgrade to $7/month untuk 24/7)

## 🎉 Success Checklist

- [ ] Supabase keys di-copy
- [ ] `.env` file updated
- [ ] `npm install` success
- [ ] `npm run supabase:setup` success
- [ ] `npm run dev` success
- [ ] Create lansia test success (QR code URL works)
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set di Render
- [ ] Deployment success (status: Live)
- [ ] Health check endpoint works
- [ ] API endpoints tested

## 📞 Need Help?

1. Check documentation files di folder `be/`
2. Check Render logs untuk errors
3. Verify Supabase Dashboard untuk storage status
4. Test locally dengan production environment

## 🚀 Next Steps

Setelah backend live:

1. Deploy frontend (Vercel/Netlify)
2. Update `CORS_ORIGIN` di Render dengan frontend URL
3. Test end-to-end flow
4. Setup monitoring/alerting
5. Configure custom domain (optional)

---

**Ready to deploy?** Follow the steps above and you'll be live in 15 minutes! 🎯
