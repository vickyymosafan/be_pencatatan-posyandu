# 🚀 Vercel Quick Start - 5 Minutes to Production!

## ✅ What's Ready?

Codebase sudah di-refactor untuk Vercel Serverless:
- ✅ `api/index.ts` - Serverless entry point
- ✅ `vercel.json` - Configuration
- ✅ Prisma binary targets updated
- ✅ Build scripts configured
- ✅ `.vercelignore` created

## 🎯 Deploy in 5 Steps:

### Step 1: Push to GitHub (30 seconds)

```bash
git add .
git commit -m "Refactor for Vercel serverless"
git push origin main
```

### Step 2: Login to Vercel (1 minute)

1. Go to https://vercel.com
2. Click **"Sign Up"** with GitHub
3. Authorize Vercel

### Step 3: Import Project (1 minute)

1. Click **"Add New..."** → **"Project"**
2. Select `be_pencatatan-posyandu` repository
3. Click **"Import"**

### Step 4: Configure (2 minutes)

**Framework**: Select **"Other"**

**Environment Variables**: Add these (copy-paste):

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.darbuzbbbwpfqskaqebt:posyandu@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=posyandu-lansia-super-secret-jwt-key-2025
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmJ1emJiYndwZnFza2FxZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTM4NDksImV4cCI6MjA3NzQ2OTg0OX0.4fgFsvRuCxFf6gzUkMOFDkux8wXDYKGhsADXm0L5PN4
SUPABASE_STORAGE_BUCKET=qr-codes
```

### Step 5: Deploy! (1 minute)

Click **"Deploy"** → Wait 3-5 minutes → Done! 🎉

## ✅ Verify Deployment

Test health check:
```bash
curl https://your-project.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## 🔧 After Deployment

Update CORS:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `CORS_ORIGIN` → Change to `https://your-project.vercel.app`
3. Save → Auto-redeploy

## 💡 Tips

- ✅ **Free forever** - No card required
- ✅ **Auto-deploy** - Push to main = auto-deploy
- ✅ **Global CDN** - Fast worldwide
- ✅ **HTTPS** - Auto SSL certificate
- ✅ **Custom domain** - Free (optional)

## 📚 Need More Details?

Read `VERCEL_DEPLOYMENT.md` for complete guide.

---

**Ready?** Let's deploy! 🚀
