# Backend Sistem Rekam Medis Digital Posyandu Lansia

Backend API untuk sistem manajemen rekam medis digital posyandu lansia yang dibangun dengan Express.js, TypeScript, Prisma ORM, dan PostgreSQL.

## 🚀 Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js v5.x
- **Language**: TypeScript v5.x
- **ORM**: Prisma v6.x
- **Database**: PostgreSQL v14+
- **Authentication**: JWT (JSON Web Token)
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator
- **QR Code**: qrcode library

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstall:

- Node.js v18 atau lebih tinggi
- PostgreSQL v14 atau lebih tinggi
- npm atau yarn package manager

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/posyandu_lansia

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
UPLOAD_DIR=./uploads
QR_CODE_DIR=./uploads/qr
```

**PENTING**: 
- Ganti `username` dan `password` dengan kredensial PostgreSQL Anda
- Ganti `JWT_SECRET` dengan string random yang kuat untuk production
- Sesuaikan `CORS_ORIGIN` dengan URL frontend Anda

### 4. Setup Database

Buat database PostgreSQL:

```bash
createdb posyandu_lansia
```

Atau menggunakan psql:

```sql
CREATE DATABASE posyandu_lansia;
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Jalankan Database Migration

```bash
npm run prisma:migrate
```

### 7. (Optional) Seed Data untuk Development

```bash
npm run prisma:seed
```

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` dengan hot-reload enabled.

### Production Mode

Build aplikasi:

```bash
npm run build
```

Jalankan aplikasi:

```bash
npm start
```

## 📁 Struktur Folder

```
be/
├── src/
│   ├── config/           # Konfigurasi aplikasi (database, JWT, env)
│   ├── middleware/       # Global middleware (auth, validation, error handler)
│   ├── modules/          # Feature modules (auth, users, lansia, pemeriksaan, laporan)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── lansia/
│   │   ├── pemeriksaan/
│   │   └── laporan/
│   ├── utils/            # Utility functions (password, JWT, QR code, response)
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Seed data script
├── uploads/
│   └── qr/               # QR code images
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Menjalankan server dalam development mode dengan hot-reload |
| `npm run build` | Compile TypeScript ke JavaScript |
| `npm start` | Menjalankan server production (setelah build) |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Jalankan database migration |
| `npm run prisma:seed` | Seed database dengan data sample |

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication. Setiap request ke protected endpoint harus menyertakan token di header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

Sistem memiliki 2 role:

1. **ADMIN**: Akses penuh ke semua fitur
2. **PETUGAS**: Akses terbatas untuk input pemeriksaan dan melihat data

## 📖 API Documentation

Dokumentasi lengkap API endpoints tersedia di file `API_DOCUMENTATION.md`.

### Default Credentials (Development)

Setelah menjalankan seed script, gunakan kredensial berikut:

**Admin:**
- Email: `admin@posyandu.com`
- Password: `Admin123`

**Petugas:**
- Email: `petugas1@posyandu.com`
- Password: `Petugas123`

### Endpoint utama:

- **Authentication**: `/api/auth/*`
- **Users Management**: `/api/users/*` (Admin only)
- **Lansia Management**: `/api/lansia/*`
- **Pemeriksaan**: `/api/pemeriksaan/*`
- **Laporan**: `/api/laporan/*` (Admin only)

### Testing

Jalankan test suite lengkap:

```bash
node test-api-complete.js
```

Hasil test tersedia di `TEST_SUMMARY.md` dengan success rate **94.29%** (33/35 tests passed).

### Postman Collection

Import file `Posyandu_Lansia_API.postman_collection.json` ke Postman untuk testing API dengan mudah.

## 🔍 Health Check

Untuk mengecek status server:

```bash
GET http://localhost:5000/health
```

Response:

```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 12345
}
```

## 🛠️ Development

### Database Management

Melihat database dengan Prisma Studio:

```bash
npx prisma studio
```

Reset database (HATI-HATI: akan menghapus semua data):

```bash
npx prisma migrate reset
```

### Debugging

Server menggunakan `ts-node-dev` untuk development yang mendukung:
- Hot reload otomatis saat file berubah
- Source maps untuk debugging
- TypeScript compilation on-the-fly

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Gunakan `JWT_SECRET` yang kuat dan random
- [ ] Konfigurasi `CORS_ORIGIN` dengan whitelist yang spesifik
- [ ] Enable HTTPS
- [ ] Setup proper logging dan monitoring
- [ ] Konfigurasi database backups
- [ ] Setup process manager (PM2, systemd, dll)

### Environment Variables Production

Pastikan semua environment variables sudah di-set dengan benar di production environment.

## 📝 License

ISC

## 👨‍💻 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.
