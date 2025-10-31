# 🚀 Deployment Checklist

Checklist lengkap untuk deploy backend ke Render dengan Supabase Storage.

## 📋 Pre-Deployment

### 1. Supabase Setup

- [ ] Login ke [Supabase Dashboard](https://app.supabase.com)
- [ ] Pilih project yang benar
- [ ] Database sudah migrate (✅ sudah dilakukan)
- [ ] Copy **Project URL** dari Settings → API
- [ ] Copy **anon public** key dari Settings → API
- [ ] Simpan credentials dengan aman

**Panduan**: `GET_SUPABASE_KEYS.md`

### 2. Local Configuration

- [ ] Update `be/.env` dengan Supabase credentials:
  ```env
  SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
  SUPABASE_ANON_KEY=your-actual-anon-key-here
  SUPABASE_STORAGE_BUCKET=qr-codes
  ```
- [ ] Run `npm install` (install @supabase/supabase-js)
- [ ] Run `npm run supabase:setup` (create storage bucket)
- [ ] Verify bucket created di Supabase Dashboard → Storage

**Panduan**: `SUPABASE_STORAGE_SETUP.md`

### 3. Local Testing

- [ ] Run `npm run dev`
- [ ] Test health endpoint: `http://localhost:5000/health`
- [ ] Test login endpoint (get JWT token)
- [ ] Test create lansia (check qr_code_url in response)
- [ ] Open QR code URL di browser (verify image loads)
- [ ] Test get lansia by ID
- [ ] Test get QR code endpoint
- [ ] No errors in console

**Expected QR URL format**:
```
https://darbuzbbbwpfqskaqebt.supabase.co/storage/v1/object/public/qr-codes/xxx.png
```

### 4. Code Repository

- [ ] Code committed to Git
- [ ] Push to GitHub:
  ```bash
  git add .
  git commit -m "Refactor QR storage to Supabase & prepare for Render"
  git push origin main
  ```
- [ ] Verify push successful di GitHub

## 🚀 Render Deployment

### 5. Create Render Account

- [ ] Sign up di [Render](https://render.com) (gratis)
- [ ] Verify email
- [ ] Connect GitHub account

### 6. Create Web Service

- [ ] Login ke [Render Dashboard](https://dashboard.render.com)
- [ ] Click **New +** → **Web Service**
- [ ] Connect GitHub repository
- [ ] Select `posyandu-lansia` repository
- [ ] Click **Connect**

### 7. Configure Service

**Basic Settings**:
- [ ] **Name**: `posyandu-lansia-backend` (atau nama lain)
- [ ] **Region**: `Singapore (Southeast Asia)`
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `be`
- [ ] **Runtime**: `Node`
- [ ] **Build Command**: `npm install && npm run prisma:generate && npm run build`
- [ ] **Start Command**: `npm start`

**Instance Type**:
- [ ] Select **Free** (untuk testing)
- [ ] Atau **Starter** ($7/month untuk production 24/7)

### 8. Environment Variables

Click **Advanced** → **Add Environment Variable**, tambahkan:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=posyandu-lansia-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_STORAGE_BUCKET=qr-codes
```

**Checklist**:
- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = Supabase connection string (with pooler)
- [ ] `JWT_SECRET` = Strong random string (CHANGE THIS!)
- [ ] `JWT_EXPIRES_IN` = `24h`
- [ ] `CORS_ORIGIN` = Frontend URL (update later)
- [ ] `SUPABASE_URL` = Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` = Your actual anon key
- [ ] `SUPABASE_STORAGE_BUCKET` = `qr-codes`

**PENTING**: Ganti `JWT_SECRET` dengan string random yang kuat!

### 9. Deploy

- [ ] Click **Create Web Service**
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check logs untuk errors
- [ ] Wait for status: **Live** ✅
- [ ] Copy service URL: `https://posyandu-lansia-backend.onrender.com`

**Panduan**: `RENDER_DEPLOYMENT.md`

## ✅ Post-Deployment Verification

### 10. Test Production Endpoints

- [ ] Health check:
  ```bash
  curl https://your-app.onrender.com/health
  ```
  Expected: `{"status":"ok","database":"connected",...}`

- [ ] Login endpoint:
  ```bash
  curl -X POST https://your-app.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@posyandu.com","password":"Admin123"}'
  ```
  Expected: JWT token in response

- [ ] Get lansia (with token):
  ```bash
  curl https://your-app.onrender.com/api/lansia \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```
  Expected: List of lansia

- [ ] Create lansia (with token):
  ```bash
  curl -X POST https://your-app.onrender.com/api/lansia \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{
      "nama":"Test Lansia",
      "nik":"1234567890123456",
      "tanggal_lahir":"1950-01-01",
      "alamat":"Test Address",
      "penyakit_bawaan":"None",
      "kontak_keluarga":"08123456789"
    }'
  ```
  Expected: Created lansia with `qr_code_url`

- [ ] Open QR code URL di browser
  Expected: QR code image loads

### 11. Verify Supabase Storage

- [ ] Login ke Supabase Dashboard
- [ ] Go to Storage → qr-codes bucket
- [ ] Verify QR code files uploaded
- [ ] Click file → Copy public URL
- [ ] Open URL di browser → Image loads

### 12. Monitor Logs

- [ ] Open Render Dashboard → Service → Logs
- [ ] Check for errors
- [ ] Verify no connection issues
- [ ] Verify QR uploads successful

## 🔧 Post-Deployment Configuration

### 13. Update CORS (After Frontend Deploy)

Setelah deploy frontend:

- [ ] Get frontend URL (e.g., `https://posyandu-lansia.vercel.app`)
- [ ] Update `CORS_ORIGIN` di Render:
  1. Render Dashboard → Service → Environment
  2. Edit `CORS_ORIGIN` variable
  3. Change to frontend URL
  4. Click **Save Changes**
  5. Service will auto-redeploy

### 14. Security Hardening

- [ ] Verify `JWT_SECRET` is strong and unique
- [ ] Verify `NODE_ENV=production`
- [ ] Check CORS only allows your frontend
- [ ] Verify Supabase credentials correct
- [ ] Enable rate limiting (already configured)
- [ ] Review Render logs for suspicious activity

### 15. Performance Optimization

**Free Tier**:
- [ ] Setup ping service (prevent sleep):
  - Use [UptimeRobot](https://uptimerobot.com) (free)
  - Ping `/health` every 10 minutes
  - Prevents 15-minute sleep

**Paid Tier** ($7/month):
- [ ] Upgrade to Starter plan
- [ ] No sleep, 24/7 uptime
- [ ] Better performance

### 16. Monitoring Setup

- [ ] Setup UptimeRobot untuk health checks
- [ ] Configure email alerts untuk downtime
- [ ] Monitor Render metrics (CPU, Memory)
- [ ] Check Supabase storage usage
- [ ] Setup error tracking (optional: Sentry)

## 📚 Documentation

### 17. Update Documentation

- [ ] Document production URL
- [ ] Update API documentation dengan production endpoints
- [ ] Share credentials dengan team (securely)
- [ ] Document deployment process
- [ ] Create runbook untuk common issues

### 18. Backup & Recovery

- [ ] Verify Supabase auto-backups enabled
- [ ] Document recovery procedures
- [ ] Test restore process (optional)
- [ ] Document rollback procedures

## 🎉 Final Checklist

- [ ] ✅ Backend deployed dan live
- [ ] ✅ Health check passing
- [ ] ✅ Database connected
- [ ] ✅ QR codes uploading to Supabase
- [ ] ✅ All API endpoints working
- [ ] ✅ CORS configured correctly
- [ ] ✅ Logs clean (no errors)
- [ ] ✅ Monitoring setup
- [ ] ✅ Documentation updated
- [ ] ✅ Team notified

## 🐛 Troubleshooting

Jika ada masalah, check:

1. **Build Failed**: Check build logs di Render
2. **Database Error**: Verify `DATABASE_URL` correct
3. **QR Upload Failed**: Verify Supabase credentials
4. **CORS Error**: Update `CORS_ORIGIN` dengan frontend URL
5. **500 Errors**: Check Render logs untuk stack trace

**Panduan lengkap**: `RENDER_DEPLOYMENT.md` section Troubleshooting

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Docs**: Check `be/` folder untuk guides
- **Render Support**: support@render.com
- **Supabase Support**: support@supabase.com

## 🚀 Next Steps

Setelah backend live:

1. Deploy frontend (Vercel/Netlify)
2. Update `CORS_ORIGIN` dengan frontend URL
3. Test end-to-end flow
4. Setup custom domain (optional)
5. Configure SSL (auto di Render)
6. Setup CI/CD (auto di Render)
7. Monitor performance
8. Collect user feedback

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Production URL**: _____________  
**Status**: ⬜ In Progress | ⬜ Complete

**Good luck! 🎉**
