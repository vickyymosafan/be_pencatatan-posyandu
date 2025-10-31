import { PrismaClient } from '../../generated/prisma';

/**
 * Prisma Client Singleton Instance
 * 
 * Menggunakan singleton pattern untuk memastikan hanya ada satu instance
 * Prisma Client di seluruh aplikasi. Ini penting untuk:
 * - Menghindari terlalu banyak koneksi database
 * - Memanfaatkan connection pooling dengan efisien
 * - Konsistensi dalam development dan production
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Inisialisasi Prisma Client dengan konfigurasi
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Di development, simpan instance ke global untuk hot-reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Test database connection
 * Fungsi untuk memverifikasi koneksi database berhasil
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

/**
 * Disconnect database
 * Fungsi untuk menutup koneksi database dengan graceful
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
};

export default prisma;
