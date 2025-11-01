# Vercel Deployment Guide

Panduan lengkap untuk deploy Backend Express.js ke Vercel sebagai Serverless Functions.

## 📋 Prerequisites

- [x] Akun GitHub (untuk connect repository)
- [x] Akun Vercel (gratis) - [Sign up di sini](https://vercel.com/signup)
- [x] Supabase Database sudah setup
- [x] Supabase Storage sudah setup
- [x] Code sudah di-push ke GitHub

## 🎯 What Changed for Vercel?

### Refactor Summary:

1. ✅ **Added `api/index.ts`** - Serverless function entry point
2. ✅ **Added `vercel.json`** - Vercel configuration
3. ✅ **Updated Prisma schema** - Added `binaryTargets` for Vercel
4. ✅ **Updated package.json** - Added `vercel-build` script
5. ✅ **Added `.vercelignore`** - Exclude unnecessary files

### Architecture:

**Before (Traditional Server):**
```
Express app → app.listen(PORT) → Always running
```

**After (Serverless):**
```
Request → Vercel → api/index.ts → Express app → Response
```

## 🚀 Deployment Steps

### 1. Push Code ke GitHub

Pastikan semua changes sudah di-commit dan push:

```bash
git add .
git commit -m "Refactor for Vercel serverless deployment"
git push origin main
```

### 2. Login ke Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** atau **"Login"**
3. Login dengan **GitHub account**
4. Authorize Vercel to access GitHub

### 3. Import Project

1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find `be_pencatatan-posyandu` repository
4. Click **"Import"**

### 4. Configure Project

#### Framework Preset
- Select: **Other** (bukan Next.js)

#### Root Directory
- **IMPORTANT**: Set to **`.`** (current directory)
- Atau leave blank jika code di root repo

#### Build Settings
Vercel akan auto-detect, tapi verify:
- **Build Command**: `npm run vercel-build` (auto-detected)
- **Output Directory**: Leave blank (serverless, no static output)
- **Install Command**: `npm install` (auto-detected)

### 5. Environment Variables

Click **"Environment Variables"** dan add semua variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=posyandu-lansia-super-secret-jwt-key-2025
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmJ1emJiYndwZnFza2FxZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTM4NDksImV4cCI6MjA3NzQ2OTg0OX0.4fgFsvRuCxFf6gzUkMOFDkux8wXDYKGhsADXm0L5PN4
SUPABASE_STORAGE_BUCKET=qr-codes
```

**IMPORTANT**: 
- Ganti `JWT_SECRET` dengan string random yang kuat
- `CORS_ORIGIN` akan di-update setelah deployment (dengan Vercel URL)

### 6. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (3-5 minutes)
3. Vercel akan:
   - Clone repository
   - Install dependencies
   - Run `npm run vercel-build` (generate Prisma Client)
   - Build serverless functions
   - Deploy to global CDN

### 7. Get Deployment URL

Setelah deployment success:
- Copy URL: `https://your-project.vercel.app`
- Test health check: `https://your-project.vercel.app/health`

## ✅ Verify Deployment

### Test Health Check

```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-31T...",
  "uptime": 123,
  "environment": "production"
}
```

### Test API Endpoints

1. **Login**:
```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@posyandu.com","password":"Admin123"}'
```

2. **Get Lansia** (with token):
```bash
curl https://your-project.vercel.app/api/lansia \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Create Lansia** (test QR upload):
```bash
curl -X POST https://your-project.vercel.app/api/lansia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nama":"Test Vercel",
    "nik":"8888888888888888",
    "tanggal_lahir":"1950-01-01",
    "alamat":"Test",
    "penyakit_bawaan":"None",
    "kontak_keluarga":"08123456789"
  }'
```

Check `qr_code_url` in response - should be Supabase URL.

## 🔧 Post-Deployment Configuration

### 1. Update CORS Origin

Setelah deployment, update `CORS_ORIGIN`:

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Edit `CORS_ORIGIN`
4. Change to: `https://your-project.vercel.app`
5. Click **Save**
6. Redeploy (Vercel will auto-redeploy)

### 2. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (auto-provisioned)
5. Update `CORS_ORIGIN` with custom domain

### 3. Enable Auto-Deploy

Vercel auto-deploys on every push to `main` branch:
- Push to `main` → Auto-deploy to production
- Push to other branches → Preview deployments

## 📊 Monitoring & Logs

### View Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on a deployment
4. Click **Functions** tab
5. Click on `api/index` function
6. View real-time logs

### Metrics

Free tier includes:
- Request count
- Response time
- Error rate
- Bandwidth usage

## ⚠️ Important Notes

### Serverless Limitations

1. **Execution Time**: Max 10 seconds per request (free tier)
2. **Cold Starts**: First request after idle may be slow (~1-2 seconds)
3. **No Persistent State**: Each request is isolated
4. **No Background Jobs**: Use external services (cron-job.org)

### Database Connections

- ✅ Using Supabase Pooler (connection pooling handled)
- ✅ Prisma singleton pattern (reuse connections)
- ✅ No "too many connections" issues

### File Storage

- ✅ Using Supabase Storage (no local filesystem)
- ✅ QR codes uploaded to cloud
- ✅ No persistent disk needed

## 🐛 Troubleshooting

### Build Failed

**Error**: `Prisma Client not generated`

**Solution**:
1. Check `vercel-build` script in package.json
2. Verify `prisma generate` runs during build
3. Check build logs for errors

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Verify `DATABASE_URL` in environment variables
2. Check Supabase database status
3. Ensure using Supabase Pooler URL (not direct connection)

### CORS Error

**Error**: `Access-Control-Allow-Origin`

**Solution**:
1. Update `CORS_ORIGIN` with Vercel URL
2. Ensure no trailing slash
3. For multiple origins: `https://app1.com,https://app2.com`

### Function Timeout

**Error**: `Function execution timed out`

**Solution**:
1. Optimize slow queries
2. Add database indexes
3. Consider upgrading to Pro plan (60s timeout)

### Cold Start Slow

**Issue**: First request after idle is slow

**Solution**:
1. This is normal for serverless (cold start)
2. Subsequent requests will be fast (warm)
3. Use external ping service to keep warm (optional)
4. Or upgrade to Pro plan (better cold start performance)

## 💰 Cost Estimation

### Free Tier (Hobby)

- **Bandwidth**: 100GB/month
- **Serverless Function Execution**: 100GB-hours
- **Builds**: 6000 minutes/month
- **Cost**: $0/month

### Pro Tier (If Needed)

- **Bandwidth**: 1TB/month
- **Serverless Function Execution**: 1000GB-hours
- **Function Timeout**: 60 seconds (vs 10s free)
- **Cost**: $20/month

### Total Stack Cost

**Free Tier**:
- Vercel: $0/month
- Supabase: $0/month (1GB storage, 2GB bandwidth)
- **Total**: $0/month ✅

## 🎉 Done!

Backend sudah live di Vercel!

**Next Steps**:
1. ✅ Test all API endpoints
2. ✅ Deploy frontend (Vercel juga)
3. ✅ Update CORS_ORIGIN dengan frontend URL
4. ✅ Setup custom domain (optional)
5. ✅ Monitor logs & metrics

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Supabase Documentation](https://supabase.com/docs)

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Production URL**: _____________  
**Status**: ⬜ In Progress | ⬜ Complete
