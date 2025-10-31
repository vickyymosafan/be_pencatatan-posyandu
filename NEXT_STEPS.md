# 🎯 Next Steps - Apa yang Harus Dilakukan Sekarang?

Refactor QR code storage ke Supabase sudah selesai! Berikut langkah-langkah yang harus kamu lakukan sekarang.

## ✅ Yang Sudah Selesai

- ✅ Install `@supabase/supabase-js`
- ✅ Refactor `qrcode.util.ts` untuk upload ke Supabase Storage
- ✅ Update `lansia.controller.ts` untuk return public URLs
- ✅ Update `lansia.service.ts` untuk handle Supabase URLs
- ✅ Create Supabase config file
- ✅ Create setup script untuk storage bucket
- ✅ Update environment variables
- ✅ Create comprehensive documentation
- ✅ Build test passed (no TypeScript errors)

## 🚀 Langkah Selanjutnya (Urut)

### Step 1: Dapatkan Supabase Credentials (5 menit)

**Apa yang harus dilakukan:**
1. Buka https://app.supabase.com
2. Login dan pilih project kamu
3. Klik Settings (⚙️) → API
4. Copy **Project URL** dan **anon public** key

**Panduan lengkap**: Baca `GET_SUPABASE_KEYS.md`

**Output yang diharapkan:**
- `SUPABASE_URL`: `https://darbuzbbbwpfqskaqebt.supabase.co`
- `SUPABASE_ANON_KEY`: `eyJhbGci...` (JWT token panjang)

---

### Step 2: Update File .env (2 menit)

**Apa yang harus dilakukan:**
1. Buka file `be/.env`
2. Ganti `SUPABASE_ANON_KEY` dengan key yang kamu copy
3. Verify `SUPABASE_URL` sudah benar
4. Save file

**File location**: `be/.env`

**Yang harus di-update:**
```env
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=paste-your-actual-anon-key-here  # ← GANTI INI
SUPABASE_STORAGE_BUCKET=qr-codes
```

**Verification:**
- [ ] `SUPABASE_URL` starts with `https://`
- [ ] `SUPABASE_ANON_KEY` is a long JWT token (starts with `eyJ`)
- [ ] No extra spaces or newlines

---

### Step 3: Setup Supabase Storage Bucket (2 menit)

**Apa yang harus dilakukan:**
1. Buka terminal
2. Navigate ke folder `be`
3. Run setup script

**Commands:**
```bash
cd be
npm run supabase:setup
```

**Output yang diharapkan:**
```
🚀 Setting up Supabase Storage...

✅ Bucket 'qr-codes' created successfully

✨ Supabase Storage setup completed!

📦 Bucket: qr-codes
🌐 Public: Yes
📏 File size limit: 1MB
📄 Allowed types: image/png

🎉 You can now upload QR codes to Supabase Storage!
```

**Jika bucket sudah ada:**
```
✅ Bucket 'qr-codes' already exists
```
→ Ini OK, skip ke step berikutnya.

**Jika error:**
- Check `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `.env`
- Verify credentials benar
- Baca troubleshooting di `SUPABASE_STORAGE_SETUP.md`

---

### Step 4: Test Locally (5 menit)

**Apa yang harus dilakukan:**
1. Start development server
2. Test create lansia
3. Verify QR code uploaded ke Supabase

**Commands:**
```bash
npm run dev
```

**Test create lansia:**

1. **Login dulu** (untuk dapat JWT token):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@posyandu.com\",\"password\":\"Admin123\"}"
```

Copy JWT token dari response.

2. **Create lansia** (ganti `YOUR_TOKEN` dengan token dari step 1):
```bash
curl -X POST http://localhost:5000/api/lansia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"nama\":\"Test Lansia\",\"nik\":\"1234567890123456\",\"tanggal_lahir\":\"1950-01-01\",\"alamat\":\"Test Address\",\"penyakit_bawaan\":\"None\",\"kontak_keluarga\":\"08123456789\"}"
```

**Output yang diharapkan:**
```json
{
  "success": true,
  "message": "Data lansia berhasil dibuat",
  "data": {
    "id": "xxx-xxx-xxx",
    "nama": "Test Lansia",
    "nik": "1234567890123456",
    "qr_code_url": "https://darbuzbbbwpfqskaqebt.supabase.co/storage/v1/object/public/qr-codes/xxx.png",
    ...
  }
}
```

3. **Verify QR code**:
- Copy `qr_code_url` dari response
- Buka URL di browser
- QR code image harus muncul ✅

**Verification checklist:**
- [ ] Server started without errors
- [ ] Login successful (got JWT token)
- [ ] Create lansia successful
- [ ] Response includes `qr_code_url`
- [ ] QR code URL accessible di browser
- [ ] Image loads correctly

