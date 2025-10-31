# Cara Mendapatkan Supabase Keys

## 🔑 Step-by-Step Guide

### 1. Login ke Supabase Dashboard

Buka browser dan akses: https://app.supabase.com

### 2. Pilih Project

Klik project **posyandu-lansia** (atau nama project Anda)

### 3. Buka Settings

1. Klik icon **⚙️ Settings** di sidebar kiri bawah
2. Klik **API** di menu Settings

### 4. Copy Credentials

Anda akan melihat section **Project API keys**:

#### Project URL
```
https://darbuzbbbwpfqskaqebt.supabase.co
```
→ Copy ini untuk `SUPABASE_URL`

#### anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmJ1emJiYndwZnFza2FxZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MjAxNDM0MTQzMn0.xxxxxxxxxxxxxxxxxxxxx
```
→ Copy ini untuk `SUPABASE_ANON_KEY`

**PENTING**: 
- Jangan share `service_role` key (yang secret)
- `anon` key aman untuk digunakan di backend
- `anon` key sudah include RLS (Row Level Security) policies

### 5. Update .env File

Buka file `be/.env` dan update:

```env
SUPABASE_URL=https://darbuzbbbwpfqskaqebt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

### 6. Test Connection

Jalankan setup script untuk test connection:

```bash
npm run supabase:setup
```

Jika berhasil, akan muncul:
```
✅ Bucket 'qr-codes' created successfully
✨ Supabase Storage setup completed!
```

## 🎯 Quick Reference

| Variable | Location | Example |
|----------|----------|---------|
| `SUPABASE_URL` | Settings → API → Project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Settings → API → anon public | `eyJhbGci...` (JWT token) |
| `SUPABASE_STORAGE_BUCKET` | Manual | `qr-codes` |

## ✅ Verification Checklist

- [ ] `SUPABASE_URL` starts with `https://`
- [ ] `SUPABASE_ANON_KEY` is a long JWT token (starts with `eyJ`)
- [ ] `SUPABASE_STORAGE_BUCKET` is `qr-codes`
- [ ] Run `npm run supabase:setup` successfully
- [ ] No error messages in console

## 🐛 Troubleshooting

### Error: "Invalid API key"

**Solusi**: 
- Pastikan copy **anon public** key, bukan service_role
- Check tidak ada extra spaces atau newlines
- Copy ulang dari dashboard

### Error: "Project not found"

**Solusi**:
- Verify `SUPABASE_URL` benar
- Check project masih active di dashboard
- Pastikan tidak ada typo

## 🔒 Security Notes

- ✅ `anon` key aman untuk backend
- ✅ `anon` key bisa di-commit ke Git (tapi better di .env)
- ❌ Jangan expose `service_role` key
- ❌ Jangan hardcode keys di code

## 📝 Next Steps

Setelah mendapatkan keys:

1. ✅ Update `.env` file
2. ✅ Run `npm run supabase:setup`
3. ✅ Test create lansia (QR code akan upload ke Supabase)
4. ✅ Ready untuk deploy ke Render!
