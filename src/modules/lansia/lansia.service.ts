import prisma from '../../config/database';
import { ConflictError, NotFoundError } from '../../utils/errors';
import { generateLansiaQRCode } from '../../utils/qrcode.util';
import {
  CreateLansiaDTO,
  UpdateLansiaDTO,
  LansiaFilterDTO,
  LansiaWithHistory,
  LansiaResponse,
} from './lansia.types';

/**
 * Lansia Service
 * 
 * Business logic untuk lansia management operations.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4
 */

/**
 * Get all lansia dengan pagination, search, dan sorting
 * 
 * @param filters - Filter parameters (page, limit, search, sortBy, sortOrder)
 * @returns Paginated lansia data
 * 
 * Requirements: 4.2
 */
export const getAllLansia = async (filters: LansiaFilterDTO) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause untuk search
  const whereClause = search
    ? {
        OR: [
          { nama: { contains: search, mode: 'insensitive' as const } },
          { nik: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get total count untuk pagination info
  const total = await prisma.lansia.count({
    where: whereClause,
  });

  // Get lansia dengan pagination dan sorting
  const lansia = await prisma.lansia.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return {
    data: lansia,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get lansia by ID dengan riwayat pemeriksaan terakhir
 * 
 * @param id - Lansia ID
 * @returns Lansia data dengan last 10 pemeriksaan
 * @throws NotFoundError jika lansia tidak ditemukan
 * 
 * Requirements: 4.3
 */
export const getLansiaById = async (id: string): Promise<LansiaWithHistory> => {
  const lansia = await prisma.lansia.findUnique({
    where: { id },
    include: {
      pemeriksaan: {
        take: 10,
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              nama: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!lansia) {
    throw new NotFoundError('Lansia');
  }

  return lansia;
};

/**
 * Create new lansia dengan auto-generate QR code
 * 
 * @param lansiaData - Lansia data untuk create
 * @returns Created lansia data dengan qr_code_url
 * @throws ConflictError jika NIK sudah terdaftar
 * 
 * Requirements: 4.1, 4.5, 5.1, 5.2, 5.3
 */
export const createLansia = async (
  lansiaData: CreateLansiaDTO
): Promise<LansiaResponse> => {
  const { nama, nik, tanggal_lahir, alamat, penyakit_bawaan, kontak_keluarga } =
    lansiaData;

  // Check NIK uniqueness
  const existingLansia = await prisma.lansia.findUnique({
    where: { nik },
  });

  if (existingLansia) {
    throw new ConflictError('NIK sudah terdaftar');
  }

  // Create lansia first tanpa qr_code_url
  const lansia = await prisma.lansia.create({
    data: {
      nama,
      nik,
      tanggal_lahir: new Date(tanggal_lahir),
      alamat,
      penyakit_bawaan,
      kontak_keluarga,
    },
  });

  // Generate QR Code dengan ID yang baru dibuat
  try {
    const qrCodeUrl = await generateLansiaQRCode(lansia.id);

    // Update lansia dengan qr_code_url
    const updatedLansia = await prisma.lansia.update({
      where: { id: lansia.id },
      data: { qr_code_url: qrCodeUrl },
    });

    return updatedLansia;
  } catch (error) {
    // Log error tapi tetap return lansia data
    // QR code generation failure tidak boleh block create operation
    console.error('QR Code generation failed:', error);
    
    // Return lansia tanpa qr_code_url (akan null)
    return lansia;
  }
};

/**
 * Update lansia
 * 
 * @param id - Lansia ID
 * @param lansiaData - Lansia data untuk update (partial)
 * @returns Updated lansia data
 * @throws NotFoundError jika lansia tidak ditemukan
 * @throws ConflictError jika NIK baru sudah terdaftar
 * 
 * Requirements: 4.4, 4.5
 */
export const updateLansia = async (
  id: string,
  lansiaData: UpdateLansiaDTO
): Promise<LansiaResponse> => {
  // Check if lansia exists
  const existingLansia = await prisma.lansia.findUnique({
    where: { id },
  });

  if (!existingLansia) {
    throw new NotFoundError('Lansia');
  }

  // Check NIK uniqueness jika NIK diubah
  if (lansiaData.nik && lansiaData.nik !== existingLansia.nik) {
    const nikExists = await prisma.lansia.findUnique({
      where: { nik: lansiaData.nik },
    });

    if (nikExists) {
      throw new ConflictError('NIK sudah terdaftar');
    }
  }

  // Prepare update data
  const updateData: any = {
    nama: lansiaData.nama,
    nik: lansiaData.nik,
    alamat: lansiaData.alamat,
    penyakit_bawaan: lansiaData.penyakit_bawaan,
    kontak_keluarga: lansiaData.kontak_keluarga,
  };

  // Convert tanggal_lahir to Date jika ada
  if (lansiaData.tanggal_lahir) {
    updateData.tanggal_lahir = new Date(lansiaData.tanggal_lahir);
  }

  // Update lansia
  const lansia = await prisma.lansia.update({
    where: { id },
    data: updateData,
  });

  return lansia;
};

/**
 * Delete lansia
 * 
 * @param id - Lansia ID
 * @throws NotFoundError jika lansia tidak ditemukan
 * 
 * Requirements: 4.4
 * Note: Pemeriksaan akan di-cascade delete karena onDelete: Cascade di schema
 */
export const deleteLansia = async (id: string): Promise<void> => {
  // Check if lansia exists
  const existingLansia = await prisma.lansia.findUnique({
    where: { id },
  });

  if (!existingLansia) {
    throw new NotFoundError('Lansia');
  }

  // Delete lansia (cascade delete pemeriksaan)
  await prisma.lansia.delete({
    where: { id },
  });
};

/**
 * Get QR Code public URL untuk lansia
 * 
 * @param id - Lansia ID
 * @returns QR Code public URL dari Supabase Storage
 * @throws NotFoundError jika lansia tidak ditemukan atau QR code tidak ada
 * 
 * Requirements: 5.4
 */
export const getQRCodeUrl = async (id: string): Promise<string> => {
  const lansia = await prisma.lansia.findUnique({
    where: { id },
    select: {
      id: true,
      qr_code_url: true,
    },
  });

  if (!lansia) {
    throw new NotFoundError('Lansia');
  }

  if (!lansia.qr_code_url) {
    throw new NotFoundError('QR Code');
  }

  return lansia.qr_code_url;
};