**Jika ada error:**
- Check console logs untuk error messages
- Verify Supabase credentials di `.env`
- Check bucket `qr-codes` exists di Supabase Dashboard
- Baca troubleshooting di `SUPABASE_STORAGE_SETUP.md`

---

### Step 5: Commit & Push ke GitHub (3 menit)

**Apa yang harus dilakukan:**
1. Commit semua changes
2. Push ke GitHub

**Commands:**
```bash
git add .
git commit -m "Refactor QR storage to Supabase & prepare for Render deployment"
git push origin main
```

**Verification:**
- [ ] All files committed
- [ ] Push successful
- [ ] Check GitHub repository (files updated)

---

### Step 6: Deploy ke Render (10 menit)

**Apa yang harus dilakukan:**
1. Create Render account (jika belum)
2. Create Web Service
3. Configure environment variables
4. Deploy!

**Panduan lengkap**: Baca `RENDER_DEPLOYMENT.md` atau `DEPLOYMENT_CHECKLIST.md`

**Quick steps:**

1. **Login ke Render**: https://dashboard.render.com
2. **New + → Web Service**
3. **Connect GitHub repository**: `posyandu-lansia`
4. **Configure**:
   - Root Directory: `be`
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`
5. **Add Environment Variables** (copy dari `.env`)
6. **Create Web Service**
7. **Wait for deployment** (5-10 minutes)

**Verification:**
- [ ] Service status: Live ✅
- [ ] Health check works: `https://your-app.onrender.com/health`
- [ ] API endpoints accessible
- [ ] QR codes uploading to Supabase

---

### Step 7: Test Production (5 menit)

**Apa yang harus dilakukan:**
1. Test health endpoint
2. Test login
3. Test create lansia
4. Verify QR code upload

**Commands:**
```bash
# Health check
curl https://your-app.onrender.com/health

# Login
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@posyandu.com","password":"Admin123"}'

# Create lansia (with token)
curl -X POST https://your-app.onrender.com/api/lansia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"nama":"Test","nik":"1234567890123456","tanggal_lahir":"1950-01-01","alamat":"Test","penyakit_bawaan":"None","kontak_keluarga":"08123456789"}'
```

**Verification:**
- [ ] Health check returns 200 OK
- [ ] Login successful
- [ ] Create lansia successful
- [ ] QR code URL accessible
- [ ] No errors in Render logs

---

## 📚 Documentation Reference

Jika stuck atau butuh detail lebih:

| Task | Documentation |
|------|---------------|
| Get Supabase keys | [GET_SUPABASE_KEYS.md](GET_SUPABASE_KEYS.md) |
| Setup storage | [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) |
| Deploy to Render | [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) |
| Deployment checklist | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| Quick reference | [QUICK_START.md](QUICK_START.md) |
| All docs | [DOCS_INDEX.md](DOCS_INDEX.md) |

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
→ Update `.env` dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

### "Failed to create bucket"
→ Bucket mungkin sudah ada, check di Supabase Dashboard → Storage

### "Failed to upload QR Code"
→ Verify credentials benar, run `npm run supabase:setup` ulang

### Build failed di Render
→ Check build logs, verify `package.json` syntax

### QR code URL 403 Forbidden
→ Verify bucket is public di Supabase Dashboard

## 💡 Tips

- **Test locally first** sebelum deploy
- **Check logs** jika ada error
- **Use checklist** untuk track progress
- **Read documentation** jika stuck
- **Free tier** cukup untuk testing
- **Upgrade to $7/month** untuk production 24/7

## 🎉 Success Criteria

Kamu berhasil jika:

- ✅ Local development works (QR codes upload ke Supabase)
- ✅ Code pushed to GitHub
- ✅ Deployed to Render (status: Live)
- ✅ Production API works
- ✅ QR codes accessible via public URLs
- ✅ No errors in logs

## 📞 Need Help?

1. Check documentation di folder `be/`
2. Check Render logs untuk errors
3. Verify Supabase Dashboard untuk storage status
4. Read troubleshooting sections

## 🚀 After Deployment

Setelah backend live:

1. Deploy frontend (Vercel/Netlify)
2. Update `CORS_ORIGIN` di Render dengan frontend URL
3. Test end-to-end flow
4. Setup monitoring (UptimeRobot)
5. Configure custom domain (optional)

---

**Current Status**: ⬜ Step 1 | ⬜ Step 2 | ⬜ Step 3 | ⬜ Step 4 | ⬜ Step 5 | ⬜ Step 6 | ⬜ Step 7

**Start Time**: _____________  
**Estimated Completion**: 30-40 minutes  

**Let's go! 🚀**
