-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PETUGAS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PETUGAS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lansia" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT NOT NULL,
    "penyakit_bawaan" TEXT NOT NULL,
    "kontak_keluarga" TEXT NOT NULL,
    "qr_code_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lansia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan" (
    "id" TEXT NOT NULL,
    "lansiaId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tekanan_darah" TEXT NOT NULL,
    "berat_badan" TEXT NOT NULL,
    "gula_darah" TEXT NOT NULL,
    "kolesterol" TEXT NOT NULL,
    "keluhan" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemeriksaan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lansia_nik_key" ON "lansia"("nik");

-- CreateIndex
CREATE INDEX "lansia_nik_idx" ON "lansia"("nik");

-- CreateIndex
CREATE INDEX "lansia_nama_idx" ON "lansia"("nama");

-- CreateIndex
CREATE INDEX "pemeriksaan_lansiaId_idx" ON "pemeriksaan"("lansiaId");

-- CreateIndex
CREATE INDEX "pemeriksaan_createdBy_idx" ON "pemeriksaan"("createdBy");

-- CreateIndex
CREATE INDEX "pemeriksaan_tanggal_idx" ON "pemeriksaan"("tanggal");

-- AddForeignKey
ALTER TABLE "pemeriksaan" ADD CONSTRAINT "pemeriksaan_lansiaId_fkey" FOREIGN KEY ("lansiaId") REFERENCES "lansia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan" ADD CONSTRAINT "pemeriksaan_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
