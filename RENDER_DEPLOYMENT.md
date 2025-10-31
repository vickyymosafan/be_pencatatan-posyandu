# Render Deployment Guide

Panduan lengkap untuk deploy Backend Express.js ke Render.

## 📋 Prerequisites

- [x] Akun GitHub (untuk connect repository)
- [x] Akun Render (gratis) - [Sign up di sini](https://render.com)
- [x] Supabase Database sudah setup
- [x] Supabase Storage sudah setup (lihat `SUPABASE_STORAGE_SETUP.md`)

## 🚀 Deployment Steps

### 1. Push Code ke GitHub

Pastikan code sudah di-push ke GitHub repository:

```bash
git add .
git commit -m "Refactor QR storage to Supabase & prepare for Render deployment"
git push origin main
```

### 2. Create Web Service di Render

1. Login ke [Render Dashboard](https://dashboard.render.com)
2. Klik **New +** → **Web Service**
3. Connect GitHub repository:
   - Klik **Connect account** jika belum connect
   - Pilih repository `posyandu-lansia`
   - Klik **Connect**

### 3. Configure Web Service

Isi form dengan konfigurasi berikut:

#### Basic Settings

| Field | Value |
|-------|-------|
| **Name** | `posyandu-lansia-backend` (atau nama lain) |
| **Region** | `Singapore (Southeast Asia)` (terdekat dengan Supabase) |
| **Branch** | `main` |
| **Root Directory** | `be` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run prisma:generate && npm run build` |
| **Start Command** | `npm start` |

#### Instance Type

- **Free** (untuk testing/development)
- **Starter** ($7/month - untuk production dengan persistent disk)

### 4. Environment Variables

Klik **Advanced** → **Add Environment Variable**, tambahkan semua variables berikut:

```env
NODE_ENV=production

# Database - Supabase Connection String
DATABASE_URL=postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# JWT Configuration
JWT_SECRET=posyandu-lansia-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h

# CORS - Frontend URL (update setelah deploy frontend)
CORS_ORIGIN=https://your-frontend-url.vercel.app

# Supabase Configuration
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_STORAGE_BUCKET=qr-codes
```

**PENTING**:
- Ganti `JWT_SECRET` dengan string random yang kuat (gunakan generator)
- Ganti `SUPABASE_ANON_KEY` dengan key dari Supabase Dashboard
- Update `CORS_ORIGIN` setelah deploy frontend

### 5. Deploy

1. Klik **Create Web Service**
2. Render akan mulai build dan deploy
3. Tunggu hingga status menjadi **Live** (5-10 menit)
4. Copy URL service: `https://posyandu-lansia-backend.onrender.com`

## ✅ Verify Deployment

### Test Health Check

```bash
curl https://posyandu-lansia-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123
}
```

### Test API Endpoints

1. **Login** (untuk get JWT token):
```bash
curl -X POST https://posyandu-lansia-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@posyandu.com",
    "password": "Admin123"
  }'
```

2. **Get Lansia** (dengan token):
```bash
curl https://posyandu-lansia-backend.onrender.com/api/lansia \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Post-Deployment Configuration

### 1. Run Database Migrations (Jika belum)

Migrations sudah dijalankan di Supabase, tapi jika perlu run ulang:

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Run migration
render run npm run prisma:migrate
```

### 2. Update Frontend CORS

Setelah deploy frontend, update environment variable `CORS_ORIGIN`:

1. Buka Render Dashboard
2. Pilih service `posyandu-lansia-backend`
3. Klik **Environment**
4. Edit `CORS_ORIGIN` dengan frontend URL
5. Klik **Save Changes** (akan auto-redeploy)

### 3. Setup Custom Domain (Optional)

1. Buka service settings
2. Klik **Custom Domain**
3. Add domain: `api.posyandu-lansia.com`
4. Update DNS records sesuai instruksi Render
5. Wait for SSL certificate (auto-provisioned)

## 📊 Monitoring & Logs

### View Logs

1. Buka Render Dashboard
2. Pilih service
3. Klik **Logs** tab
4. Real-time logs akan muncul

### Metrics

Free tier includes:
- CPU usage
- Memory usage
- Request count
- Response time

## 🔄 Auto-Deploy

Render akan auto-deploy setiap kali ada push ke branch `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render akan auto-deploy dalam 2-3 menit
```

Disable auto-deploy:
1. Service Settings → **Auto-Deploy**: OFF

## ⚠️ Important Notes

### Free Tier Limitations

- **Sleep after 15 minutes** of inactivity
- **Cold start**: 30-60 seconds untuk wake up
- **750 hours/month** (cukup untuk 1 service 24/7)
- **No persistent disk** (makanya pakai Supabase Storage)

### Cold Start Solutions

1. **Ping service** setiap 10 menit (cron job):
```bash
# Setup di cron-job.org atau UptimeRobot
curl https://posyandu-lansia-backend.onrender.com/health
```

2. **Upgrade to Starter** ($7/month):
   - No sleep
   - Faster performance
   - Persistent disk (optional)

### Database Connection

- Gunakan **Supabase Pooler** URL (sudah di `.env`)
- Pooler handle connection pooling otomatis
- No need untuk setup PgBouncer manual

## 🐛 Troubleshooting

### Build Failed

**Error**: `npm install failed`

**Solusi**:
1. Check `package.json` syntax
2. Verify Node version compatibility
3. Check build logs untuk specific error

### Database Connection Error

**Error**: `Can't reach database server`

**Solusi**:
1. Verify `DATABASE_URL` di environment variables
2. Check Supabase database status
3. Test connection dari local:
```bash
psql "postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### CORS Error

**Error**: `Access-Control-Allow-Origin`

**Solusi**:
1. Update `CORS_ORIGIN` dengan frontend URL yang benar
2. Pastikan tidak ada trailing slash
3. Untuk multiple origins, gunakan comma-separated:
```env
CORS_ORIGIN=https://app1.com,https://app2.com
```

### QR Code Upload Failed

**Error**: `Failed to upload QR Code to Supabase`

**Solusi**:
1. Verify `SUPABASE_URL` dan `SUPABASE_ANON_KEY`
2. Check bucket `qr-codes` sudah dibuat
3. Verify bucket is public
4. Test dari local terlebih dahulu

### Service Keeps Crashing

**Solusi**:
1. Check logs untuk error message
2. Verify all environment variables set correctly
3. Test locally dengan production environment:
```bash
NODE_ENV=production npm start
```

## 💰 Cost Estimation

### Free Tier (Recommended untuk testing)
- **Cost**: $0/month
- **Limitations**: Sleep after 15 min, 750 hours/month
- **Best for**: Development, testing, low-traffic apps

### Starter Tier (Recommended untuk production)
- **Cost**: $7/month
- **Benefits**: No sleep, better performance, 24/7 uptime
- **Best for**: Production apps, consistent traffic

### Total Stack Cost (Production)
- Render Starter: $7/month
- Supabase Free: $0/month (1GB storage, 2GB bandwidth)
- **Total**: $7/month

## 🎉 Done!

Backend sudah live di Render! 

**Next Steps**:
1. ✅ Test all API endpoints
2. ✅ Deploy frontend (Vercel/Netlify)
3. ✅ Update CORS_ORIGIN dengan frontend URL
4. ✅ Setup monitoring/alerting
5. ✅ Setup backup strategy

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
