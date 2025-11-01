# 📚 Documentation Index

Panduan lengkap untuk setup, development, dan deployment backend Posyandu Lansia.

## 🚀 Quick Start

**Baru mulai?** Mulai dari sini:

1. **[QUICK_START.md](QUICK_START.md)** - Setup dan deploy dalam 15 menit
2. **[GET_SUPABASE_KEYS.md](GET_SUPABASE_KEYS.md)** - Cara mendapatkan Supabase credentials
3. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Checklist lengkap deployment

## 📖 Main Documentation

### Setup & Configuration

| File | Description | When to Read |
|------|-------------|--------------|
| **[README.md](README.md)** | Overview, tech stack, dan basic setup | First time setup |
| **[GET_SUPABASE_KEYS.md](GET_SUPABASE_KEYS.md)** | Cara mendapatkan Supabase URL & Anon Key | Before local setup |
| **[SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md)** | Setup Supabase Storage bucket untuk QR codes | Before first run |

### Deployment

| File | Description | When to Read |
|------|-------------|--------------|
| **[VERCEL_QUICK_START.md](VERCEL_QUICK_START.md)** | ⭐ Vercel deployment (5 min, FREE!) | **RECOMMENDED** |
| **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** | Detailed Vercel deployment guide | Deploying to Vercel |
| **[VERCEL_REFACTOR_SUMMARY.md](VERCEL_REFACTOR_SUMMARY.md)** | Vercel refactor technical details | Understanding changes |
| **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** | Render deployment guide (needs card) | Alternative platform |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Complete deployment checklist | Before & during deployment |

### Technical Documentation

| File | Description | When to Read |
|------|-------------|--------------|
| **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** | Local storage → Supabase Storage migration | Understanding changes |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | API endpoints documentation | Integrating with frontend |

## 🎯 Common Tasks

### First Time Setup

```bash
# 1. Read documentation
cat QUICK_START.md

# 2. Get Supabase keys
# Follow: GET_SUPABASE_KEYS.md

# 3. Update .env
# Add SUPABASE_URL and SUPABASE_ANON_KEY

# 4. Install dependencies
npm install

# 5. Setup Supabase Storage
npm run supabase:setup

# 6. Start development
npm run dev
```

### Deploy to Render

```bash
# 1. Read deployment guide
cat RENDER_DEPLOYMENT.md

# 2. Follow checklist
cat DEPLOYMENT_CHECKLIST.md

# 3. Push to GitHub
git push origin main

# 4. Create Web Service on Render
# Follow: RENDER_DEPLOYMENT.md

# 5. Set environment variables
# Copy from .env to Render Dashboard

# 6. Deploy!
```

### Generate JWT Secret

```bash
npm run generate:jwt
```

### Test QR Code Upload

```bash
# 1. Start server
npm run dev

# 2. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@posyandu.com","password":"Admin123"}'

# 3. Create lansia (with token)
curl -X POST http://localhost:5000/api/lansia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nama":"Test",
    "nik":"1234567890123456",
    "tanggal_lahir":"1950-01-01",
    "alamat":"Test",
    "penyakit_bawaan":"None",
    "kontak_keluarga":"08123456789"
  }'

# 4. Check qr_code_url in response
# 5. Open URL in browser
```

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution | Documentation |
|-------|----------|---------------|
| Missing Supabase keys | Get from Supabase Dashboard | [GET_SUPABASE_KEYS.md](GET_SUPABASE_KEYS.md) |
| Bucket creation failed | Check credentials, run setup script | [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) |
| QR upload failed | Verify bucket exists and is public | [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) |
| Build failed on Render | Check build logs, verify package.json | [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) |
| Database connection error | Verify DATABASE_URL correct | [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) |
| CORS error | Update CORS_ORIGIN with frontend URL | [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) |

## 📊 Documentation Structure

```
be/
├── README.md                      # Main documentation
├── DOCS_INDEX.md                  # This file (documentation index)
├── QUICK_START.md                 # Quick setup & deployment (15 min)
├── GET_SUPABASE_KEYS.md          # Get Supabase credentials
├── SUPABASE_STORAGE_SETUP.md     # Setup Supabase Storage
├── RENDER_DEPLOYMENT.md          # Deploy to Render (detailed)
├── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
├── MIGRATION_SUMMARY.md          # Migration summary (local → Supabase)
├── API_DOCUMENTATION.md          # API endpoints (if exists)
└── scripts/
    ├── setup-supabase-storage.ts # Setup storage bucket
    └── generate-jwt-secret.js    # Generate JWT secret
```

## 🎓 Learning Path

### For Developers

1. **Understand the Stack**
   - Read [README.md](README.md) - Tech stack overview
   - Read [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Architecture changes

2. **Setup Development Environment**
   - Follow [QUICK_START.md](QUICK_START.md) - Quick setup
   - Read [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) - Storage setup

3. **Deploy to Production**
   - Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step by step
   - Read [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Detailed guide

### For DevOps

1. **Deployment**
   - [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Render setup
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist

2. **Monitoring**
   - [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Monitoring section
   - Render Dashboard - Logs & Metrics

3. **Troubleshooting**
   - [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Troubleshooting section
   - [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) - Storage issues

## 🔗 External Resources

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Dashboard](https://app.supabase.com)

### Render

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Render Dashboard](https://dashboard.render.com)

### Express.js

- [Express.js Documentation](https://expressjs.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### Prisma

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)

## 📝 Contributing

Jika ingin menambahkan dokumentasi:

1. Buat file baru di folder `be/`
2. Update `DOCS_INDEX.md` (this file)
3. Link dari file lain jika relevan
4. Commit dengan message yang jelas

## 🎉 Quick Reference

### Environment Variables

```env
# Server
NODE_ENV=development|production
PORT=5000

# Database (Supabase)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Supabase Storage
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_STORAGE_BUCKET=qr-codes
```

### NPM Scripts

```bash
npm run dev              # Development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run supabase:setup   # Setup Supabase Storage
npm run generate:jwt     # Generate JWT secret
```

### Useful Commands

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@posyandu.com","password":"Admin123"}'

# Get lansia
curl http://localhost:5000/api/lansia \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated**: October 31, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete
