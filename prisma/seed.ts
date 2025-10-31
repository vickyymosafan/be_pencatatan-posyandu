import { PrismaClient, Role } from '../generated/prisma';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.pemeriksaan.deleteMany();
  await prisma.lansia.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Existing data cleared\n');

  // Seed Admin User
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('Admin123');
  const admin = await prisma.user.create({
    data: {
      nama: 'Admin Posyandu',
      email: 'admin@posyandu.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✓ Admin created: ${admin.email}\n`);

  // Seed Petugas Users
  console.log('Creating petugas users...');
  const petugas1Password = await hashPassword('Petugas123');
  const petugas1 = await prisma.user.create({
    data: {
      nama: 'Petugas Satu',
      email: 'petugas1@posyandu.com',
      password: petugas1Password,
      role: Role.PETUGAS,
    },
  });
  console.log(`✓ Petugas 1 created: ${petugas1.email}`);

  const petugas2Password = await hashPassword('Petugas123');
  const petugas2 = await prisma.user.create({
    data: {
      nama: 'Petugas Dua',
      email: 'petugas2@posyandu.com',
      password: petugas2Password,
      role: Role.PETUGAS,
    },
  });
  console.log(`✓ Petugas 2 created: ${petugas2.email}\n`);

  // Seed Lansia
  console.log('Creating lansia data...');
  const lansia1 = await prisma.lansia.create({
    data: {
      nama: 'Budi Santoso',
      nik: '3201012345678901',
      tanggal_lahir: new Date('1950-05-15'),
      alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
      penyakit_bawaan: 'Hipertensi, Diabetes Tipe 2',
      kontak_keluarga: '081234567890',
      qr_code_url: null, // Will be generated via API
    },
  });
  console.log(`✓ Lansia 1 created: ${lansia1.nama}`);

  const lansia2 = await prisma.lansia.create({
    data: {
      nama: 'Siti Aminah',
      nik: '3201012345678902',
      tanggal_lahir: new Date('1955-08-20'),
      alamat: 'Jl. Sudirman No. 456, Jakarta Selatan',
      penyakit_bawaan: 'Kolesterol Tinggi',
      kontak_keluarga: '081234567891',
      qr_code_url: null,
    },
  });
  console.log(`✓ Lansia 2 created: ${lansia2.nama}`);

  const lansia3 = await prisma.lansia.create({
    data: {
      nama: 'Ahmad Yani',
      nik: '3201012345678903',
      tanggal_lahir: new Date('1948-12-10'),
      alamat: 'Jl. Gatot Subroto No. 789, Jakarta Barat',
      penyakit_bawaan: 'Asam Urat, Hipertensi',
      kontak_keluarga: '081234567892',
      qr_code_url: null,
    },
  });
  console.log(`✓ Lansia 3 created: ${lansia3.nama}`);

  const lansia4 = await prisma.lansia.create({
    data: {
      nama: 'Fatimah Zahra',
      nik: '3201012345678904',
      tanggal_lahir: new Date('1952-03-25'),
      alamat: 'Jl. Ahmad Yani No. 321, Jakarta Timur',
      penyakit_bawaan: 'Osteoporosis',
      kontak_keluarga: '081234567893',
      qr_code_url: null,
    },
  });
  console.log(`✓ Lansia 4 created: ${lansia4.nama}`);

  const lansia5 = await prisma.lansia.create({
    data: {
      nama: 'Hasan Basri',
      nik: '3201012345678905',
      tanggal_lahir: new Date('1945-07-17'),
      alamat: 'Jl. Diponegoro No. 654, Jakarta Utara',
      penyakit_bawaan: 'Jantung Koroner, Diabetes',
      kontak_keluarga: '081234567894',
      qr_code_url: null,
    },
  });
  console.log(`✓ Lansia 5 created: ${lansia5.nama}\n`);

  // Seed Pemeriksaan
  console.log('Creating pemeriksaan data...');
  
  // Pemeriksaan for Lansia 1
  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia1.id,
      tanggal: new Date('2024-10-01'),
      tekanan_darah: '140/90',
      berat_badan: '65',
      gula_darah: '150',
      kolesterol: '220',
      keluhan: 'Merasa pusing dan lemas',
      createdBy: petugas1.id,
    },
  });

  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia1.id,
      tanggal: new Date('2024-10-15'),
      tekanan_darah: '135/85',
      berat_badan: '64',
      gula_darah: '140',
      kolesterol: '210',
      keluhan: 'Kondisi membaik, masih sedikit pusing',
      createdBy: petugas1.id,
    },
  });

  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia1.id,
      tanggal: new Date('2024-10-30'),
      tekanan_darah: '130/80',
      berat_badan: '64',
      gula_darah: '130',
      kolesterol: '200',
      keluhan: 'Kondisi stabil',
      createdBy: petugas2.id,
    },
  });

  // Pemeriksaan for Lansia 2
  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia2.id,
      tanggal: new Date('2024-10-05'),
      tekanan_darah: '120/80',
      berat_badan: '58',
      gula_darah: '110',
      kolesterol: '240',
      keluhan: 'Nyeri sendi lutut',
      createdBy: petugas1.id,
    },
  });

  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia2.id,
      tanggal: new Date('2024-10-20'),
      tekanan_darah: '125/80',
      berat_badan: '57',
      gula_darah: '115',
      kolesterol: '230',
      keluhan: 'Nyeri sendi berkurang',
      createdBy: petugas2.id,
    },
  });

  // Pemeriksaan for Lansia 3
  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia3.id,
      tanggal: new Date('2024-10-10'),
      tekanan_darah: '145/95',
      berat_badan: '70',
      gula_darah: '120',
      kolesterol: '200',
      keluhan: 'Nyeri pada persendian, terutama jari tangan',
      createdBy: petugas1.id,
    },
  });

  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia3.id,
      tanggal: new Date('2024-10-25'),
      tekanan_darah: '140/90',
      berat_badan: '69',
      gula_darah: '118',
      kolesterol: '195',
      keluhan: 'Kondisi membaik setelah minum obat',
      createdBy: petugas2.id,
    },
  });

  // Pemeriksaan for Lansia 4
  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia4.id,
      tanggal: new Date('2024-10-12'),
      tekanan_darah: '130/85',
      berat_badan: '52',
      gula_darah: '105',
      kolesterol: '190',
      keluhan: 'Nyeri punggung bagian bawah',
      createdBy: petugas1.id,
    },
  });

  // Pemeriksaan for Lansia 5
  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia5.id,
      tanggal: new Date('2024-10-08'),
      tekanan_darah: '150/95',
      berat_badan: '68',
      gula_darah: '160',
      kolesterol: '230',
      keluhan: 'Sesak napas saat beraktivitas',
      createdBy: petugas2.id,
    },
  });

  await prisma.pemeriksaan.create({
    data: {
      lansiaId: lansia5.id,
      tanggal: new Date('2024-10-22'),
      tekanan_darah: '145/90',
      berat_badan: '67',
      gula_darah: '150',
      kolesterol: '220',
      keluhan: 'Kondisi sedikit membaik, masih sesak saat naik tangga',
      createdBy: petugas1.id,
    },
  });

  console.log('✓ 10 pemeriksaan records created\n');

  console.log('========================================');
  console.log('✅ Database seeding completed!');
  console.log('========================================\n');
  console.log('Login credentials:');
  console.log('Admin:');
  console.log('  Email: admin@posyandu.com');
  console.log('  Password: Admin123\n');
  console.log('Petugas 1:');
  console.log('  Email: petugas1@posyandu.com');
  console.log('  Password: Petugas123\n');
  console.log('Petugas 2:');
  console.log('  Email: petugas2@posyandu.com');
  console.log('  Password: Petugas123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
